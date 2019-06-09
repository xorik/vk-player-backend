import { Module } from '@nestjs/common'
import { CronLogger } from './cron-logger.service'

@Module({
  providers: [CronLogger],
  exports: [CronLogger],
})
export class LoggerModule {}
