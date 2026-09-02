import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AssignmentStatus } from '@prisma/client';

export class UpdateAssignmentDto {
    @IsOptional()
    @IsString()
    assignment_role?: string;

    @IsOptional()
    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsOptional()
    @IsEnum(AssignmentStatus)
    status?: AssignmentStatus;
}