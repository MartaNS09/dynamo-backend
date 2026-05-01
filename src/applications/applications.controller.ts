import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import {
  AddApplicationNoteDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/applications.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateApplicationDto, @Req() req: any) {
    const forwardedFor = req?.headers?.['x-forwarded-for'];
    const consentIp =
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0]?.trim()
        : req?.ip;
    const consentUserAgent =
      typeof req?.headers?.['user-agent'] === 'string'
        ? req.headers['user-agent']
        : undefined;

    return this.applicationsService.create(dto, {
      consentIp,
      consentUserAgent,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @Req() req: any,
  ) {
    const actor = req?.user?.email ?? req?.user?.name ?? 'system';
    return this.applicationsService.updateStatus(id, dto, actor);
  }

  @Post(':id/notes')
  @UseGuards(JwtAuthGuard)
  addNote(@Param('id') id: string, @Body() dto: AddApplicationNoteDto, @Req() req: any) {
    const actor = req?.user?.email ?? req?.user?.name ?? 'system';
    return this.applicationsService.addNote(id, dto, actor);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
