import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Updater } from './updater.service'
import { UpdateRequest } from './update-request.entity'
import { PostImportService } from './post-import.service'
import { DataModule } from '@/data/data.module'
import { VkApiModule } from '@/vk-api/vk-api.module'

@Module({
  imports: [DataModule, VkApiModule, TypeOrmModule.forFeature([UpdateRequest])],
  providers: [Updater, PostImportService],
  exports: [Updater],
})
export class UpdaterModule {}
