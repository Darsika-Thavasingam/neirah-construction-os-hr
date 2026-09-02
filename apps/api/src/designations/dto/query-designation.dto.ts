import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class QueryDesignationDto {
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