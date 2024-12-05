import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { Types } from 'mongoose';

export class LoginUserDto {
  @ApiProperty({
    example: '0912345645',
    description: '使用者手機',
    maxLength: 10,
    minLength: 10,
    required: true,
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    example: 'Test1234',
    description: '使用者密碼',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;

  // readonly userId?: Types.ObjectId;
}
