'use client';

import { DonutChart, MiniBarChart, ChartLegend } from '@/components/ui/Charts';
import type { Employee, Department } from '@/lib/types';

// ─── Brand palette for charts ──────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  FULL_TIME:  '#2563EB',
  PART_TIME:  '#7C3AED',
  CONTRACT:   '#D97706',
  INTERN:     '#059669',
  DAILY_WAGE: '#DC2626',
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:     '#067647',
  INACTIVE:   '#667085',
  ON_LEAVE:   '#B54708',
  TERMINATED: '#B42318',
};
const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time',
  CONTRACT: 'Contract', INTERN: 'Intern', DAILY_WAGE: 'Daily Wage',
};

interface OverviewProps {
  employees: Employee[];
  departments: Department[];
}

export function HROverview({ employees, departments }: OverviewProps) {
  const total   = employees.length;
  const active  = employees.filter((e) => e.employmentStatus === 'ACTIVE').length;
  const onLeave = employees.filter((e) => e.employmentStatus === 'ON_LEAVE').length;
  const inactive = employees.filter((e) => e.employmentStatus === 'INACTIVE').length;

  // Employment type breakdown
  const typeCounts: Record<string, number> = {};
  for (const e of employees) typeCounts[e.employmentType] = (typeCounts[e.employmentType] ?? 0) + 1;
  const typeSlices = Object.entries(typeCounts).map(([k, v]) => ({
    label: TYPE_LABELS[k] ?? k,
    value: v,
    color: TYPE_COLORS[k] ?? '#94A3B8',
  }));

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const e of employees) statusCounts[e.employmentStatus] = (statusCounts[e.employmentStatus] ?? 0) + 1;
  const statusSlices = Object.entries(statusCounts).map(([k, v]) => ({
    label: k.replace('_', ' '),
    value: v,
    color: STATUS_COLORS[k] ?? '#94A3B8',
    pct: `${Math.round((v / total) * 100)}%`,
  }));

  // Dept headcount (top 6)
  const deptCounts: Record<string, { name: string; count: number }> = {};
  for (const e of employees) {
    if (e.departmentId && e.department) {
      deptCounts[e.departmentId] = {
        name: e.department.name.length > 6 ? e.department.name.slice(0, 5) + '…' : e.department.name,
        count: (deptCounts[e.departmentId]?.count ?? 0) + 1,
      };
    }
  }
  const deptBars = Object.values(deptCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((d, i) => ({
      label: d.name,
      value: d.count,
      color: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'][i],
    }));

  const activePct = total ? Math.round((active / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard
          label="Total Employees"
          value={total}
          icon={<PeopleIcon />}
          accent="#2563EB"
          bg="#EAF2FF"
          sub={`${departments.length} departments`}
        />
        <KpiCard
          label="Active"
          value={active}
          icon={<CheckIcon />}
          accent="#067647"
          bg="#ECFDF3"
          sub={`${activePct}% of workforce`}
        />
        <KpiCard
          label="On Leave"
          value={onLeave}
          icon={<LeaveIcon />}
          accent="#B54708"
          bg="#FFFAEB"
          sub="Currently away"
        />
        <KpiCard
          label="Inactive"
          value={inactive}
          icon={<InactiveIcon />}
          accent="#667085"
          bg="#F2F4F7"
          sub="Deactivated records"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 16 }}>
        {/* Employment Type Donut */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Employment Type</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <DonutChart
              data={typeSlices}
              size={130}
              thickness={22}
              centerValue={total}
              centerLabel="Staff"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <ChartLegend items={typeSlices.map((s) => ({ ...s, pct: `${Math.round((s.value / total) * 100)}%` }))} />
            </div>
          </div>
        </div>

        {/* Status Donut */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Workforce Status</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <DonutChart
              data={statusSlices}
              size={130}
              thickness={22}
              centerValue={`${activePct}%`}
              centerLabel="Active"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <ChartLegend items={statusSlices} />
            </div>
          </div>
        </div>

        {/* Dept Headcount Bar */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Headcount by Department</h3>
          </div>
          <div className="card-body" style={{ overflowX: 'auto' }}>
            {deptBars.length > 0 ? (
              <MiniBarChart data={deptBars} height={130} />
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No department data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  sub: string;
}

function KpiCard({ label, value, icon, accent, bg, sub }: KpiCardProps) {
  return (
    <div
      className="card"
      style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: bg, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#667085', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </p>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#0B1220', lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: 12, color: accent, marginTop: 2, fontWeight: 500 }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function PeopleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LeaveIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function InactiveIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
    </svg>
  );
}
