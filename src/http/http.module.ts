import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { GroupController } from './group.controller'
import { AudioExtractor } from './transformer/audio-extractor.service'
import { GroupTransformer } from './transformer/group-transformer.service'
import { VkApiModule } from '@/vk-api/vk-api.module'

@Module({
  imports: [VkApiModule],
  controllers: [GroupController, PostController],
  providers: [AudioExtractor, GroupTransformer],
})
export class HttpModule {}
