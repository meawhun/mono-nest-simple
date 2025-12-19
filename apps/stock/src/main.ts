import { NestFactory } from '@nestjs/core';
import { StockModule } from './stock.module';

async function bootstrap() {
  console.log('Stock Service Starting...');
  const app = await NestFactory.create(StockModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
