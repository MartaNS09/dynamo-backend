import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpsertSeoDto } from './dto/upsert-seo.dto';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  @Get(':page')
  findByPage(@Param('page') page: string) {
    return this.seoService.findByPage(page);
  }

  @Put(':page')
  @UseGuards(JwtAuthGuard)
  upsert(@Param('page') page: string, @Body() dto: UpsertSeoDto, @Req() req: any) {
    const updatedBy = req?.user?.email ?? req?.user?.name;
    return this.seoService.upsert(page, dto, updatedBy);
  }

  @Post('initialize-defaults')
  @UseGuards(JwtAuthGuard)
  initializeDefaults(@Req() req: any) {
    const updatedBy = req?.user?.email ?? req?.user?.name ?? 'system';
    return this.seoService.initializeDefaults(updatedBy);
  }
}
