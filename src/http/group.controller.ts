import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  Group,
  GroupTransformer,
} from './transformer/group-transformer.service'
import {
  GroupDetailResult,
  VkGroupApi,
} from '@/vk-api/service/vk-group-api.service'

@Controller('group')
export class GroupController {
  constructor(
    protected groupApi: VkGroupApi,
    protected groupTransformer: GroupTransformer,
  ) {}

  @Post('search')
  @HttpCode(200)
  public async search(@Body('q') query?: string): Promise<Group[]> {
    if (query === undefined) {
      throw new BadRequestException('q is not set')
    }

    const rawGroups = await this.groupApi.search(query)
    if (rawGroups.length === 0) {
      return []
    }

    const groups = rawGroups.map(this.groupTransformer.transform)

    const groupIds = groups.map((group: Group): number => group.id)
    const groupData = await this.groupApi.details(groupIds)

    // Add members count and description from the second request
    groupData.forEach(
      (detail: GroupDetailResult): void => {
        const found = groups.find(
          (group: Group): boolean => group.id === detail.id,
        )

        if (found === undefined) {
          throw new Error(`Vk didn't return info for a group ${detail.id}`)
        }

        found.count = detail.members_count
        found.description = detail.description
      },
    )

    return groups
  }
}
