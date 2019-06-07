import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AddBookmarkDto } from './dto/add-bookmark.dto'
import { BookmarkService } from '@/data/service/bookmark.service'
import { AuthUser } from '@/auth/user.decorator'
import { User } from '@/data/entity/user.entity'
import { Updater } from '@/updater/updater.service'

@Controller('bookmark')
@UseGuards(AuthGuard('bearer'))
export class BookmarkController {
  constructor(
    protected readonly bookmarkService: BookmarkService,
    protected readonly updater: Updater,
  ) {}

  @Post()
  public async addBookmark(
    @AuthUser() user: User,
    @Body() { sourceId, name, group, numPosts }: AddBookmarkDto,
  ): Promise<void> {
    await this.bookmarkService.add(user, sourceId, name, group)
    await this.updater.addRequest(sourceId, numPosts)
  }
}
