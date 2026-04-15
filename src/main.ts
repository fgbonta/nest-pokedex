import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos (ej. string a number)
      },
    })
  );

  await app.listen(process.env.PORT!);
  console.log(`App running on port: ${process.env.PORT}`);
  
}
bootstrap();
