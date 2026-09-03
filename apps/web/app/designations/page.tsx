'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDesignations, createDesignation, updateDesignation, deactivateDesignation } from '@/lib/api';
import type { Designation, PaginatedMeta, CreateDesignationPayload, UpdateDesignationPayload } from '@/lib/types';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { toast } from '@/components/ui/Toast';

export default function DesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<Designation | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  const [deactivateTarget, setDeactivateTarget] = useState<Designation | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const loadDesignations = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getDesignations({
        search: search || undefined,
        page: p,
        limit: 10,
      });
      setDesignations(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast((err as Error).message || 'Failed to load designations', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { loadDesignations(page); }, [page, loadDesignations]);

  const handleOpenCreate = () => {
    setEditingDesig(null);
    setFormData({ name: '', code: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (desig: Designation) => {
    setEditingDesig(desig);
    setFormData({ name: desig.name, code: desig.code, description: desig.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingDesig) {
        await updateDesignation(editingDesig.id, formData as UpdateDesignationPayload);
        toast('Designation updated', 'success');
      } else {
        await createDesignation(formData as CreateDesignationPayload);
        toast('Designation created', 'success');
      }
      setModalOpen(false);
      loadDesignations(1);
    } catch (err) {
      toast((err as Error).message || 'Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivateLoading(true);
    try {
      await deactivateDesignation(deactivateTarget.id);
      toast('Designation deactivated', 'success');
      setDeactivateTarget(null);
      loadDesignations(page);
    } catch (err) {
      toast((err as Error).message || 'Deactivation failed', 'error');
    } finally {
      setDeactivateLoading(false);
    }
  };

  return (
    <>
      {/* Page Title & Controls */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0B1220', letterSpacing: '-0.5px' }}>
            Designations
          </h1>
          <p style={{ fontSize: 14, color: '#667085', marginTop: 4 }}>
            Manage construction site job roles, technical classifications, and structural hierarchies.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="header-search" style={{ width: 240 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search designations..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <button className="btn-blue-pill" onClick={handleOpenCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={15} height={15}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Designation
          </button>
        </div>
      </div>

      {/* Borderless Grid Record List */}
      <div className="list-container">
        <div className="list-header-row">
          <h2 className="list-title">All Designations ({meta.total})</h2>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#667085' }}>Loading designations...</div>
        ) : designations.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#667085' }}>No designations found.</div>
        ) : (
          <div className="floating-row-list">
            <div className="list-table-header" style={{ gridTemplateColumns: '140px 1fr 120px 80px' }}>
              <span>ROLE CODE</span>
              <span>ROLE NAME & DESCRIPTION</span>
              <span>STATUS</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>
            {designations.map((desig) => (
              <div key={desig.id} className="floating-row-card" style={{ gridTemplateColumns: '140px 1fr 120px 80px' }}>
                <div>
                  <span className="role-badge">{desig.code}</span>
                </div>

                <div>
                  <div className="row-name">{desig.name}</div>
                  <div className="row-desc">{desig.description || 'No role details specified.'}</div>
                </div>

                <div className="status-pill active-site">
                  <span className="status-pill-dot" />
                  {desig.status || 'ACTIVE'}
                </div>

                <div className="row-actions">
                  <button className="row-action-btn" title="Edit" onClick={() => handleOpenEdit(desig)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={15} height={15}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  {desig.status !== 'INACTIVE' && (
                    <button className="row-action-btn" title="Deactivate" onClick={() => setDeactivateTarget(desig)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={15} height={15}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingDesig ? 'Edit Designation' : 'Add Designation'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Role Code</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. SE"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Designation Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Site Engineer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="Role description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button type="button" className="btn-outline-pill" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-pill" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Designation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivate */}
      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        loading={deactivateLoading}
        title="Deactivate Designation"
        message={`Deactivate designation ${deactivateTarget?.name}?`}
        confirmLabel="Deactivate"
      />
    </>
  );
}
