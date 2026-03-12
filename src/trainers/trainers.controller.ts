import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto, UpdateTrainerDto } from './dto/create-trainer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainersService.create(createTrainerDto);
  }

  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get('section/:sectionId')
  findBySection(@Param('sectionId') sectionId: string) {
    return this.trainersService.findBySection(sectionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTrainerDto: UpdateTrainerDto) {
    return this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id);
  }
}
