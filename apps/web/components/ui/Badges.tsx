/* Neirah Construction OS — shared display utilities */

import type { EmploymentType, EmploymentStatus, Gender, AssignmentStatus, DepartmentStatus, DesignationStatus } from '@/lib/types';

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function employmentTypeBadge(type: EmploymentType) {
  const map: Record<EmploymentType, { label: string; cls: string }> = {
    FULL_TIME: { label: 'Full Time', cls: 'badge-full-time' },
    PART_TIME: { label: 'Part Time', cls: 'badge-part-time' },
    CONTRACT: { label: 'Contract', cls: 'badge-contract' },
    INTERN: { label: 'Intern', cls: 'badge-intern' },
    DAILY_WAGE: { label: 'Daily Wage', cls: 'badge-daily-wage' },
  };
  const { label, cls } = map[type] ?? { label: type, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function statusBadge(status: EmploymentStatus | DepartmentStatus | DesignationStatus | AssignmentStatus) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE: { label: 'Active', cls: 'badge-active' },
    INACTIVE: { label: 'Inactive', cls: 'badge-inactive' },
    ON_LEAVE: { label: 'On Leave', cls: 'badge-pending' },
    TERMINATED: { label: 'Terminated', cls: 'badge-inactive' },
    ASSIGNED: { label: 'Assigned', cls: 'badge-assigned' },
    COMPLETED: { label: 'Completed', cls: 'badge-completed' },
    REMOVED: { label: 'Removed', cls: 'badge-inactive' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function genderLabel(gender?: Gender | null): string {
  if (!gender) return '—';
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ firstName, lastName, size = 'md' }: AvatarProps) {
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {getInitials(firstName, lastName)}
    </span>
  );
}
