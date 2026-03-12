import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';
import { AbonementsModule } from './abonements/abonements.module';
import { TrainersModule } from './trainers/trainers.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    SectionsModule,
    AbonementsModule,
    TrainersModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
