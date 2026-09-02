import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });

  // Set standard API route prefix (/api/v1)
  app.setGlobalPrefix('api/v1');

  // Global validation pipe — whitelist strips unknown fields, transform enables type coercion
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Enables implicit string-to-type conversion for query params
      },
    }),
  );

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Neirah Construction OS — HR Module API')
    .setDescription(
      'REST API for HR, Attendance, Leave, Payroll and Project Labour Costing.\n\n' +
      'Base path: `/api/v1` | Multi-tenant: pass `tenant_id` in all requests.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Health')
    .addTag('Departments')
    .addTag('Designations')
    .addTag('Employees')
    .addTag('Assignments')
    .addTag('Attendance')
    .addTag('Leave Types')
    .addTag('Leave Requests')
    .addTag('Overtime')
    .addTag('Salary Structures')
    .addTag('Allowances')
    .addTag('Deductions')
    .addTag('Advances')
    .addTag('Payroll Runs')
    .addTag('Payroll Items')
    .addTag('Project Labour Cost')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tryItOutEnabled: true, // Automatically opens input fields for parameters
      displayRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n✅  API running at:      http://localhost:${port}/api/v1`);
  console.log(`📄  Swagger docs at:     http://localhost:${port}/api/docs\n`);
}
bootstrap();