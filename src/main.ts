import { config } from 'dotenv';
config(); // Load .env file

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import passport from 'passport';
import { PassportService } from './service-auth/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize Passport
  const passportService = app.get(PassportService);
  passportService.initialize();
  app.use(passport.initialize());

  // Enable CORS only in development
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    app.enableCors({
      origin: 'http://localhost:3000', // Your React app URL
      credentials: true, // If you need to send cookies/authentication
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
