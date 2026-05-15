import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { HashPasswordMiddleware } from 'src/middlewares/hash-password.middleware';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CaslAbilityModule } from './casl/casl-ability.module';
import { LogoutDefinition } from 'src/modules/user/schemas/logout.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get('jwt.secretKey');
        const expiresIn = config.get('jwt.expiresIn');
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
    CaslAbilityModule,
    MongooseModule.forFeature([LogoutDefinition]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
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
