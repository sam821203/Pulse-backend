import { ApiProperty } from '@nestjs/swagger';
import {
  // IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '阿德命',
    description: '使用者名稱',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: '0912345678',
    description: '使用者手機',
    maxLength: 10,
    minLength: 10,
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  readonly phone: string;

  @ApiProperty({
    example: 'Test1234',
    description: '使用者密碼',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  // @ApiProperty({
  //   example: 'jeanpi3rm@gmail.com',
  //   description: 'The email of the user',
  // })
  // @IsEmail()
  // email: string;

  readonly salt?: string;
  readonly _id?: string;
}
