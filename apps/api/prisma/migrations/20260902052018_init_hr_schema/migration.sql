-- DropForeignKey
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_employee_id_fkey";

-- DropIndex
DROP INDEX "salary_structures_tenant_id_employee_id_salary_status_idx";

-- AddForeignKey
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
