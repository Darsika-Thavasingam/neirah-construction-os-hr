import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// Demo tenant ID — replace with a real tenant UUID once the Auth/Tenant
// module is integrated. All HR data is scoped to this tenant.
// ─────────────────────────────────────────────
const DEMO_TENANT_ID = '7639f389-470e-4df2-b96d-71a34e46717c';

async function main() {
    console.log('🌱  Seeding demo data for Neirah Construction OS HR module...');

    // ── Departments ────────────────────────────
    const engineering = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'ENG' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Engineering',
            code: 'ENG',
            description: 'Site engineers, supervisors and technical staff',
        },
    });

    const finance = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'FIN' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Finance',
            code: 'FIN',
            description: 'Accounts, payroll and finance team',
        },
    });

    const operations = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'OPS' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Operations',
            code: 'OPS',
            description: 'Site workers and general labour',
        },
    });

    console.log('  ✅  Departments seeded');

    // ── Designations ───────────────────────────
    const siteEngineer = await prisma.designation.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'SE' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Site Engineer',
            code: 'SE',
            description: 'Responsible for on-site engineering work',
        },
    });

    const supervisor = await prisma.designation.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'SUP' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Supervisor',
            code: 'SUP',
            description: 'Supervises site teams and daily activities',
        },
    });

    const accountant = await prisma.designation.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'ACC' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Accountant',
            code: 'ACC',
            description: 'Manages financial records and payroll',
        },
    });

    const worker = await prisma.designation.upsert({
        where: { tenantId_code: { tenantId: DEMO_TENANT_ID, code: 'WKR' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            name: 'Worker',
            code: 'WKR',
            description: 'General site labour',
        },
    });

    console.log('  ✅  Designations seeded');

    // ── Employees ──────────────────────────────
    const emp1 = await prisma.employee.upsert({
        where: { tenantId_employeeNumber: { tenantId: DEMO_TENANT_ID, employeeNumber: 'EMP-001' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            employeeNumber: 'EMP-001',
            firstName: 'Arun',
            lastName: 'Rajasekaran',
            email: 'arun.r@neirah.lk',
            phone: '+94771234001',
            nicOrId: '900101234V',
            dateOfBirth: new Date('1990-01-15'),
            gender: 'MALE',
            address: '12, Temple Road, Colombo 03',
            departmentId: engineering.id,
            designationId: siteEngineer.id,
            employmentType: 'FULL_TIME',
            joiningDate: new Date('2022-03-01'),
            employmentStatus: 'ACTIVE',
            emergencyContact: '+94771234099',
        },
    });

    const emp2 = await prisma.employee.upsert({
        where: { tenantId_employeeNumber: { tenantId: DEMO_TENANT_ID, employeeNumber: 'EMP-002' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            employeeNumber: 'EMP-002',
            firstName: 'Priya',
            lastName: 'Subramaniam',
            email: 'priya.s@neirah.lk',
            phone: '+94771234002',
            nicOrId: '920202345V',
            dateOfBirth: new Date('1992-02-20'),
            gender: 'FEMALE',
            address: '45, Main Street, Kandy',
            departmentId: finance.id,
            designationId: accountant.id,
            employmentType: 'FULL_TIME',
            joiningDate: new Date('2021-07-15'),
            employmentStatus: 'ACTIVE',
            emergencyContact: '+94771234098',
        },
    });

    const emp3 = await prisma.employee.upsert({
        where: { tenantId_employeeNumber: { tenantId: DEMO_TENANT_ID, employeeNumber: 'EMP-003' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            employeeNumber: 'EMP-003',
            firstName: 'Kajan',
            lastName: 'Muthukumar',
            email: 'kajan.m@neirah.lk',
            phone: '+94771234003',
            nicOrId: '880303456V',
            dateOfBirth: new Date('1988-03-30'),
            gender: 'MALE',
            address: '78, New Road, Jaffna',
            departmentId: engineering.id,
            designationId: supervisor.id,
            employmentType: 'FULL_TIME',
            joiningDate: new Date('2020-01-10'),
            employmentStatus: 'ACTIVE',
            emergencyContact: '+94771234097',
        },
    });

    const emp4 = await prisma.employee.upsert({
        where: { tenantId_employeeNumber: { tenantId: DEMO_TENANT_ID, employeeNumber: 'EMP-004' } },
        update: {},
        create: {
            tenantId: DEMO_TENANT_ID,
            employeeNumber: 'EMP-004',
            firstName: 'Rajan',
            lastName: 'Velupillai',
            phone: '+94771234004',
            nicOrId: '950404567V',
            dateOfBirth: new Date('1995-04-05'),
            gender: 'MALE',
            address: 'Site Camp, Colombo 10',
            departmentId: operations.id,
            designationId: worker.id,
            employmentType: 'CONTRACT',
            joiningDate: new Date('2023-06-01'),
            employmentStatus: 'ACTIVE',
        },
    });

    console.log('  ✅  Employees seeded');

    // ── Leave Types ────────────────────────────
    await prisma.leaveType.upsert({
        where: { tenantId_name: { tenantId: DEMO_TENANT_ID, name: 'Annual Leave' } },
        update: {},
        create: { tenantId: DEMO_TENANT_ID, name: 'Annual Leave', description: 'Paid annual leave entitlement' },
    });

    await prisma.leaveType.upsert({
        where: { tenantId_name: { tenantId: DEMO_TENANT_ID, name: 'Casual Leave' } },
        update: {},
        create: { tenantId: DEMO_TENANT_ID, name: 'Casual Leave', description: 'Short-notice casual leave' },
    });

    await prisma.leaveType.upsert({
        where: { tenantId_name: { tenantId: DEMO_TENANT_ID, name: 'Medical Leave' } },
        update: {},
        create: { tenantId: DEMO_TENANT_ID, name: 'Medical Leave', description: 'Leave due to illness or medical procedure' },
    });

    await prisma.leaveType.upsert({
        where: { tenantId_name: { tenantId: DEMO_TENANT_ID, name: 'Unpaid Leave' } },
        update: {},
        create: { tenantId: DEMO_TENANT_ID, name: 'Unpaid Leave', description: 'Leave without pay' },
    });

    console.log('  ✅  Leave types seeded');

    // ── Salary Structures ──────────────────────
    const salaryUpsert = async (id: string, employeeId: string, basicSalary: number, effectiveDate: Date) => {
        await prisma.salaryStructure.upsert({
            where: { id },
            update: {},
            create: {
                id,
                tenantId: DEMO_TENANT_ID,
                employeeId,
                basicSalary,
                effectiveDate,
                salaryStatus: 'ACTIVE',
            },
        });
    };

    await salaryUpsert('00000000-0000-0000-0001-000000000001', emp1.id, 85000, new Date('2022-03-01'));
    await salaryUpsert('00000000-0000-0000-0001-000000000002', emp2.id, 75000, new Date('2021-07-15'));
    await salaryUpsert('00000000-0000-0000-0001-000000000003', emp3.id, 70000, new Date('2020-01-10'));
    await salaryUpsert('00000000-0000-0000-0001-000000000004', emp4.id, 42000, new Date('2023-06-01'));

    console.log('  ✅  Salary structures seeded');

    console.log('\n✅  Seed complete!');
    console.log('   Demo tenant ID:', DEMO_TENANT_ID);
    console.log('   Replace DEMO_TENANT_ID once the Auth/Tenant module is integrated.\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });