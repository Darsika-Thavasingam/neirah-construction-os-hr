/**
 * Neirah Construction OS – HR Module
 * API client utilities for all backend endpoints
 */

import { API_BASE_URL, TENANT_ID } from './config';
import type {
  ApiResponse,
  PaginatedApiResponse,
  Department,
  Designation,
  Employee,
  EmployeeProjectAssignment,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  CreateDesignationPayload,
  UpdateDesignationPayload,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
} from './types';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      errorMessage = body.message ?? errorMessage;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

// ─── Departments ──────────────────────────────────────────────────────────────

export async function getDepartments(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedApiResponse<Department>> {
  const q = new URLSearchParams({ tenant_id: TENANT_ID });
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return apiFetch(`/departments?${q}`);
}

export async function getDepartment(id: string): Promise<ApiResponse<Department>> {
  return apiFetch(`/departments/${id}?tenant_id=${TENANT_ID}`);
}

export async function createDepartment(
  data: Omit<CreateDepartmentPayload, 'tenant_id'>
): Promise<ApiResponse<Department>> {
  return apiFetch('/departments', {
    method: 'POST',
    body: JSON.stringify({ ...data, tenant_id: TENANT_ID }),
  });
}

export async function updateDepartment(
  id: string,
  data: UpdateDepartmentPayload
): Promise<ApiResponse<Department>> {
  return apiFetch(`/departments/${id}?tenant_id=${TENANT_ID}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deactivateDepartment(id: string): Promise<ApiResponse<Department>> {
  return apiFetch(`/departments/${id}?tenant_id=${TENANT_ID}`, {
    method: 'DELETE',
  });
}

// ─── Designations ─────────────────────────────────────────────────────────────

export async function getDesignations(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedApiResponse<Designation>> {
  const q = new URLSearchParams({ tenant_id: TENANT_ID });
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return apiFetch(`/designations?${q}`);
}

export async function getDesignation(id: string): Promise<ApiResponse<Designation>> {
  return apiFetch(`/designations/${id}?tenant_id=${TENANT_ID}`);
}

export async function createDesignation(
  data: Omit<CreateDesignationPayload, 'tenant_id'>
): Promise<ApiResponse<Designation>> {
  return apiFetch('/designations', {
    method: 'POST',
    body: JSON.stringify({ ...data, tenant_id: TENANT_ID }),
  });
}

export async function updateDesignation(
  id: string,
  data: UpdateDesignationPayload
): Promise<ApiResponse<Designation>> {
  return apiFetch(`/designations/${id}?tenant_id=${TENANT_ID}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deactivateDesignation(id: string): Promise<ApiResponse<Designation>> {
  return apiFetch(`/designations/${id}?tenant_id=${TENANT_ID}`, {
    method: 'DELETE',
  });
}

// ─── Employees ────────────────────────────────────────────────────────────────

export async function getEmployees(params?: {
  search?: string;
  department_id?: string;
  designation_id?: string;
  employment_status?: string;
  employment_type?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedApiResponse<Employee>> {
  const q = new URLSearchParams({ tenant_id: TENANT_ID });
  if (params?.search) q.set('search', params.search);
  if (params?.department_id) q.set('department_id', params.department_id);
  if (params?.designation_id) q.set('designation_id', params.designation_id);
  if (params?.employment_status) q.set('employment_status', params.employment_status);
  if (params?.employment_type) q.set('employment_type', params.employment_type);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return apiFetch(`/employees?${q}`);
}

export async function getEmployee(id: string): Promise<ApiResponse<Employee>> {
  return apiFetch(`/employees/${id}?tenant_id=${TENANT_ID}`);
}

export const getEmployeeById = getEmployee;

export async function createEmployee(
  data: Omit<CreateEmployeePayload, 'tenant_id'>
): Promise<ApiResponse<Employee>> {
  return apiFetch('/employees', {
    method: 'POST',
    body: JSON.stringify({ ...data, tenant_id: TENANT_ID }),
  });
}

export async function updateEmployee(
  id: string,
  data: UpdateEmployeePayload
): Promise<ApiResponse<Employee>> {
  return apiFetch(`/employees/${id}?tenant_id=${TENANT_ID}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deactivateEmployee(id: string): Promise<ApiResponse<Employee>> {
  return apiFetch(`/employees/${id}?tenant_id=${TENANT_ID}`, {
    method: 'DELETE',
  });
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function getAssignments(
  employeeId: string
): Promise<ApiResponse<EmployeeProjectAssignment[]>> {
  return apiFetch(`/employees/${employeeId}/assignments?tenant_id=${TENANT_ID}`);
}

export async function createAssignment(
  employeeId: string,
  data: Omit<CreateAssignmentPayload, 'tenant_id'>
): Promise<ApiResponse<EmployeeProjectAssignment>> {
  return apiFetch(`/employees/${employeeId}/assignments`, {
    method: 'POST',
    body: JSON.stringify({ ...data, tenant_id: TENANT_ID }),
  });
}

export async function updateAssignment(
  employeeId: string,
  assignmentId: string,
  data: UpdateAssignmentPayload
): Promise<ApiResponse<EmployeeProjectAssignment>> {
  return apiFetch(
    `/employees/${employeeId}/assignments/${assignmentId}?tenant_id=${TENANT_ID}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAssignment(
  employeeId: string,
  assignmentId: string
): Promise<ApiResponse<EmployeeProjectAssignment>> {
  return apiFetch(
    `/employees/${employeeId}/assignments/${assignmentId}?tenant_id=${TENANT_ID}`,
    {
      method: 'DELETE',
    }
  );
}
