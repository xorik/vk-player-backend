import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { GroupController } from './group.controller'
import { BookmarkController } from './bookmark.controller'
import { GroupTransformer } from './transformer/group-transformer.service'
import { VkApiModule } from '@/vk-api/vk-api.module'
import { DataModule } from '@/data/data.module'
import { UpdaterModule } from '@/updater/updater.module'

@Module({
  imports: [VkApiModule, DataModule, UpdaterModule],
  controllers: [GroupController, PostController, BookmarkController],
  providers: [GroupTransformer],
})
export class HttpModule {}
