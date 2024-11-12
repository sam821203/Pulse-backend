import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';

const MONGO_MODELS = MongooseModule.forFeature([
  {
    name: 'User',
    schema: UserSchema,
    collection: 'user',
  },
]);

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), MONGO_MODELS],
  exports: [MONGO_MODELS],
})
export class DbModule {}