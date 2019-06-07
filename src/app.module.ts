import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'
import { DataModule } from './data/data.module'
import { UpdaterModule } from './updater/updater.module'

@Module({
  imports: [HttpModule, AuthModule, DataModule, UpdaterModule],
})
export class AppModule {}
