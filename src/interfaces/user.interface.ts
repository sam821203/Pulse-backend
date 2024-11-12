import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @Prop()
  @ApiProperty({
    description: '使用者手機',
    example: '0912345678',
    maxLength: 10,
    minLength: 10,
    required: true,
  })
  readonly phone: string;

  @Prop()
  @ApiProperty({
    description: '使用者密碼',
    example: '123456',
    required: true,
  })
  readonly password: string;
}
