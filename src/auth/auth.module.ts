import { Module } from '@nestjs/common'
import { BearerStrategy } from './bearer.strategy'
import { AuthController } from './auth.controller'
import { DataModule } from '@/data/data.module'

@Module({
  providers: [BearerStrategy],
  imports: [DataModule],
  controllers: [AuthController],
})
export class AuthModule {}
