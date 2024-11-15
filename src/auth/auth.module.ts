import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JWT_CONSTANT } from './jwt.constant';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { HashPasswordMiddleware } from 'src/middlewares/hash-password.middleware';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HashPasswordMiddleware)
      .forRoutes('user/register')
      .apply(HashPasswordMiddleware)
      .forRoutes('auth/alter');
  }
}
