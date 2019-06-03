import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { GroupController } from './group.controller'
import { BookmarkController } from './bookmark.controller'
import { AudioExtractor } from './transformer/audio-extractor.service'
import { GroupTransformer } from './transformer/group-transformer.service'
import { VkApiModule } from '@/vk-api/vk-api.module'
import { DataModule } from '@/data/data.module'

@Module({
  imports: [VkApiModule, DataModule],
  controllers: [GroupController, PostController, BookmarkController],
  providers: [AudioExtractor, GroupTransformer],
})
export class HttpModule {}
