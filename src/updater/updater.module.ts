import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from 'nest-schedule'
import { Updater } from './updater.service'
import { UpdateRequest } from './update-request.entity'
import { PostImportService } from './post-import.service'
import { CronService } from './cron.service'
import { DataModule } from '@/data/data.module'
import { VkApiModule } from '@/vk-api/vk-api.module'
import { LoggerModule } from '@/logger/logger.module'

@Module({
  imports: [
    DataModule,
    VkApiModule,
    LoggerModule,
    TypeOrmModule.forFeature([UpdateRequest]),
    ScheduleModule.register(),
  ],
  providers: [Updater, PostImportService, CronService],
  exports: [Updater],
})
export class UpdaterModule {}
