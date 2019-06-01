import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [HttpModule, AuthModule, TypeOrmModule.forRoot()],
})
export class AppModule {}
