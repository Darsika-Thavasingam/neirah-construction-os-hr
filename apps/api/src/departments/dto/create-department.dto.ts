import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
    @IsUUID()
    tenant_id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}