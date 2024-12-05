import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'sam01',
    description: '使用者名稱',
    maxLength: 20,
    minLength: 2,
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Test1234',
    description: '使用者密碼',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;
}
