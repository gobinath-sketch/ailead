import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true is required for Razorpay webhook signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({ origin: '*', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
