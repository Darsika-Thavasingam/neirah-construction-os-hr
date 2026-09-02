import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @Post()
    create(@Body() dto: CreateDepartmentDto) {
        return this.departmentsService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryDepartmentDto) {
        return this.departmentsService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
    ) {
        return this.departmentsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
        @Body() dto: UpdateDepartmentDto,
    ) {
        return this.departmentsService.update(tenantId, id, dto);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
    ) {
        return this.departmentsService.remove(tenantId, id);
    }
}