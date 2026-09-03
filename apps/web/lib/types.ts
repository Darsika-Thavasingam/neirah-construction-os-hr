/**
 * Neirah Construction OS – HR Module
 * Shared TypeScript types for all HR entities
 */

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'DAILY_WAGE';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';
export type DesignationStatus = 'ACTIVE' | 'INACTIVE';
export type AssignmentStatus = 'ASSIGNED' | 'COMPLETED' | 'REMOVED';

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  status: DepartmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Designation {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  status: DesignationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  tenantId: string;
  departmentId?: string | null;
  designationId?: string | null;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  nicOrId?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  address?: string | null;
  employmentType: EmploymentType;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  emergencyContact?: string | null;
  createdAt: string;
  updatedAt: string;
  department?: Pick<Department, 'id' | 'name' | 'code'> | null;
  designation?: Pick<Designation, 'id' | 'name' | 'code'> | null;
  assignments?: EmployeeProjectAssignment[];
}

export interface EmployeeProjectAssignment {
  id: string;
  tenantId: string;
  employeeId: string;
  projectId: string;
  assignmentRole: string;
  startDate: string;
  endDate?: string | null;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}

export interface CreateEmployeePayload {
  tenant_id: string;
  department_id?: string;
  designation_id?: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  nic_or_id?: string;
  date_of_birth?: string;
  gender?: Gender;
  address?: string;
  employment_type: EmploymentType;
  joining_date: string;
  emergency_contact?: string;
}

export interface UpdateEmployeePayload {
  department_id?: string;
  designation_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  nic_or_id?: string;
  date_of_birth?: string;
  gender?: Gender;
  address?: string;
  employment_type?: EmploymentType;
  joining_date?: string;
  employment_status?: EmploymentStatus;
  emergency_contact?: string;
}

export interface CreateDepartmentPayload {
  tenant_id: string;
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  description?: string;
  status?: DepartmentStatus;
}

export interface CreateDesignationPayload {
  tenant_id: string;
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDesignationPayload {
  name?: string;
  code?: string;
  description?: string;
  status?: DesignationStatus;
}

export interface CreateAssignmentPayload {
  tenant_id: string;
  project_id: string;
  assignment_role: string;
  start_date: string;
  end_date?: string;
  status?: AssignmentStatus;
}

export interface UpdateAssignmentPayload {
  assignment_role?: string;
  start_date?: string;
  end_date?: string;
  status?: AssignmentStatus;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
