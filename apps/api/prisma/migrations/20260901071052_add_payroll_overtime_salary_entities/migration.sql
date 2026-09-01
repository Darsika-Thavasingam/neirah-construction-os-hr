-- CreateEnum
CREATE TYPE "OvertimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AllowanceType" AS ENUM ('ONE_TIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "DeductionType" AS ENUM ('ONE_TIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "AdvanceStatus" AS ENUM ('ACTIVE', 'PARTIALLY_RECOVERED', 'RECOVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "overtime" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "project_id" UUID,
    "date" DATE NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL,
    "rate_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.5,
    "reason" TEXT,
    "status" "OvertimeStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "overtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_structures" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "basic_salary" DECIMAL(12,2) NOT NULL,
    "effective_date" DATE NOT NULL,
    "salary_status" "SalaryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "salary_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allowances" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "allowance_type" "AllowanceType" NOT NULL,
    "effective_date" DATE,
    "payroll_month" INTEGER,
    "payroll_year" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "allowances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deductions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "deduction_type" "DeductionType" NOT NULL,
    "effective_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_advances" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "advance_amount" DECIMAL(12,2) NOT NULL,
    "date" DATE NOT NULL,
    "recovery_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "remaining_balance" DECIMAL(12,2) NOT NULL,
    "status" "AdvanceStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "employee_advances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "payroll_month" INTEGER NOT NULL,
    "payroll_year" INTEGER NOT NULL,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'DRAFT',
    "total_gross_salary" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_deductions" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_net_salary" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "generated_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "payroll_run_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "basic_salary" DECIMAL(12,2) NOT NULL,
    "total_allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "overtime_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gross_salary" DECIMAL(12,2) NOT NULL,
    "total_deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "advance_recovery" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_salary" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "overtime_tenant_id_idx" ON "overtime"("tenant_id");

-- CreateIndex
CREATE INDEX "overtime_tenant_id_employee_id_idx" ON "overtime"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "overtime_tenant_id_project_id_idx" ON "overtime"("tenant_id", "project_id");

-- CreateIndex
CREATE INDEX "overtime_tenant_id_date_idx" ON "overtime"("tenant_id", "date");

-- CreateIndex
CREATE INDEX "overtime_tenant_id_status_idx" ON "overtime"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "salary_structures_tenant_id_idx" ON "salary_structures"("tenant_id");

-- CreateIndex
CREATE INDEX "salary_structures_tenant_id_employee_id_idx" ON "salary_structures"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "salary_structures_tenant_id_employee_id_salary_status_idx" ON "salary_structures"("tenant_id", "employee_id", "salary_status");

-- CreateIndex
CREATE INDEX "allowances_tenant_id_idx" ON "allowances"("tenant_id");

-- CreateIndex
CREATE INDEX "allowances_tenant_id_employee_id_idx" ON "allowances"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "allowances_tenant_id_payroll_month_payroll_year_idx" ON "allowances"("tenant_id", "payroll_month", "payroll_year");

-- CreateIndex
CREATE INDEX "deductions_tenant_id_idx" ON "deductions"("tenant_id");

-- CreateIndex
CREATE INDEX "deductions_tenant_id_employee_id_idx" ON "deductions"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_advances_tenant_id_idx" ON "employee_advances"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_advances_tenant_id_employee_id_idx" ON "employee_advances"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_advances_tenant_id_status_idx" ON "employee_advances"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "payroll_runs_tenant_id_idx" ON "payroll_runs"("tenant_id");

-- CreateIndex
CREATE INDEX "payroll_runs_tenant_id_status_idx" ON "payroll_runs"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "payroll_runs_tenant_id_payroll_year_payroll_month_idx" ON "payroll_runs"("tenant_id", "payroll_year", "payroll_month");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_tenant_id_payroll_month_payroll_year_key" ON "payroll_runs"("tenant_id", "payroll_month", "payroll_year");

-- CreateIndex
CREATE INDEX "payroll_items_tenant_id_idx" ON "payroll_items"("tenant_id");

-- CreateIndex
CREATE INDEX "payroll_items_tenant_id_payroll_run_id_idx" ON "payroll_items"("tenant_id", "payroll_run_id");

-- CreateIndex
CREATE INDEX "payroll_items_tenant_id_employee_id_idx" ON "payroll_items"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_items_payroll_run_id_employee_id_key" ON "payroll_items"("payroll_run_id", "employee_id");

-- AddForeignKey
ALTER TABLE "overtime" ADD CONSTRAINT "overtime_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allowances" ADD CONSTRAINT "allowances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deductions" ADD CONSTRAINT "deductions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_advances" ADD CONSTRAINT "employee_advances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payroll_run_id_fkey" FOREIGN KEY ("payroll_run_id") REFERENCES "payroll_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
