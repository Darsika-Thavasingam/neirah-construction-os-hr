'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDepartments, getDesignations } from '@/lib/api';
import type {
  Employee,
  Department,
  Designation,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  EmploymentType,
  EmploymentStatus,
  Gender,
} from '@/lib/types';

type FormData = {
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nic_or_id: string;
  date_of_birth: string;
  gender: Gender | '';
  address: string;
  department_id: string;
  designation_id: string;
  employment_type: EmploymentType | '';
  employment_status: EmploymentStatus | '';
  joining_date: string;
  emergency_contact: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const getTodayString = () => new Date().toISOString().slice(0, 10);
const generateAutoId = () => `NC-${Math.floor(1000 + Math.random() * 9000)}`;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: CreateEmployeePayload | UpdateEmployeePayload) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

export function EmployeeForm({ employee, onSubmit, loading, onCancel, isEdit = false }: EmployeeFormProps) {
  const [form, setForm] = useState<FormData>(() => {
    if (!employee) {
      return {
        employee_number: generateAutoId(),
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        nic_or_id: '',
        date_of_birth: '',
        gender: '',
        address: '',
        department_id: '',
        designation_id: '',
        employment_type: 'FULL_TIME',
        employment_status: 'ACTIVE',
        joining_date: getTodayString(),
        emergency_contact: '',
      };
    }
    return {
      employee_number: employee.employeeNumber,
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email ?? '',
      phone: employee.phone ?? '',
      nic_or_id: employee.nicOrId ?? '',
      date_of_birth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : '',
      gender: (employee.gender ?? '') as Gender | '',
      address: employee.address ?? '',
      department_id: employee.departmentId ?? '',
      designation_id: employee.designationId ?? '',
      employment_type: (employee.employmentType ?? 'FULL_TIME') as EmploymentType,
      employment_status: (employee.employmentStatus ?? 'ACTIVE') as EmploymentStatus,
      joining_date: employee.joiningDate ? employee.joiningDate.slice(0, 10) : getTodayString(),
      emergency_contact: employee.emergencyContact ?? '',
    };
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  const loadOptions = useCallback(async () => {
    try {
      const [dRes, dgRes] = await Promise.all([
        getDepartments({ limit: 100 }),
        getDesignations({ limit: 100 }),
      ]);
      setDepartments(dRes.data.filter((d) => d.status === 'ACTIVE'));
      setDesignations(dgRes.data.filter((d) => d.status === 'ACTIVE'));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { loadOptions(); }, [loadOptions]);

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!isEdit && !form.employee_number.trim()) errs.employee_number = 'Employee ID is required';
    if (!form.employment_type) errs.employment_type = 'Employment type is required';
    if (!form.joining_date) errs.joining_date = 'Joining date is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Record<string, string | undefined> = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      nic_or_id: form.nic_or_id.trim() || undefined,
      date_of_birth: form.date_of_birth || undefined,
      gender: (form.gender || undefined) as string | undefined,
      address: form.address.trim() || undefined,
      department_id: form.department_id || undefined,
      designation_id: form.designation_id || undefined,
      employment_type: form.employment_type as string,
      joining_date: form.joining_date || getTodayString(),
      emergency_contact: form.emergency_contact.trim() || undefined,
    };

    if (!isEdit) {
      payload.employee_number = form.employee_number.trim() || generateAutoId();
    } else {
      payload.employment_status = (form.employment_status as string) || undefined;
    }

    await onSubmit(payload as unknown as CreateEmployeePayload);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Personal Details Header */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <label
          style={{
            width: 100, height: 100, border: '2px dashed #3B82F6', borderRadius: '50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#2563EB', cursor: 'pointer', background: 'rgba(239, 246, 255, 0.7)', flexShrink: 0,
            overflow: 'hidden', position: 'relative', transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}>
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Upload Photo</span>
            </>
          )}
        </label>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Personal Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                First Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                style={{
                  width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
                  border: errors.first_name ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: 13, outline: 'none'
                }}
                placeholder="e.g. Sarah"
                value={form.first_name}
                onChange={(e) => set('first_name', e.target.value)}
              />
              {errors.first_name && <span style={{ color: '#EF4444', fontSize: 11, marginTop: 2, display: 'block' }}>{errors.first_name}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Last Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                style={{
                  width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
                  border: errors.last_name ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: 13, outline: 'none'
                }}
                placeholder="e.g. Jenkins"
                value={form.last_name}
                onChange={(e) => set('last_name', e.target.value)}
              />
              {errors.last_name && <span style={{ color: '#EF4444', fontSize: 11, marginTop: 2, display: 'block' }}>{errors.last_name}</span>}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              Email Address
            </label>
            <input
              type="email"
              style={{
                width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
                border: errors.email ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: 13, outline: 'none'
              }}
              placeholder="sarah.j@neirah.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <span style={{ color: '#EF4444', fontSize: 11, marginTop: 2, display: 'block' }}>{errors.email}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            Phone Number
          </label>
          <input
            type="tel"
            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            Date of Birth
          </label>
          <input
            type="date"
            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
            value={form.date_of_birth}
            onChange={(e) => set('date_of_birth', e.target.value)}
          />
        </div>
      </div>

      {/* Role & Assignment */}
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginTop: 16, marginBottom: 14 }}>
        Role & Assignment
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {!isEdit && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
              Employee Number <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              style={{
                width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
                border: errors.employee_number ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: 13, outline: 'none'
              }}
              placeholder="NC-4921"
              value={form.employee_number}
              onChange={(e) => set('employee_number', e.target.value)}
            />
            {errors.employee_number && <span style={{ color: '#EF4444', fontSize: 11, marginTop: 2, display: 'block' }}>{errors.employee_number}</span>}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            Department
          </label>
          <select
            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#FFFFFF' }}
            value={form.department_id}
            onChange={(e) => set('department_id', e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            Job Title / Designation
          </label>
          <select
            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#FFFFFF' }}
            value={form.designation_id}
            onChange={(e) => set('designation_id', e.target.value)}
          >
            <option value="">Select Role</option>
            {designations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
            Joining Date <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="date"
            style={{
              width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
              border: errors.joining_date ? '1px solid #EF4444' : '1px solid #CBD5E1', fontSize: 13, outline: 'none'
            }}
            value={form.joining_date}
            onChange={(e) => set('joining_date', e.target.value)}
          />
          {errors.joining_date && <span style={{ color: '#EF4444', fontSize: 11, marginTop: 2, display: 'block' }}>{errors.joining_date}</span>}
        </div>
      </div>

      {/* Employment Type Radio Pills */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
          Employment Type
        </label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['FULL_TIME', 'CONTRACT', 'PART_TIME', 'INTERN'].map((type) => (
            <label
              key={type}
              style={{
                padding: '6px 14px', borderRadius: 9999,
                border: form.employment_type === type ? '2px solid #2563EB' : '1px solid #CBD5E1',
                background: form.employment_type === type ? '#EFF6FF' : '#FFFFFF',
                color: form.employment_type === type ? '#2563EB' : '#475569',
                fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <input
                type="radio"
                name="employment_type"
                value={type}
                checked={form.employment_type === type}
                onChange={(e) => set('employment_type', e.target.value)}
                style={{ accentColor: '#2563EB' }}
              />
              {type.replace('_', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
        <button type="button" className="btn-outline-pill" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-blue-pill" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}
