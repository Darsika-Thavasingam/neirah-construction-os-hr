import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, IsUUID } from 'class-validator';

export class QueryDepartmentDto {
    @IsUUID()
    tenant_id: string;

    @IsOptional()
    @IsString()
    search?: string;

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