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
import { ApiTags } from '@nestjs/swagger';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { QueryDesignationDto } from './dto/query-designation.dto';

@ApiTags('Designations')
@Controller('designations')
export class DesignationsController {
    constructor(private readonly designationsService: DesignationsService) { }

    @Post()
    create(@Body() dto: CreateDesignationDto) {
        return this.designationsService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryDesignationDto) {
        return this.designationsService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
    ) {
        return this.designationsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
        @Body() dto: UpdateDesignationDto,
    ) {
        return this.designationsService.update(tenantId, id, dto);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Query('tenant_id') tenantId: string,
    ) {
        return this.designationsService.remove(tenantId, id);
    }
}