import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTrainerDto {
  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  sectionId: string;
}

export class UpdateTrainerDto extends PartialType(CreateTrainerDto) {}
