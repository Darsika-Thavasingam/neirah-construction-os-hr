-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED', 'RESIGNED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LeaveTypeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID,
    "designation_id" UUID,
    "employee_number" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "nic_or_id" TEXT,
    "date_of_birth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "employment_type" "EmploymentType" NOT NULL,
    "joining_date" DATE NOT NULL,
    "employment_status" "EmploymentStatus" NOT NULL DEFAULT 'ACTIVE',
    "emergency_contact" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_project_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "assignment_role" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "employee_project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "project_id" UUID,
    "attendance_date" DATE NOT NULL,
    "check_in" TIMESTAMP(3),
    "check_out" TIMESTAMP(3),
    "worked_hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "AttendanceStatus" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_types" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "LeaveTypeStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "leave_type_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "number_of_days" DECIMAL(5,2) NOT NULL,
    "reason" TEXT,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
    "review_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departments_tenant_id_idx" ON "departments"("tenant_id");

-- CreateIndex
CREATE INDEX "departments_tenant_id_name_idx" ON "departments"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenant_id_code_key" ON "departments"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "designations_tenant_id_idx" ON "designations"("tenant_id");

-- CreateIndex
CREATE INDEX "designations_tenant_id_name_idx" ON "designations"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "designations_tenant_id_code_key" ON "designations"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "employees_tenant_id_idx" ON "employees"("tenant_id");

-- CreateIndex
CREATE INDEX "employees_tenant_id_department_id_idx" ON "employees"("tenant_id", "department_id");

-- CreateIndex
CREATE INDEX "employees_tenant_id_designation_id_idx" ON "employees"("tenant_id", "designation_id");

-- CreateIndex
CREATE INDEX "employees_tenant_id_employment_status_idx" ON "employees"("tenant_id", "employment_status");

-- CreateIndex
CREATE INDEX "employees_tenant_id_first_name_last_name_idx" ON "employees"("tenant_id", "first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_tenant_id_employee_number_key" ON "employees"("tenant_id", "employee_number");

-- CreateIndex
CREATE INDEX "employee_project_assignments_tenant_id_idx" ON "employee_project_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_project_assignments_tenant_id_employee_id_idx" ON "employee_project_assignments"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_project_assignments_tenant_id_project_id_idx" ON "employee_project_assignments"("tenant_id", "project_id");

-- CreateIndex
CREATE INDEX "attendance_tenant_id_idx" ON "attendance"("tenant_id");

-- CreateIndex
CREATE INDEX "attendance_tenant_id_attendance_date_idx" ON "attendance"("tenant_id", "attendance_date");

-- CreateIndex
CREATE INDEX "attendance_tenant_id_employee_id_idx" ON "attendance"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "attendance_tenant_id_project_id_idx" ON "attendance"("tenant_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_tenant_id_employee_id_attendance_date_key" ON "attendance"("tenant_id", "employee_id", "attendance_date");

-- CreateIndex
CREATE INDEX "leave_types_tenant_id_idx" ON "leave_types"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_tenant_id_name_key" ON "leave_types"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "leave_requests_tenant_id_idx" ON "leave_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "leave_requests_tenant_id_employee_id_idx" ON "leave_requests"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "leave_requests_tenant_id_status_idx" ON "leave_requests"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "leave_requests_tenant_id_start_date_end_date_idx" ON "leave_requests"("tenant_id", "start_date", "end_date");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_project_assignments" ADD CONSTRAINT "employee_project_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
