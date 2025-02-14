import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: { origin: "http://localhost:3000" }});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();
