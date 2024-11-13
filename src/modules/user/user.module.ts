import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/interfaces/user.interface';
import { UserSchema } from 'src/db/schema/user.schema';
import { HashPasswordMiddleware } from 'src/middlewares/hash-password.middleware';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('UserModule has been configured');
    consumer.apply(HashPasswordMiddleware).forRoutes('user/register');
  }
}
