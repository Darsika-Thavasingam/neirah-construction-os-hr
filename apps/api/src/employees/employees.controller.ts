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
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees (paginated, searchable, filterable)' })
  @ApiQuery({
    name: 'tenant_id',
    required: true,
    type: String,
    description: 'Tenant UUID',
    example: '11111111-1111-4111-8111-111111111111',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name, email, phone, or employee number' })
  @ApiQuery({ name: 'department_id', required: false, type: String, description: 'Filter by Department UUID' })
  @ApiQuery({ name: 'designation_id', required: false, type: String, description: 'Filter by Designation UUID' })
  @ApiQuery({ name: 'employment_status', required: false, type: String, description: 'Filter by status (e.g., ACTIVE)' })
  @ApiQuery({ name: 'employment_type', required: false, type: String, description: 'Filter by employment type (e.g., FULL_TIME)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query() query: QueryEmployeeDto) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiQuery({ name: 'tenant_id', required: true, type: String, description: 'Tenant UUID' })
  findOne(
    @Param('id') id: string,
    @Query('tenant_id') tenantId: string,
  ) {
    return this.employeesService.findOne(tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiQuery({ name: 'tenant_id', required: true, type: String, description: 'Tenant UUID' })
  update(
    @Param('id') id: string,
    @Query('tenant_id') tenantId: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate an employee' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiQuery({ name: 'tenant_id', required: true, type: String, description: 'Tenant UUID' })
  remove(
    @Param('id') id: string,
    @Query('tenant_id') tenantId: string,
  ) {
    return this.employeesService.remove(tenantId, id);
  }

  @Post(':employeeId/assignments')
  @ApiOperation({ summary: 'Assign employee to a project' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  createAssignment(
    @Param('employeeId') employeeId: string,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.employeesService.createAssignment(employeeId, dto);
  }

  @Get(':employeeId/assignments')
  @ApiOperation({ summary: 'Get all project assignments for an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiQuery({ name: 'tenant_id', required: true, type: String, description: 'Tenant UUID' })
  getAssignments(
    @Param('employeeId') employeeId: string,
    @Query('tenant_id') tenantId: string,
  ) {
    return this.employeesService.getAssignments(employeeId, tenantId);
  }

  @Patch(':employeeId/assignments/:assignmentId')
  @ApiOperation({ summary: 'Update a project assignment' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment UUID' })
  @ApiQuery({ name: 'tenant_id', required: true, type: String, description: 'Tenant UUID' })
  updateAssignment(
    @Param('employeeId') employeeId: string,
    @Param('assignmentId') assignmentId: string,
    @Query('tenant_id') tenantId: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.employeesService.updateAssignment(
      employeeId,
      assignmentId,
      tenantId,
      dto,
    );
  }
}