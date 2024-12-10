import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogoutDocument = Logout & Document;

@Schema()
export class Logout {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  logoutTime: Date;
}

export const LogoutSchema = SchemaFactory.createForClass(Logout);

export const LOGOUT_MODEL_TOKEN = Logout.name;

export const LogoutDefinition: ModelDefinition = {
  name: LOGOUT_MODEL_TOKEN,
  schema: LogoutSchema,
};
