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
import { AbonementsService } from './abonements.service';
import {
  CreateAbonementDto,
  UpdateAbonementDto,
} from './dto/create-abonement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('abonements')
export class AbonementsController {
  constructor(private readonly abonementsService: AbonementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAbonementDto: CreateAbonementDto) {
    return this.abonementsService.create(createAbonementDto);
  }

  @Get()
  findAll() {
    return this.abonementsService.findAll();
  }

  @Get('section/:sectionId')
  findBySection(@Param('sectionId') sectionId: string) {
    return this.abonementsService.findBySection(sectionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abonementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAbonementDto: UpdateAbonementDto,
  ) {
    return this.abonementsService.update(id, updateAbonementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.abonementsService.remove(id);
  }
}
