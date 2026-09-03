'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getEmployeeById, getAssignments, deleteAssignment } from '@/lib/api';
import type { Employee, EmployeeProjectAssignment, CreateAssignmentPayload } from '@/lib/types';
import { formatDate } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AssignmentForm } from '@/components/employees/AssignmentForm';
import { toast } from '@/components/ui/Toast';

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<EmployeeProjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Assignment modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeProjectAssignment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, assRes] = await Promise.all([
        getEmployeeById(id),
        getAssignments(id),
      ]);
      setEmployee(empRes.data);
      setAssignments(assRes.data);
    } catch (err) {
      toast((err as Error).message || 'Failed to load employee details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteAssignment = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAssignment(id, deleteTarget.id);
      toast('Assignment removed', 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast((err as Error).message || 'Failed to remove assignment', 'error');
    } finally { setDeleteLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
        Loading profile...
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Employee Not Found</h2>
        <Link href="/employees" className="btn-blue-pill" style={{ marginTop: 16 }}>
          Return to Directory
        </Link>
      </div>
    );
  }

  const initials = `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`.toUpperCase();

  return (
    <>
      {/* Profile Hero Header Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-hero-img">
            {initials}
          </div>

          <div>
            <h1 className="profile-hero-name">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="profile-hero-sub">
              {employee.designation?.name || 'Site Engineer'} • {employee.department?.name || 'Engineering Dept'}
            </p>

            <div className="profile-tags">
              <span className="profile-tag-pill" style={{ color: '#047857' }}>
                <span className="status-pill-dot" style={{ background: '#10B981', width: 6, height: 6, borderRadius: '50%' }} />
                ON-SITE
              </span>
              <span className="profile-tag-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Sector 4, North Wing
              </span>
              <span className="profile-tag-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {employee.employmentType.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-outline-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={15} height={15}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Message
          </button>
          <Link href={`/employees/${id}/edit`} className="btn-blue-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={15} height={15}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="profile-grid-layout">
        {/* Main Column */}
        <div>
          {/* Core Details Card */}
          <div className="profile-section-card">
            <div className="profile-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2} width={18} height={18}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Core Details
              </span>
            </div>

            <div className="details-grid">
              <div>
                <div className="detail-item-label">EMPLOYEE ID</div>
                <div className="detail-item-value">{employee.employeeNumber}</div>
              </div>
              <div>
                <div className="detail-item-label">EMAIL ADDRESS</div>
                <div className="detail-item-value">{employee.email || 'N/A'}</div>
              </div>
              <div>
                <div className="detail-item-label">PHONE NUMBER</div>
                <div className="detail-item-value">{employee.phone || 'N/A'}</div>
              </div>
              <div>
                <div className="detail-item-label">JOIN DATE</div>
                <div className="detail-item-value">{formatDate(employee.joiningDate)}</div>
              </div>
              <div>
                <div className="detail-item-label">NATIONAL ID / NIC</div>
                <div className="detail-item-value">{employee.nicOrId || 'N/A'}</div>
              </div>
              <div>
                <div className="detail-item-label">EMERGENCY CONTACT</div>
                <div className="detail-item-value">{employee.emergencyContact || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Progression Stream */}
          <div className="profile-section-card">
            <div className="profile-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2} width={18} height={18}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Progression Stream
              </span>
            </div>

            <div className="timeline-stream">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <span className="timeline-date">2022 - Present</span>
                <div className="timeline-role">{employee.designation?.name || 'Senior Site Supervisor'}</div>
                <div className="timeline-desc">
                  Promoted to oversee structural integrity, safety protocols, and daily team assignments.
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot past" />
                <span className="timeline-date">2019 - 2022</span>
                <div className="timeline-role">Site Engineer</div>
                <div className="timeline-desc">
                  Managed daily structural checks and coordinated with sub-contractors on site.
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot past" />
                <span className="timeline-date">2018 - 2019</span>
                <div className="timeline-role">Junior Engineer</div>
                <div className="timeline-desc">
                  Initial onboarding and foundation surveying for key construction zones.
                </div>
              </div>
            </div>
          </div>

          {/* Project Assignments */}
          <div className="profile-section-card">
            <div className="profile-section-title">
              <span>Project Assignments</span>
              <button
                className="btn-outline-pill"
                style={{ fontSize: 12, padding: '4px 12px' }}
                onClick={() => setAssignModalOpen(true)}
              >
                + Assign Project
              </button>
            </div>

            {assignments.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: 13.5 }}>No active project assignments.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map((ass) => (
                  <div
                    key={ass.id}
                    style={{
                      background: '#F1F5F9', borderRadius: 12, padding: '14px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0B1220' }}>
                        {ass.assignmentRole || 'Site Member'}
                      </div>
                      <div style={{ fontSize: 12, color: '#667085', marginTop: 2 }}>
                        Started {formatDate(ass.startDate)} {ass.endDate ? `• Ended ${formatDate(ass.endDate)}` : '• Present'}
                      </div>
                    </div>
                    <span className="status-pill status-active" style={{ padding: '4px 10px', fontSize: 11 }}>
                      <span className="status-pill-dot" style={{ background: '#12B76A' }} />
                      {ass.status}
                    </span>
                    <button
                      className="row-action-btn"
                      onClick={() => setDeleteTarget(ass)}
                      title="Remove"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2} width={15} height={15}>
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div>
          {/* Consolidated Dark Surface Column: Performance & Certifications */}
          <div
            style={{
              background: 'linear-gradient(145deg, #0C1938 0%, #0F234D 100%)',
              borderRadius: 16,
              padding: '24px 20px',
              boxShadow: '0 8px 24px rgba(12, 25, 56, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {/* Performance Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FFFFFF', fontWeight: 600, fontSize: 16 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} width={18} height={18}>
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Performance
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
                <div style={{ fontSize: 42, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>
                  4.8
                </div>
                <div style={{ color: '#60A5FA', marginTop: 6, fontSize: 15 }}>★ ★ ★ ★ ★</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Q3 2023 Review</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                    <span>Safety Compliance</span>
                    <span style={{ color: '#60A5FA' }}>98%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: '98%', height: '100%', background: '#3B82F6', borderRadius: 99 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                    <span>Project Delivery</span>
                    <span style={{ color: '#60A5FA' }}>92%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: '#3B82F6', borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Rule */}
            <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />

            {/* Certifications Section */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={2} width={18} height={18}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Certifications
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#FFFFFF' }}>OSHA 30-Hour</div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8' }}>Valid until Dec 2025</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#FFFFFF' }}>Advanced Structural Analysis</div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8' }}>Completed Aug 2021</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal open={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign to Project">
        <AssignmentForm
          onSubmit={async (data) => {
            setAssignLoading(true);
            try {
              const { createAssignment } = await import('@/lib/api');
              await createAssignment(id, data as Omit<CreateAssignmentPayload, 'tenant_id'>);
              toast('Project assigned successfully', 'success');
              setAssignModalOpen(false);
              loadData();
            } catch (err) {
              toast((err as Error).message || 'Failed to assign project', 'error');
            } finally { setAssignLoading(false); }
          }}
          loading={assignLoading}
          onCancel={() => setAssignModalOpen(false)}
        />
      </Modal>

      {/* Delete Assignment Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAssignment}
        loading={deleteLoading}
        title="Remove Assignment"
        message="Are you sure you want to remove this project assignment?"
        confirmLabel="Remove"
      />
    </>
  );
}
