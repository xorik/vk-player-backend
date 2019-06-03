import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { VkSource } from './entity/vk-source.entity'
import { BookmarkService } from './service/bookmark.service'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User, VkSource]),
  ],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class DataModule {}
