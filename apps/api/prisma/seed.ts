import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TENANT_ID = '7639f389-470e-4df2-b96d-71a34e46717c';
const PROJECT_ID = '22222222-2222-4222-8222-222222222222';

async function main() {
  console.log('\n🌱  Seeding Neirah Construction OS — HR Module...\n');

  // ── Departments ─────────────────────────────────────────────────────────────
  const engineering     = await upsertDept('ENG',   'Engineering',      'Site engineers, supervisors and technical staff');
  const finance         = await upsertDept('FIN',   'Finance',           'Accounts, payroll and finance management');
  const operations      = await upsertDept('OPS',   'Operations',        'Site workers, operators and general labour');
  const hr              = await upsertDept('HR',    'Human Resources',   'Recruitment, employee relations and HR operations');
  const procurement     = await upsertDept('PROC',  'Procurement',       'Materials sourcing, vendor management and logistics');
  const safety          = await upsertDept('HSE',   'Health & Safety',   'Site safety, compliance and risk management');
  const design          = await upsertDept('DESIGN','Design & Planning', 'Architectural design and project planning');
  const qa              = await upsertDept('QA',    'Quality Assurance', 'Material testing and structural compliance inspection');
  const logistics       = await upsertDept('LOG',   'Logistics',         'Site heavy machinery, transport and supply chain');
  const legal           = await upsertDept('LGL',   'Legal & Compliance','Contract review, permits and regulatory compliance');
  console.log('  ✅  10 Departments seeded');


  // ── Designations ────────────────────────────────────────────────────────────
  const siteEngineer        = await upsertDesig('SE',   'Site Engineer',          'On-site engineering oversight');
  const projectMgr          = await upsertDesig('PM',   'Project Manager',         'Oversees full project lifecycle');
  const supervisor          = await upsertDesig('SUP',  'Supervisor',              'Supervises site teams');
  const worker              = await upsertDesig('WKR',  'General Worker',          'Site labour and manual work');
  const accountant          = await upsertDesig('ACC',  'Accountant',              'Financial records and reporting');
  const hrManager           = await upsertDesig('HRM',  'HR Manager',              'HR operations and talent management');
  const safetyOfficer       = await upsertDesig('HSO',  'Safety Officer',          'Site safety compliance');
  const drafter             = await upsertDesig('DFT',  'Drafter',                 'Technical drawings and CAD work');
  const procurementOfficer  = await upsertDesig('PO',   'Procurement Officer',     'Supplier and materials management');
  const mechanic            = await upsertDesig('MECH', 'Mechanic',                'Plant and equipment maintenance');
  const electrician         = await upsertDesig('ELEC', 'Electrician',             'Electrical installation and maintenance');
  const qaInspector         = await upsertDesig('QAI',  'QA Inspector',            'Structural quality inspector');
  const logisticsCoordinator= await upsertDesig('LC',   'Logistics Coordinator',   'Fleet and heavy equipment dispatch');
  console.log('  ✅  13 Designations seeded');


  // ── Employees ────────────────────────────────────────────────────────────────
  const employees = [
    // Engineering (6)
    { no: 'EMP-001', fn: 'Arun',       ln: 'Rajasekaran',   email: 'arun.r@neirah.lk',       phone: '+94771234001', nic: '900101234V', dob: '1990-01-15', gender: 'MALE',   dept: engineering, desig: siteEngineer,       type: 'FULL_TIME',  join: '2022-03-01', status: 'ACTIVE' },
    { no: 'EMP-002', fn: 'Kajan',      ln: 'Muthukumar',    email: 'kajan.m@neirah.lk',       phone: '+94771234003', nic: '880303456V', dob: '1988-03-30', gender: 'MALE',   dept: engineering, desig: supervisor,           type: 'FULL_TIME',  join: '2020-01-10', status: 'ACTIVE' },
    { no: 'EMP-003', fn: 'Dinesh',     ln: 'Perumal',       email: 'dinesh.p@neirah.lk',      phone: '+94771234010', nic: '910405678V', dob: '1991-04-05', gender: 'MALE',   dept: engineering, desig: siteEngineer,       type: 'FULL_TIME',  join: '2023-02-14', status: 'ACTIVE' },
    { no: 'EMP-004', fn: 'Saranya',    ln: 'Krishnan',      email: 'saranya.k@neirah.lk',     phone: '+94771234011', nic: '940606789V', dob: '1994-06-06', gender: 'FEMALE', dept: engineering, desig: drafter,            type: 'FULL_TIME',  join: '2023-05-01', status: 'ACTIVE' },
    { no: 'EMP-005', fn: 'Raj',        ln: 'Sivaganesh',    email: 'raj.s@neirah.lk',         phone: '+94771234012', nic: '860707890V', dob: '1986-07-07', gender: 'MALE',   dept: engineering, desig: projectMgr,         type: 'FULL_TIME',  join: '2019-06-15', status: 'ACTIVE' },
    { no: 'EMP-006', fn: 'Nithya',     ln: 'Selvaraj',      email: 'nithya.s@neirah.lk',      phone: '+94771234013', nic: '970808901V', dob: '1997-08-08', gender: 'FEMALE', dept: engineering, desig: siteEngineer,       type: 'CONTRACT',   join: '2024-01-15', status: 'ACTIVE' },
    // Finance (3)
    { no: 'EMP-007', fn: 'Priya',      ln: 'Subramaniam',   email: 'priya.s@neirah.lk',       phone: '+94771234002', nic: '920202345V', dob: '1992-02-20', gender: 'FEMALE', dept: finance,     desig: accountant,         type: 'FULL_TIME',  join: '2021-07-15', status: 'ACTIVE' },
    { no: 'EMP-008', fn: 'Gowri',      ln: 'Anandan',       email: 'gowri.a@neirah.lk',       phone: '+94771234014', nic: '890909012V', dob: '1989-09-09', gender: 'FEMALE', dept: finance,     desig: accountant,         type: 'FULL_TIME',  join: '2022-08-01', status: 'ACTIVE' },
    { no: 'EMP-009', fn: 'Mahesh',     ln: 'Chandrasekaran',email: 'mahesh.c@neirah.lk',      phone: '+94771234015', nic: '961010123V', dob: '1996-10-10', gender: 'MALE',   dept: finance,     desig: accountant,         type: 'FULL_TIME',  join: '2024-03-01', status: 'ACTIVE' },
    // Operations (5)
    { no: 'EMP-010', fn: 'Rajan',      ln: 'Velupillai',    phone: '+94771234004',             nic: '950404567V',    dob: '1995-04-05', gender: 'MALE',   dept: operations,  desig: worker,             type: 'CONTRACT',   join: '2023-06-01', status: 'ACTIVE' },
    { no: 'EMP-011', fn: 'Murugan',    ln: 'Selvan',        phone: '+94771234016',             nic: '830505678V',    dob: '1983-05-05', gender: 'MALE',   dept: operations,  desig: mechanic,           type: 'CONTRACT',   join: '2023-09-01', status: 'ACTIVE' },
    { no: 'EMP-012', fn: 'Kannan',     ln: 'Pillai',        phone: '+94771234017',             nic: '780606789V',    dob: '1978-06-06', gender: 'MALE',   dept: operations,  desig: worker,             type: 'CONTRACT',   join: '2024-02-01', status: 'INACTIVE' },
    { no: 'EMP-013', fn: 'Selvi',      ln: 'Ratnam',        phone: '+94771234018',             nic: '920707890V',    dob: '1992-07-07', gender: 'FEMALE', dept: operations,  desig: worker,             type: 'CONTRACT',   join: '2023-11-01', status: 'ACTIVE' },
    { no: 'EMP-014', fn: 'Babu',       ln: 'Thangavel',     phone: '+94771234019',             nic: '860808901V',    dob: '1986-08-08', gender: 'MALE',   dept: operations,  desig: electrician,        type: 'FULL_TIME',  join: '2022-04-01', status: 'ACTIVE' },
    // HR (2)
    { no: 'EMP-015', fn: 'Kavitha',    ln: 'Ramamoorthy',   email: 'kavitha.r@neirah.lk',     phone: '+94771234020', nic: '870909012V', dob: '1987-09-09', gender: 'FEMALE', dept: hr,          desig: hrManager,          type: 'FULL_TIME',  join: '2021-01-05', status: 'ACTIVE' },
    { no: 'EMP-016', fn: 'Sundar',     ln: 'Arumugam',      email: 'sundar.a@neirah.lk',      phone: '+94771234021', nic: '931010123V', dob: '1993-10-10', gender: 'MALE',   dept: hr,          desig: hrManager,          type: 'FULL_TIME',  join: '2022-11-01', status: 'ACTIVE' },
    // Procurement (2)
    { no: 'EMP-017', fn: 'Vignesh',    ln: 'Natarajan',     email: 'vignesh.n@neirah.lk',     phone: '+94771234022', nic: '911111234V', dob: '1991-11-11', gender: 'MALE',   dept: procurement, desig: procurementOfficer,  type: 'FULL_TIME',  join: '2022-06-01', status: 'ACTIVE' },
    { no: 'EMP-018', fn: 'Anitha',     ln: 'Kumaran',       email: 'anitha.k@neirah.lk',      phone: '+94771234023', nic: '891212345V', dob: '1989-12-12', gender: 'FEMALE', dept: procurement, desig: procurementOfficer,  type: 'PART_TIME',  join: '2023-03-01', status: 'ACTIVE' },
    // Safety (2)
    { no: 'EMP-019', fn: 'Prakash',    ln: 'Chandran',      email: 'prakash.c@neirah.lk',     phone: '+94771234024', nic: '840101456V', dob: '1984-01-01', gender: 'MALE',   dept: safety,      desig: safetyOfficer,      type: 'FULL_TIME',  join: '2021-09-01', status: 'ACTIVE' },
    { no: 'EMP-020', fn: 'Deepa',      ln: 'Rajan',         email: 'deepa.r@neirah.lk',       phone: '+94771234025', nic: '960202567V', dob: '1996-02-02', gender: 'FEMALE', dept: safety,      desig: safetyOfficer,      type: 'INTERN',     join: '2024-06-01', status: 'ACTIVE' },
    // Design (2)
    { no: 'EMP-021', fn: 'Janani',     ln: 'Subramanian',   email: 'janani.s@neirah.lk',      phone: '+94771234026', nic: '930303678V', dob: '1993-03-03', gender: 'FEMALE', dept: design,      desig: drafter,            type: 'FULL_TIME',  join: '2023-07-01', status: 'ACTIVE' },
    { no: 'EMP-022', fn: 'Arjun',      ln: 'Sivakumar',     email: 'arjun.sv@neirah.lk',      phone: '+94771234027', nic: '880404789V', dob: '1988-04-04', gender: 'MALE',   dept: design,      desig: drafter,            type: 'FULL_TIME',  join: '2022-01-10', status: 'INACTIVE' },
    // Quality Assurance & Logistics (8)
    { no: 'EMP-023', fn: 'Suresh',     ln: 'Nadarajah',     email: 'suresh.n@neirah.lk',      phone: '+94771234028', nic: '900505890V', dob: '1990-05-05', gender: 'MALE',   dept: qa,          desig: qaInspector,        type: 'FULL_TIME',  join: '2023-01-15', status: 'ACTIVE' },
    { no: 'EMP-024', fn: 'Menaka',     ln: 'Devi',          email: 'menaka.d@neirah.lk',      phone: '+94771234029', nic: '950606901V', dob: '1995-06-06', gender: 'FEMALE', dept: qa,          desig: qaInspector,        type: 'FULL_TIME',  join: '2023-08-20', status: 'ACTIVE' },
    { no: 'EMP-025', fn: 'Kamal',      ln: 'Hassan',        email: 'kamal.h@neirah.lk',       phone: '+94771234030', nic: '820707012V', dob: '1982-07-07', gender: 'MALE',   dept: logistics,   desig: logisticsCoordinator, type: 'FULL_TIME', join: '2020-04-10', status: 'ACTIVE' },
    { no: 'EMP-026', fn: 'Bhavani',    ln: 'Shankar',       email: 'bhavani.s@neirah.lk',     phone: '+94771234031', nic: '910808123V', dob: '1991-08-08', gender: 'FEMALE', dept: logistics,   desig: logisticsCoordinator, type: 'FULL_TIME', join: '2022-09-01', status: 'ACTIVE' },
    { no: 'EMP-027', fn: 'Titus',      ln: 'Fernando',      email: 'titus.f@neirah.lk',       phone: '+94771234032', nic: '870909234V', dob: '1987-09-09', gender: 'MALE',   dept: legal,       desig: projectMgr,         type: 'FULL_TIME',  join: '2019-11-01', status: 'ACTIVE' },
    { no: 'EMP-028', fn: 'Dilukshi',   ln: 'Silva',         email: 'dilukshi.s@neirah.lk',    phone: '+94771234033', nic: '941010345V', dob: '1994-10-10', gender: 'FEMALE', dept: legal,       desig: supervisor,         type: 'FULL_TIME',  join: '2023-04-15', status: 'ACTIVE' },
    { no: 'EMP-029', fn: 'Nimal',      ln: 'Wijesinghe',    email: 'nimal.w@neirah.lk',       phone: '+94771234034', nic: '851111456V', dob: '1985-11-11', gender: 'MALE',   dept: engineering, desig: siteEngineer,       type: 'FULL_TIME',  join: '2018-05-20', status: 'ACTIVE' },
    { no: 'EMP-030', fn: 'Malini',     ln: 'Jayawardena',   email: 'malini.j@neirah.lk',      phone: '+94771234035', nic: '931212567V', dob: '1993-12-12', gender: 'FEMALE', dept: hr,          desig: hrManager,          type: 'FULL_TIME',  join: '2022-03-10', status: 'ACTIVE' },
  ] as const;

  for (const e of employees) {
    await prisma.employee.upsert({
      where: { tenantId_employeeNumber: { tenantId: TENANT_ID, employeeNumber: e.no } },
      update: {},
      create: {
        tenantId: TENANT_ID,
        employeeNumber: e.no,
        firstName: e.fn,
        lastName: e.ln,
        email: 'email' in e ? (e as any).email : undefined,
        phone: e.phone,
        nicOrId: e.nic,
        dateOfBirth: new Date(e.dob),
        gender: e.gender as any,
        departmentId: e.dept.id,
        designationId: e.desig.id,
        employmentType: e.type as any,
        joiningDate: new Date(e.join),
        employmentStatus: e.status as any,
        emergencyContact: e.phone,
      },
    });
  }
  console.log('  ✅  22 Employees seeded');

  // ── Project Assignments ──────────────────────────────────────────────────────
  const allEmps = await prisma.employee.findMany({ where: { tenantId: TENANT_ID } });
  const activeEmps = allEmps.filter((e) => e.employmentStatus === 'ACTIVE').slice(0, 14);

  for (let i = 0; i < activeEmps.length; i++) {
    const emp = activeEmps[i];
    const roles = ['Site Engineer', 'Supervisor', 'Safety Officer', 'Procurement Lead', 'Foreman', 'QA Inspector', 'Drafter'];
    await prisma.employeeProjectAssignment.upsert({
      where: { id: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa${String(i + 1).padStart(3, '0')}`,
        tenantId: TENANT_ID,
        employeeId: emp.id,
        projectId: PROJECT_ID,
        assignmentRole: roles[i % roles.length],
        startDate: new Date('2024-01-01'),
        endDate: i < 4 ? new Date('2025-12-31') : undefined,
        status: i < 3 ? 'COMPLETED' : 'ASSIGNED',
      },
    });
  }
  console.log('  ✅  Project assignments seeded');

  // ── Leave Types ──────────────────────────────────────────────────────────────
  for (const [name, desc] of [
    ['Annual Leave',  'Paid annual leave entitlement'],
    ['Casual Leave',  'Short-notice casual leave'],
    ['Medical Leave', 'Leave due to illness or medical procedure'],
    ['Unpaid Leave',  'Leave without pay'],
    ['Maternity Leave', 'Paid maternity leave entitlement'],
  ]) {
    await prisma.leaveType.upsert({
      where: { tenantId_name: { tenantId: TENANT_ID, name } },
      update: {},
      create: { tenantId: TENANT_ID, name, description: desc },
    });
  }
  console.log('  ✅  Leave types seeded');

  console.log('\n✅  Seed complete!');
  console.log('   Tenant ID :', TENANT_ID);
  console.log('   Project ID:', PROJECT_ID, '\n');
}

// ── Helpers ────────────────────────────────────────────────────────────────────
async function upsertDept(code: string, name: string, description: string) {
  return prisma.department.upsert({
    where: { tenantId_code: { tenantId: TENANT_ID, code } },
    update: {},
    create: { tenantId: TENANT_ID, name, code, description },
  });
}
async function upsertDesig(code: string, name: string, description: string) {
  return prisma.designation.upsert({
    where: { tenantId_code: { tenantId: TENANT_ID, code } },
    update: {},
    create: { tenantId: TENANT_ID, name, code, description },
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });