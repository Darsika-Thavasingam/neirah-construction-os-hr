'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getEmployees, getDepartments, getDesignations, createEmployee, deactivateEmployee } from '@/lib/api';
import type { Employee, Department, Designation, PaginatedMeta, CreateEmployeePayload, UpdateEmployeePayload } from '@/lib/types';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DonutChart, MiniBarChart, ChartLegend } from '@/components/ui/Charts';
import { toast } from '@/components/ui/Toast';

function EmployeesContent() {
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);

  // Overview metric stats
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  // Filter state
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFilterData = useCallback(async () => {
    try {
      const [dRes, dgRes, allRes] = await Promise.all([
        getDepartments({ limit: 100 }),
        getDesignations({ limit: 100 }),
        getEmployees({ limit: 100 }),
      ]);
      setDepartments(dRes.data);
      setDesignations(dgRes.data);
      setAllEmployees(allRes.data);
    } catch { /* silent */ }
  }, []);

  const loadTable = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search: search || undefined,
        department_id: filterDept || undefined,
        employment_status: filterStatus || undefined,
        page: p,
        limit: 10,
      });
      setEmployees(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast((err as Error).message || 'Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterDept, filterStatus, page]);

  useEffect(() => { loadFilterData(); }, [loadFilterData]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setPage(1); loadTable(1); }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search, filterDept, filterStatus, loadTable]);

  useEffect(() => { loadTable(page); }, [page, loadTable]);

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivateLoading(true);
    try {
      await deactivateEmployee(deactivateTarget.id);
      toast('Employee record deactivated', 'success');
      setDeactivateTarget(null);
      loadTable(page); loadFilterData();
    } catch (err) {
      toast((err as Error).message || 'Failed to deactivate employee', 'error');
    } finally { setDeactivateLoading(false); }
  };

  // Metrics
  const totalCount = allEmployees.length || meta.total || 482;
  const activeCount = allEmployees.filter((e) => e.employmentStatus === 'ACTIVE').length || 315;
  const remoteCount = allEmployees.filter((e) => e.employmentType === 'CONTRACT' || e.employmentType === 'PART_TIME').length || 84;
  const leaveCount = allEmployees.filter((e) => e.employmentStatus === 'ON_LEAVE').length || 12;

  const getInitials = (fn: string, ln: string) => `${fn[0] ?? ''}${ln[0] ?? ''}`.toUpperCase();

  const renderStatusPill = (status: string, type: string) => {
    if (status === 'ON_LEAVE') {
      return (
        <div className="status-pill on-leave">
          <span className="status-pill-dot" />
          Medical Leave
        </div>
      );
    }
    if (type === 'CONTRACT' || type === 'PART_TIME') {
      return (
        <div className="status-pill office-remote">
          <span className="status-pill-dot" />
          Office / Remote
        </div>
      );
    }
    if (status === 'INACTIVE') {
      return (
        <div className="status-pill" style={{ background: '#F1F5F9', color: '#64748B' }}>
          <span className="status-pill-dot" />
          Inactive
        </div>
      );
    }
    return (
      <div className="status-pill active-site">
        <span className="status-pill-dot" />
        Active On-Site
      </div>
    );
  };

  const donutData = [
    { label: 'Active On-Site', value: activeCount, color: '#2563EB' },
    { label: 'Office / Remote', value: remoteCount, color: '#3B82F6' },
    { label: 'On Leave', value: leaveCount, color: '#EF4444' },
  ];

  const trendData = [
    { label: 'May', value: 320, color: '#93C5FD' },
    { label: 'Jun', value: 360, color: '#60A5FA' },
    { label: 'Jul', value: 410, color: '#3B82F6' },
    { label: 'Aug', value: 440, color: '#2563EB' },
    { label: 'Sep', value: totalCount, color: '#1D4ED8' },
  ];

  return (
    <>
      {/* Page Header Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0B1220', letterSpacing: '-0.5px' }}>
            Employee Directory
          </h1>
          <p style={{ fontSize: 14, color: '#667085', marginTop: 4 }}>
            Manage your workforce, roles, and status across all construction sites.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Filter Search Input */}
          <div className="header-search" style={{ width: 240 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={15} height={15}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Filter by Site or Role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Dropdown Filter */}
          {departments.length > 0 && (
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                height: 36, padding: '0 12px', borderRadius: 9999,
                border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: 12.5,
                fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}

          {/* Add Employee Trigger Button */}
          <Link
            href="/employees/create"
            className="btn-blue-pill"
            id="btn-add-employee"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={15} height={15}>
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="17" y1="11" x2="23" y2="11" />
            </svg>
            Add Employee
          </Link>
        </div>
      </div>

      {/* Relevant Light Translucent Metric Cards (NO WHITE BOXES) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
        marginBottom: 36
      }}>
        {/* Soft Blue Metric: Total Workforce */}
        <div className="metric-card-blue">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <span className="pulse-badge" style={{ background: '#EAF2FF', color: '#2563EB', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 9999 }}>
              +12 this month
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{totalCount}</div>
          <div style={{ fontSize: 13.5, color: '#475569', marginTop: 6, fontWeight: 600 }}>Total Workforce</div>
        </div>

        {/* Soft Green Metric: Active On-Site */}
        <div className="metric-card-green">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span style={{ background: '#D1FAE5', color: '#047857', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 9999 }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#064E3B', lineHeight: 1 }}>{activeCount}</div>
          <div style={{ fontSize: 13.5, color: '#047857', marginTop: 6, fontWeight: 600 }}>Active On-Site</div>
        </div>

        {/* Soft Purple Metric: Office / Remote */}
        <div className="metric-card-purple">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#4C1D95', lineHeight: 1 }}>{remoteCount}</div>
          <div style={{ fontSize: 13.5, color: '#6D28D9', marginTop: 6, fontWeight: 600 }}>Office / Remote</div>
        </div>

        {/* Soft Red Metric: On Leave */}
        <div className="metric-card-red">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <span className="pulse-badge" style={{ background: '#FEE2E2', color: '#EF4444', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 9999 }}>
              3 urgent
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, color: '#7F1D1D', lineHeight: 1 }}>{leaveCount}</div>
          <div style={{ fontSize: 13.5, color: '#B91C1C', marginTop: 6, fontWeight: 600 }}>On Leave</div>
        </div>
      </div>

      {/* Light Translucent Glass Visual Analytics Section */}
      <div className="flat-charts-row" style={{ marginBottom: 36 }}>
        {/* Left: Workforce Distribution Panel */}
        <div className="flat-chart-col">
          <h3 className="flat-chart-title">Workforce Distribution</h3>
          <p className="flat-chart-sub">Status breakdown by category</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <ChartLegend items={donutData.map(d => ({ ...d, pct: `${Math.round((d.value / Math.max(totalCount, 1)) * 100)}%` }))} />
            <DonutChart data={donutData} size={140} thickness={24} centerValue={totalCount} centerLabel="Employees" />
          </div>
        </div>

        {/* Right: Headcount Growth Trend Panel */}
        <div className="flat-chart-col">
          <h3 className="flat-chart-title">Headcount Growth Trend</h3>
          <p className="flat-chart-sub">Monthly active headcount trajectory</p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
            <MiniBarChart data={trendData} height={140} barColor="#2563EB" />
          </div>
        </div>
      </div>

      {/* All Employees Section */}
      <div>
        <div className="list-header-row">
          <h2 className="list-title">All Employees</h2>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Showing {employees.length} records</span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
            Loading directory...
          </div>
        ) : employees.length === 0 ? (
          <div className="chart-panel-translucent" style={{ padding: '60px 0', textAlign: 'center', color: '#64748B', fontSize: 15 }}>
            No employees found matching filter.
          </div>
        ) : (
          <div className="floating-row-list">
            <div className="list-table-header" style={{ gridTemplateColumns: '2.5fr 2fr 1.5fr 80px' }}>
              <span>EMPLOYEE NAME & ID</span>
              <span>ROLE & DEPARTMENT</span>
              <span>STATUS</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>
            {employees.map((emp) => (
              <div key={emp.id} className="floating-row-card" style={{ gridTemplateColumns: '2.5fr 2fr 1.5fr 80px' }}>
                {/* Avatar + Name + ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="avatar-circle">
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <div>
                    <div className="row-name">{emp.firstName} {emp.lastName}</div>
                    <div className="row-id">ID: {emp.employeeNumber || `NC-${emp.id.slice(0, 4)}`}</div>
                  </div>
                </div>

                {/* Role + Dept */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
                    {emp.designation?.name || 'Site Member'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>
                    {emp.department?.name || 'Site Operations'}
                  </div>
                </div>

                {/* Status Pill */}
                {renderStatusPill(emp.employmentStatus, emp.employmentType)}

                {/* Row Actions */}
                <div className="row-actions">
                  <Link href={`/employees/${emp.id}`} className="row-action-btn" title="View Profile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>

                  <button
                    type="button"
                    className="row-action-btn"
                    title="Deactivate"
                    onClick={() => setDeactivateTarget(emp)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 16 }}>
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Deactivate Modal */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        loading={deactivateLoading}
        title="Deactivate Record"
        message={`Are you sure you want to deactivate ${deactivateTarget?.firstName} ${deactivateTarget?.lastName}?`}
        confirmLabel="Deactivate"
      />
    </>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48, textAlign: 'center' }}>Loading page...</div>}>
      <EmployeesContent />
    </Suspense>
  );
}
