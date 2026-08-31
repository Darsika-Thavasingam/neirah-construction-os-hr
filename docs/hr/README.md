# Neirah Construction OS
## HR, Attendance, Leave & Payroll Module

## Module

HR Management, Attendance, Leave, Payroll and Project Labour Costing.

## Technology

- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- API: REST
- API Base Path: /api/v1

## Architecture

The module follows the Neirah Construction OS modular monolith architecture.

## Core Flow

Employee
→ Project Assignment
→ Attendance
→ Working Hours
→ Leave / Overtime
→ Salary
→ Payroll
→ Payslip
→ Project Labour Cost

## Standards

This module follows the Neirah Construction OS Master Project Details & Common Development Standards.

## Multi-tenancy

All tenant-owned records use tenant_id and all backend queries enforce tenant isolation.

## Security

Authentication and authorization are enforced server-side using the shared platform authentication and RBAC architecture.