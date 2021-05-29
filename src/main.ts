import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main', true);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); // no need to write at controller level
  app.useGlobalInterceptors(new TransformInterceptor());
  const PORT = process.env.PORT;
  await app.listen(PORT, () => {
    logger.log(`Application listening in port ${PORT}`);
  });
}
bootstrap();
