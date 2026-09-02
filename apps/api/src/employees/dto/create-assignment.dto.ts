import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { AssignmentStatus } from '@prisma/client';

export class CreateAssignmentDto {
    @IsUUID()
    tenant_id: string;

    @IsUUID()
    project_id: string;

    @IsString()
    @IsNotEmpty()
    assignment_role: string;

    @IsDateString()
    start_date: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsOptional()
    @IsEnum(AssignmentStatus)
    status?: AssignmentStatus;
}