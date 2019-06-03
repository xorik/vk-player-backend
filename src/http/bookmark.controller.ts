import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AddBookmarkDto } from './dto/add-bookmark.dto'
import { BookmarkService } from '@/data/service/bookmark.service'
import { AuthUser } from '@/auth/user.decorator'
import { User } from '@/data/entity/user.entity'

@Controller('bookmark')
@UseGuards(AuthGuard('bearer'))
export class BookmarkController {
  constructor(protected readonly bookmarkService: BookmarkService) {}

  @Post()
  public async addBookmark(
    @AuthUser() user: User,
    @Body() { sourceId, name, group }: AddBookmarkDto,
  ): Promise<void> {
    await this.bookmarkService.add(user, sourceId, name, group)
  }
}
