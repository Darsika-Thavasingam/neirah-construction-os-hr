import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';
import {
    EmploymentStatus,
    EmploymentType,
} from '@prisma/client';

export class QueryEmployeeDto {
    @IsUUID()
    tenant_id: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsUUID()
    department_id?: string;

    @IsOptional()
    @IsUUID()
    designation_id?: string;

    @IsOptional()
    @IsEnum(EmploymentStatus)
    employment_status?: EmploymentStatus;

    @IsOptional()
    @IsEnum(EmploymentType)
    employment_type?: EmploymentType;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 10;
}