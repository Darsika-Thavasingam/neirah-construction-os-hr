'use client';

import { useState } from 'react';
import { DEFAULT_PROJECT_ID } from '@/lib/config';
import type { EmployeeProjectAssignment, CreateAssignmentPayload, UpdateAssignmentPayload, AssignmentStatus } from '@/lib/types';

type FormData = {
  project_id: string;
  assignment_role: string;
  start_date: string;
  end_date: string;
  status: AssignmentStatus | '';
};

type FormErrors = Partial<Record<keyof FormData, string>>;

interface AssignmentFormProps {
  assignment?: EmployeeProjectAssignment;
  onSubmit: (data: CreateAssignmentPayload | UpdateAssignmentPayload) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

export function AssignmentForm({ assignment, onSubmit, loading, onCancel, isEdit = false }: AssignmentFormProps) {
  const [form, setForm] = useState<FormData>({
    project_id: assignment?.projectId ?? DEFAULT_PROJECT_ID,
    assignment_role: assignment?.assignmentRole ?? '',
    start_date: assignment?.startDate ? assignment.startDate.slice(0, 10) : '',
    end_date: assignment?.endDate ? assignment.endDate.slice(0, 10) : '',
    status: (assignment?.status ?? '') as AssignmentStatus | '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.assignment_role.trim()) errs.assignment_role = 'Role is required';
    if (!form.start_date) errs.start_date = 'Start date is required';
    if (!form.project_id.trim()) errs.project_id = 'Project ID is required';
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      errs.end_date = 'End date cannot be before start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Record<string, string | undefined> = {
      assignment_role: form.assignment_role.trim(),
      start_date: form.start_date,
      end_date: form.end_date || undefined,
    };

    if (!isEdit) {
      payload.project_id = form.project_id.trim();
    } else {
      payload.status = form.status || undefined;
    }

    await onSubmit(payload as unknown as CreateAssignmentPayload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-section">
        {!isEdit && (
          <div className="form-group">
            <label htmlFor="asgn-project_id" className="form-label required">Project ID</label>
            <input
              id="asgn-project_id"
              type="text"
              className={`form-input ${errors.project_id ? 'error' : ''}`}
              value={form.project_id}
              onChange={(e) => set('project_id', e.target.value)}
              placeholder="UUID of the project"
            />
            {errors.project_id && <span className="form-error">{errors.project_id}</span>}
            <span className="form-hint">Default: shared construction project ID</span>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="asgn-role" className="form-label required">Assignment Role</label>
          <input
            id="asgn-role"
            type="text"
            className={`form-input ${errors.assignment_role ? 'error' : ''}`}
            value={form.assignment_role}
            onChange={(e) => set('assignment_role', e.target.value)}
            placeholder="e.g. Site Engineer, Foreman"
          />
          {errors.assignment_role && <span className="form-error">{errors.assignment_role}</span>}
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="asgn-start" className="form-label required">Start Date</label>
            <input
              id="asgn-start"
              type="date"
              className={`form-input ${errors.start_date ? 'error' : ''}`}
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
            />
            {errors.start_date && <span className="form-error">{errors.start_date}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="asgn-end" className="form-label">End Date</label>
            <input
              id="asgn-end"
              type="date"
              className={`form-input ${errors.end_date ? 'error' : ''}`}
              value={form.end_date}
              onChange={(e) => set('end_date', e.target.value)}
            />
            {errors.end_date && <span className="form-error">{errors.end_date}</span>}
            <span className="form-hint">Leave blank for ongoing assignment</span>
          </div>
        </div>
        {isEdit && (
          <div className="form-group">
            <label htmlFor="asgn-status" className="form-label">Status</label>
            <select
              id="asgn-status"
              className="form-select"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              <option value="ASSIGNED">Assigned</option>
              <option value="COMPLETED">Completed</option>
              <option value="REMOVED">Removed</option>
            </select>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} id="assignment-form-submit">
          {loading ? 'Saving…' : isEdit ? 'Update Assignment' : 'Assign to Project'}
        </button>
      </div>
    </form>
  );
}
