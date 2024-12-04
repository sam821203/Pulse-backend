import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '阿德命',
    description: '使用者名稱',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
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
  @MinLength(10)
  @MaxLength(10)
  readonly phone: string;

  @ApiProperty({
    example: 'Test1234',
    description: '使用者密碼',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  readonly password: string;

  readonly salt?: string;
  readonly _id?: string;
}
