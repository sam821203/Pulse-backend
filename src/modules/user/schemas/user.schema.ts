import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { ClientRole } from 'src/auth/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 20 })
  name: string;

  @Prop({
    required: true,
    maxlength: 50,
    trim: true,
  })
  password: string;

  @Prop({ type: [String], enum: ClientRole, default: [ClientRole.User] })
  roles: ClientRole[];

  @Prop()
  salt?: string;

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_MODEL_TOKEN = User.name;

export const UserDefinition: ModelDefinition = {
  name: USER_MODEL_TOKEN,
  schema: UserSchema,
};
