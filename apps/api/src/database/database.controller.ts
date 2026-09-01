import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('health')
export class DatabaseController {
    constructor(private readonly prisma: PrismaService) { }

    @Get('database')
    async databaseHealth() {
        await this.prisma.$queryRaw`SELECT 1`;

        return {
            success: true,
            message: 'Database connection is healthy',
            data: {
                database: 'PostgreSQL',
            },
            meta: {},
        };
    }
}