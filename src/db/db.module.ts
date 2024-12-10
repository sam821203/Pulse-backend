import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../modules/user/schemas/user.schema';
import { DbService } from './db.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MONGO_MODELS,
  ],
  exports: [MONGO_MODELS],
  providers: [DbService],
})
export class DbModule {}
