import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: process.env.CORS === 'true',
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
    }),
  )
  await app.listen(parseInt(process.env.PORT || '3000', 10))
}

dotenv.config()
bootstrap()
