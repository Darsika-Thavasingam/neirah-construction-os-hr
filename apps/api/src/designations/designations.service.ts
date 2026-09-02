import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';

@Injectable()
export class DesignationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateDesignationDto) {
    try {
      const designation = await this.prisma.designation.create({
        data: {
          tenantId: dto.tenant_id,
          name: dto.name,
          code: dto.code,
          description: dto.description,
        },
      });

      return {
        success: true,
        message: 'Designation created successfully',
        data: designation,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(
          'A designation with this code already exists for this tenant',
        );
      }
      throw error;
    }
  }

  async findAll(query: QueryDesignationDto) {
    const { tenant_id, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DesignationWhereInput = {
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
      this.prisma.designation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.designation.count({ where }),
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
    const designation = await this.prisma.designation.findFirst({
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

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    return {
      success: true,
      data: designation,
    };
  }

  async update(tenantId: string, id: string, dto: UpdateDesignationDto) {
    const existing = await this.prisma.designation.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Designation not found');
    }

    try {
      const designation = await this.prisma.designation.update({
        where: { id },
        data: dto,
      });

      return {
        success: true,
        message: 'Designation updated successfully',
        data: designation,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(
          'A designation with this code already exists for this tenant',
        );
      }
      throw error;
    }
  }

  async remove(tenantId: string, id: string) {
    const existing = await this.prisma.designation.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Designation not found');
    }

    const designation = await this.prisma.designation.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return {
      success: true,
      message: 'Designation deactivated successfully',
      data: designation,
    };
  }
}