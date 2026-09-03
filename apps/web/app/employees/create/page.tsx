'use client';

import { useRouter } from 'next/navigation';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { createEmployee } from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import { useState } from 'react';
import type { CreateEmployeePayload } from '@/lib/types';
import Link from 'next/link';

export default function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: CreateEmployeePayload) => {
    setLoading(true);
    try {
      await createEmployee(data);
      toast('Employee profile created successfully', 'success');
      router.push('/employees');
    } catch (err) {
      toast((err as Error).message || 'Failed to create employee', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/employees" className="btn-outline-pill" style={{ padding: '8px 14px', borderRadius: 12 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={16} height={16}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.6px' }}>
            Add New Employee
          </h1>
          <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>
            Create a new workforce profile and assign a starting role.
          </p>
        </div>
      </div>

      {/* Glass Panel Form Container */}
      <div className="chart-panel-translucent" style={{ padding: '36px 44px' }}>
        <EmployeeForm 
          onSubmit={handleCreate as any} 
          loading={loading} 
          onCancel={() => router.push('/employees')} 
        />
      </div>
    </div>
  );
}
