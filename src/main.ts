import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: process.env.CORS === 'true',
  })
  app.setGlobalPrefix('api')
  await app.listen(parseInt(process.env.PORT || '3000', 10))
}

dotenv.config()
bootstrap()
