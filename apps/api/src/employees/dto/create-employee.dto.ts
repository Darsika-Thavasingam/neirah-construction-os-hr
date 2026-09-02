import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import {
    EmploymentType,
    Gender,
} from '@prisma/client';

export class CreateEmployeeDto {
    @IsUUID()
    tenant_id: string;

    @IsOptional()
    @IsUUID()
    department_id?: string;

    @IsOptional()
    @IsUUID()
    designation_id?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    employee_number: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;

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

    @IsEnum(EmploymentType)
    employment_type: EmploymentType;

    @IsDateString()
    joining_date: string;

    @IsOptional()
    @IsString()
    emergency_contact?: string;
}