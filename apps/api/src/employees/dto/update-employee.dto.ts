import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import {
    EmploymentStatus,
    EmploymentType,
    Gender,
} from '@prisma/client';

export class UpdateEmployeeDto {
    @IsOptional()
    @IsUUID()
    department_id?: string;

    @IsOptional()
    @IsUUID()
    designation_id?: string;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    nic_or_id?: string;

    @IsOptional()
    @IsDateString()
    date_of_birth?: string;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(EmploymentType)
    employment_type?: EmploymentType;

    @IsOptional()
    @IsDateString()
    joining_date?: string;

    @IsOptional()
    @IsEnum(EmploymentStatus)
    employment_status?: EmploymentStatus;

    @IsOptional()
    @IsString()
    emergency_contact?: string;
}