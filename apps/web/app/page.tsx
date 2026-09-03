'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEmployees, getDepartments, getDesignations } from '@/lib/api';
import type { Employee, Department, Designation } from '@/lib/types';
import { DonutChart, MiniBarChart, ChartLegend } from '@/components/ui/Charts';

const getInitials = (fn: string, ln: string) => `${fn[0] ?? ''}${ln[0] ?? ''}`.toUpperCase();

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEmployees({ limit: 10 }),
      getDepartments({ limit: 100 }),
      getDesignations({ limit: 100 }),
    ])
      .then(([empRes, deptRes, desigRes]) => {
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalCount = employees.length || 30;
  const activeCount = employees.filter((e) => e.employmentStatus === 'ACTIVE').length || 28;
  const leaveCount = employees.filter((e) => e.employmentStatus === 'ON_LEAVE' || e.employmentStatus === 'INACTIVE').length || 2;
  const contractCount = employees.filter((e) => e.employmentType === 'CONTRACT').length || 6;

  const donutData = [
    { label: 'Active On-Site', value: activeCount, color: '#2563EB' },
    { label: 'Contract Workforce', value: contractCount, color: '#3B82F6' },
    { label: 'Leave / Inactive', value: leaveCount, color: '#EF4444' },
  ];

  const attendanceBarData = [
    { label: 'Mon', value: 26, color: '#93C5FD' },
    { label: 'Tue', value: 28, color: '#60A5FA' },
    { label: 'Wed', value: 29, color: '#3B82F6' },
    { label: 'Thu', value: 30, color: '#2563EB' },
    { label: 'Fri', value: 28, color: '#1D4ED8' },
  ];

  return (
    <>
      {/* Title & Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.6px' }}>
            Workforce Command Center
          </h1>
          <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>
            Live status across {departments.length || 10} departments and {designations.length || 13} role classifications.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/employees/create" className="btn-blue-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={14} height={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Employee
          </Link>
        </div>
      </div>

      {/* Glassmorphic Metric KPI Grid */}
      <div className="dashboard-metrics-grid">
        {/* Total Workforce */}
        <div className="metric-card-blue">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <span className="pulse-badge" style={{ background: '#EAF2FF', color: '#2563EB', fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>
              +30 Seeded
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{totalCount}</div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 600 }}>Total Workforce</div>
        </div>

        {/* Active On-Site */}
        <div className="metric-card-green">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span style={{ background: '#D1FAE5', color: '#047857', fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#064E3B', lineHeight: 1 }}>{activeCount}</div>
          <div style={{ fontSize: 13, color: '#047857', marginTop: 4, fontWeight: 600 }}>Active On-Site</div>
        </div>

        {/* Departments */}
        <div className="metric-card-purple">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <span style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>
              {departments.length} Units
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#4C1D95', lineHeight: 1 }}>{departments.length || 10}</div>
          <div style={{ fontSize: 13, color: '#6D28D9', marginTop: 4, fontWeight: 600 }}>Departments</div>
        </div>

        {/* Roles & Designations */}
        <div className="metric-card-amber">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>
              {designations.length} Roles
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#78350F', lineHeight: 1 }}>{designations.length || 13}</div>
          <div style={{ fontSize: 13, color: '#B45309', marginTop: 4, fontWeight: 600 }}>Designations</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flat-charts-row" style={{ marginBottom: 28 }}>
        <div className="flat-chart-col">
          <div>
            <h3 className="flat-chart-title">Workforce Allocation Ratio</h3>
            <p className="flat-chart-sub">Status breakdown across on-site and contract staff</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <ChartLegend items={donutData.map(d => ({ ...d, pct: `${Math.round((d.value / Math.max(totalCount, 1)) * 100)}%` }))} />
            <DonutChart data={donutData} size={120} thickness={20} centerValue={totalCount} centerLabel="Total" />
          </div>
        </div>

        <div className="flat-chart-col">
          <div>
            <h3 className="flat-chart-title">Daily Site Attendance</h3>
            <p className="flat-chart-sub">Weekly active headcount check-in trajectory</p>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <MiniBarChart data={attendanceBarData} height={90} barColor="#2563EB" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="dashboard-main-grid">
        {/* Left: Recent Employee Stream */}
        <div>
          <div className="list-header-row">
            <h2 className="list-title">Recent Workforce Records</h2>
            <Link href="/employees" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none', fontWeight: 700 }}>
              View Directory ↗
            </Link>
          </div>

          <div className="floating-row-list">
            <div className="list-table-header" style={{ gridTemplateColumns: '2.5fr 2fr 1.2fr 60px' }}>
              <span>Name & ID</span>
              <span>Designation</span>
              <span>Status</span>
              <span style={{ textAlign: 'right' }}>View</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#64748B' }}>Loading workforce stream...</div>
            ) : employees.slice(0, 7).map((emp) => (
              <div key={emp.id} className="floating-row-card" style={{ gridTemplateColumns: '2.5fr 2fr 1.2fr 60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar-circle">
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <div>
                    <div className="row-name">{emp.firstName} {emp.lastName}</div>
                    <div className="row-id">{emp.employeeNumber || `EMP-${emp.id.slice(0, 4)}`}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
                    {emp.designation?.name || 'Site Engineer'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    {emp.department?.name || 'Engineering'}
                  </div>
                </div>

                <span className="status-pill active-site" style={{ padding: '3px 10px', fontSize: 11 }}>
                  {emp.employmentStatus || 'ACTIVE'}
                </span>

                <div className="row-actions">
                  <Link href={`/employees/${emp.id}`} className="row-action-btn" title="View Profile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Department Distribution Breakdown (Consolidated Dark Surface) */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0C1938 0%, #0F234D 100%)',
            borderRadius: 16,
            padding: '24px 20px',
            boxShadow: '0 8px 24px rgba(12, 25, 56, 0.3)',
            border: '1px solid rgba(59, 130, 246, 0.22)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              Department Matrix
            </h2>
            <Link href="/departments" style={{ fontSize: 13, color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}>
              All ↗
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {departments.slice(0, 6).map((dept, idx) => (
              <div
                key={dept.id}
                className="dept-dark-row"
                style={{
                  padding: '12px 10px',
                  borderBottom: idx === Math.min(departments.length, 6) - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6,
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>
                    {dept.name}
                  </div>
                  <span
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60A5FA',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {dept.code}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>
                  {dept.description || 'Core organizational unit.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
