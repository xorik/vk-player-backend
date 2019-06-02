import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'
import { DataModule } from './data/data.module'

@Module({
  imports: [HttpModule, AuthModule, DataModule],
})
export class AppModule {}
