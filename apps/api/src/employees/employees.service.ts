import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class EmployeesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateEmployeeDto) {
        await this.validateRelations(
            dto.tenant_id,
            dto.department_id,
            dto.designation_id,
        );

        try {
            const employee = await this.prisma.employee.create({
                data: {
                    tenantId: dto.tenant_id,
                    departmentId: dto.department_id,
                    designationId: dto.designation_id,
                    employeeNumber: dto.employee_number,
                    firstName: dto.first_name,
                    lastName: dto.last_name,
                    email: dto.email,
                    phone: dto.phone,
                    nicOrId: dto.nic_or_id,
                    dateOfBirth: dto.date_of_birth
                        ? new Date(dto.date_of_birth)
                        : undefined,
                    gender: dto.gender,
                    address: dto.address,
                    employmentType: dto.employment_type,
                    joiningDate: new Date(dto.joining_date),
                    emergencyContact: dto.emergency_contact,
                },
                include: {
                    department: true,
                    designation: true,
                },
            });

            return {
                success: true,
                message: 'Employee created successfully',
                data: employee,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new BadRequestException(
                    'An employee with this employee number already exists for this tenant',
                );
            }

            throw error;
        }
    }

    async findAll(query: QueryEmployeeDto) {
        const {
            tenant_id,
            search,
            department_id,
            designation_id,
            employment_status,
            employment_type,
            page,
            limit,
        } = query;

        const skip = (page - 1) * limit;

        const where: Prisma.EmployeeWhereInput = {
            tenantId: tenant_id,

            ...(department_id ? { departmentId: department_id } : {}),
            ...(designation_id ? { designationId: designation_id } : {}),
            ...(employment_status ? { employmentStatus: employment_status } : {}),
            ...(employment_type ? { employmentType: employment_type } : {}),

            ...(search
                ? {
                    OR: [
                        {
                            employeeNumber: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            firstName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            phone: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }
                : {}),
        };

        const [data, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    firstName: 'asc',
                },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    },
                    designation: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    },
                },
            }),
            this.prisma.employee.count({ where }),
        ]);

        return {
            success: true,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(tenantId: string, id: string) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                department: true,
                designation: true,
                assignments: true,
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        return {
            success: true,
            data: employee,
        };
    }

    async update(
        tenantId: string,
        id: string,
        dto: UpdateEmployeeDto,
    ) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                id,
                tenantId,
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        await this.validateRelations(
            tenantId,
            dto.department_id,
            dto.designation_id,
        );

        const updated = await this.prisma.employee.update({
            where: { id },
            data: {
                departmentId: dto.department_id,
                designationId: dto.designation_id,
                firstName: dto.first_name,
                lastName: dto.last_name,
                email: dto.email,
                phone: dto.phone,
                nicOrId: dto.nic_or_id,
                dateOfBirth: dto.date_of_birth
                    ? new Date(dto.date_of_birth)
                    : undefined,
                gender: dto.gender,
                address: dto.address,
                employmentType: dto.employment_type,
                joiningDate: dto.joining_date
                    ? new Date(dto.joining_date)
                    : undefined,
                employmentStatus: dto.employment_status,
                emergencyContact: dto.emergency_contact,
            },
            include: {
                department: true,
                designation: true,
            },
        });

        return {
            success: true,
            message: 'Employee updated successfully',
            data: updated,
        };
    }

    async remove(tenantId: string, id: string) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                id,
                tenantId,
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        const updated = await this.prisma.employee.update({
            where: { id },
            data: {
                employmentStatus: 'INACTIVE',
            },
        });

        return {
            success: true,
            message: 'Employee deactivated successfully',
            data: updated,
        };
    }

    async createAssignment(
        employeeId: string,
        dto: CreateAssignmentDto,
    ) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                id: employeeId,
                tenantId: dto.tenant_id,
            },
        });

        if (!employee) {
            throw new NotFoundException(
                'Employee not found for this tenant',
            );
        }

        if (
            dto.end_date &&
            new Date(dto.end_date) < new Date(dto.start_date)
        ) {
            throw new BadRequestException(
                'End date cannot be before start date',
            );
        }

        const assignment =
            await this.prisma.employeeProjectAssignment.create({
                data: {
                    tenantId: dto.tenant_id,
                    employeeId,
                    projectId: dto.project_id,
                    assignmentRole: dto.assignment_role,
                    startDate: new Date(dto.start_date),
                    endDate: dto.end_date
                        ? new Date(dto.end_date)
                        : undefined,
                    status: dto.status ?? 'ASSIGNED',
                },
            });

        return {
            success: true,
            message: 'Employee assigned to project successfully',
            data: assignment,
        };
    }

    async getAssignments(
        employeeId: string,
        tenantId: string,
    ) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                id: employeeId,
                tenantId,
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        const assignments =
            await this.prisma.employeeProjectAssignment.findMany({
                where: {
                    employeeId,
                    tenantId,
                },
                orderBy: {
                    startDate: 'desc',
                },
            });

        return {
            success: true,
            data: assignments,
        };
    }

    async updateAssignment(
        employeeId: string,
        assignmentId: string,
        tenantId: string,
        dto: UpdateAssignmentDto,
    ) {
        const assignment =
            await this.prisma.employeeProjectAssignment.findFirst({
                where: {
                    id: assignmentId,
                    employeeId,
                    tenantId,
                },
            });

        if (!assignment) {
            throw new NotFoundException('Project assignment not found');
        }

        if (
            dto.end_date &&
            dto.start_date &&
            new Date(dto.end_date) < new Date(dto.start_date)
        ) {
            throw new BadRequestException(
                'End date cannot be before start date',
            );
        }

        const updated =
            await this.prisma.employeeProjectAssignment.update({
                where: {
                    id: assignmentId,
                },
                data: {
                    assignmentRole: dto.assignment_role,
                    startDate: dto.start_date
                        ? new Date(dto.start_date)
                        : undefined,
                    endDate: dto.end_date
                        ? new Date(dto.end_date)
                        : undefined,
                    status: dto.status,
                },
            });

        return {
            success: true,
            message: 'Project assignment updated successfully',
            data: updated,
        };
    }

    async removeAssignment(
        employeeId: string,
        assignmentId: string,
        tenantId: string,
    ) {
        const assignment =
            await this.prisma.employeeProjectAssignment.findFirst({
                where: {
                    id: assignmentId,
                    employeeId,
                    tenantId,
                },
            });

        if (!assignment) {
            throw new NotFoundException('Project assignment not found');
        }

        const deleted =
            await this.prisma.employeeProjectAssignment.delete({
                where: {
                    id: assignmentId,
                },
            });

        return {
            success: true,
            message: 'Project assignment deleted successfully',
            data: deleted,
        };
    }

    private async validateRelations(
        tenantId: string,
        departmentId?: string,
        designationId?: string,
    ) {
        if (departmentId) {
            const department = await this.prisma.department.findFirst({
                where: {
                    id: departmentId,
                    tenantId,
                    status: 'ACTIVE',
                },
            });

            if (!department) {
                throw new BadRequestException(
                    'Department does not exist or is inactive',
                );
            }
        }

        if (designationId) {
            const designation =
                await this.prisma.designation.findFirst({
                    where: {
                        id: designationId,
                        tenantId,
                        status: 'ACTIVE',
                    },
                });

            if (!designation) {
                throw new BadRequestException(
                    'Designation does not exist or is inactive',
                );
            }
        }
    }
}