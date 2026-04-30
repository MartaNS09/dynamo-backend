import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      // CSP лучше формировать на уровне фронтенда/nginx, чтобы не ломать Next.js assets.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://194.62.19.203',
    'https://dynamovitebsk.by',
    'https://www.dynamovitebsk.by',
  ];
  const envOrigins = (configService.get<string>('CORS_ORIGINS') || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

  // Настраиваем CORS для frontend origins
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = configService.get('PORT', 3001);
  const host = configService.get('HOST', '127.0.0.1');
  await app.listen(port, host);

  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`📝 Auth endpoints:`);
  console.log(`   - POST http://${host}:${port}/auth/login`);
  console.log(`   - POST http://${host}:${port}/auth/register`);
  console.log(`🔧 CORS enabled for: ${allowedOrigins.join(', ')}`);
}
bootstrap();
