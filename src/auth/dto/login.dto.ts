import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name: string;
}
