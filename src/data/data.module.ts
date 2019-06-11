import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { VkSource } from './entity/vk-source.entity'
import { Audio } from './entity/audio.entity'
import { Post } from './entity/post.entity'
import { BookmarkService } from './service/bookmark.service'
import { AudioExtractor } from './service/audio-extractor.service'
import { VkApiModule } from '@/vk-api/vk-api.module'

@Module({
  imports: [
    VkApiModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User, VkSource, Audio, Post]),
  ],
  providers: [BookmarkService, AudioExtractor],
  exports: [BookmarkService, AudioExtractor],
})
export class DataModule {}
