import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({
    description: '使用者手機',
    example: '0912345678',
    maxLength: 10,
    minLength: 10,
    required: true,
  })
  readonly phone: string;

  @Prop({ required: true, maxlength: 50 })
  @ApiProperty({
    description: '使用者密碼',
    example: '123456',
    required: true,
  })
  readonly password: string;

  @Prop()
  readonly salt?: string;

  // @Prop()
  // readonly _id: string;
}
