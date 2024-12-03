import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, maxlength: 50 })
  phone: string;

  @Prop({ required: true, maxlength: 50, trim: true })
  password: string;

  //   @Prop({
  //     required: true,
  //     index: { unique: true },
  //     lowercase: true,
  //   })
  //   email: string;

  @Prop()
  salt?: string;

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
