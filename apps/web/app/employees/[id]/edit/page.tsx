'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getEmployee, updateEmployee } from '@/lib/api';
import type { Employee } from '@/lib/types';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { toast } from '@/components/ui/Toast';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEmployeePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployee(id);
      setEmployee(res.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data: Parameters<typeof updateEmployee>[1]) => {
    setSaveLoading(true);
    try {
      await updateEmployee(id, data);
      toast('Employee updated successfully', 'success');
      router.push(`/employees/${id}`);
    } catch (err) {
      toast((err as Error).message || 'Update failed', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: 400 }}>
        <div className="spinner" />
        <p>Loading employee…</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="error-state">
        <h3>Employee not found</h3>
        <p>{error}</p>
        <Link href="/employees" className="btn btn-secondary" style={{ marginTop: 12 }}>
          Back
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link href="/employees" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Employees</Link>
        <span>/</span>
        <Link href={`/employees/${id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          {employee.firstName} {employee.lastName}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Edit</span>
      </nav>

      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-subtitle">
            Updating {employee.firstName} {employee.lastName} — {employee.employeeNumber}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <EmployeeForm
            employee={employee}
            onSubmit={handleSubmit}
            loading={saveLoading}
            onCancel={() => router.push(`/employees/${id}`)}
            isEdit
          />
        </div>
      </div>
    </>
  );
}
