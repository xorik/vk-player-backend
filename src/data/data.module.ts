import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { VkSource } from './entity/vk-source.entity'
import { Audio } from './entity/audio.entity'
import { BookmarkService } from './service/bookmark.service'
import { AudioExtractor } from './service/audio-extractor.service'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User, VkSource, Audio]),
  ],
  providers: [BookmarkService, AudioExtractor],
  exports: [BookmarkService, AudioExtractor],
})
export class DataModule {}
