import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';
import { SeoModule } from './seo/seo.module';
import { ApplicationsModule } from './applications/applications.module';
import { BlogModule } from './blog/blog.module';
import { UsersModule } from './users/users.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SectionsModule,
    SeoModule,
    ApplicationsModule,
    BlogModule,
    UsersModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
