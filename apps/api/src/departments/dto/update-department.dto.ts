import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDepartmentDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    code?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsString()
    status?: 'ACTIVE' | 'INACTIVE';
}