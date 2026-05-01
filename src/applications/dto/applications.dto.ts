import {
  Equals,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const APPLICATION_STATUSES = [
  'new',
  'in_progress',
  'contacted',
  'completed',
  'cancelled',
] as const;

const APPLICATION_SOURCES = [
  'enrollment_form',
  'sport_section_page',
  'abonement_page',
  'other',
] as const;

export class CreateApplicationDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  childAge?: number;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  selectedAbonement?: unknown;

  @IsOptional()
  @IsIn(APPLICATION_SOURCES)
  source?: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsString()
  sectionName?: string;

  @IsBoolean()
  @Equals(true, {
    message: 'Требуется согласие на обработку персональных данных',
  })
  consentGiven: boolean;

  @IsOptional()
  @IsString()
  consentVersion?: string;
}

export class UpdateApplicationStatusDto {
  @IsIn(APPLICATION_STATUSES)
  status: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class AddApplicationNoteDto {
  @IsString()
  text: string;
}
