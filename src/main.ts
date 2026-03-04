import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Настраиваем CORS - разрешаем запросы с фронтенда
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // Убираем глобальный префикс /api
  // app.setGlobalPrefix('api');
  
  const port = configService.get('PORT', 3001);
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 Auth endpoints:`);
  console.log(`   - POST http://localhost:${port}/auth/login`);
  console.log(`   - POST http://localhost:${port}/auth/register`);
  console.log(`🔧 CORS enabled for: http://localhost:3000`);
}
bootstrap();
