import { Module } from '@nestjs/common';
import { AbonementsController } from './abonements.controller';
import { AbonementsService } from './abonements.service';

@Module({
  controllers: [AbonementsController],
  providers: [AbonementsService]
})
export class AbonementsModule {}
