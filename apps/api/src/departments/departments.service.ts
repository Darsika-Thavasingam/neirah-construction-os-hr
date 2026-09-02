import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateDepartmentDto) {
    try {
      const department = await this.prisma.department.create({
        data: {
          tenantId: dto.tenant_id,
          name: dto.name,
          code: dto.code,
          description: dto.description,
        },
      });

      return {
        success: true,
        message: 'Department created successfully',
        data: department,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(
          'A department with this code already exists for this tenant',
        );
      }
      throw error;
    }
  }

  async findAll(query: QueryDepartmentDto) {
    const { tenant_id, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DepartmentWhereInput = {
      tenantId: tenant_id,
      ...(search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.department.count({ where }),
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
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        employees: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            employmentStatus: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return {
      success: true,
      data: department,
    };
  }

  async update(tenantId: string, id: string, dto: UpdateDepartmentDto) {
    const existing = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    try {
      const department = await this.prisma.department.update({
        where: { id },
        data: dto,
      });

      return {
        success: true,
        message: 'Department updated successfully',
        data: department,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(
          'A department with this code already exists for this tenant',
        );
      }
      throw error;
    }
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    const department = await this.prisma.department.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return {
      success: true,
      message: 'Department deactivated successfully',
      data: department,
    };
  }
}