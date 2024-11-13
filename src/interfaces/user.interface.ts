import { Prop, raw, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

interface IName {
  firstName: string;
  lastName: string;
  fullName: string;
}

@Schema()
export class User {
  @Prop(
    raw({
      firstName: { type: String },
      lastName: { type: String },
      fullName: { type: String },
    }),
  )
  @ApiProperty({
    description: '使用者姓名',
    example: {
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
    },
  })
  name: IName;

  @Prop({ required: true })
  @ApiProperty({
    description: '使用者手機',
    example: '0912345678',
    maxLength: 10,
    minLength: 10,
    required: true,
  })
  readonly phone: string;

  @Prop({ required: true, maxlength: 20 })
  @ApiProperty({
    description: '使用者密碼',
    example: '123456',
    required: true,
  })
  readonly password: string;
}
