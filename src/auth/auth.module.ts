import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BearerStrategy } from './bearer.strategy'
import { User } from './user.entity'
import { AuthController } from '@/auth/auth.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [BearerStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
