import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../modules/user/schemas/user.schema';
import { DbService } from './db.service';

const MONGO_MODELS = MongooseModule.forFeature([
  {
    name: 'User',
    schema: UserSchema,
    collection: 'user',
  },
]);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    MONGO_MODELS,
  ],
  exports: [MONGO_MODELS],
  providers: [DbService],
})
export class DbModule {}
