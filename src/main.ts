import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

const listenPort = 3000;
const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // 配置 swagger
  const config = new DocumentBuilder()
    .setTitle('Pulse 脈動分析平台')
    .setDescription('Pulse 平台API文件')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, documentFactory());

  // 允許跨域訪問
  app.enableCors();
  await app.listen(process.env.PORT ?? listenPort);
}

bootstrap().then(() => {
  logger.log(`Server is running on http://localhost:${listenPort}/swagger-ui`);
});
