import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CsrfService } from './common/security/csrf/csrf.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // Cookie parser for HttpOnly cookie auth
  app.use(cookieParser());

  // CSRF Protection — Double Submit Cookie Pattern
  const csrfService = app.get(CsrfService);
  app.use((req: any, res: any, next: any) => {
    // Skip safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip auth endpoints that set cookies
    const path = req.path;
    if (
      path === '/api/v1/auth/login' ||
      path === '/api/v1/auth/register' ||
      path === '/api/v1/auth/refresh'
    ) {
      return next();
    }

    // CSRF token validation
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies?.['csrf_token'];

    if (!headerToken) {
      return res.status(403).json({
        statusCode: 403,
        message: 'CSRF token missing in X-CSRF-Token header',
      });
    }

    if (!cookieToken) {
      return res.status(403).json({
        statusCode: 403,
        message: 'CSRF token missing in csrf_token cookie',
      });
    }

    if (!csrfService.verifyToken(headerToken, cookieToken)) {
      return res.status(403).json({
        statusCode: 403,
        message: 'CSRF token mismatch',
      });
    }

    next();
  });

  app.setGlobalPrefix('api/v1');

  const corsOrigin = configService.get<string>('CORS_ORIGIN')
    ?.split(',')
    ?? ['http://localhost:3000'];

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('VISNDT API')
    .setDescription('VISNDT Platform API — MVP v1.0')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`NestJS API running on http://localhost:${port}`);
}

bootstrap();