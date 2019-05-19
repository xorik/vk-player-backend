import { Injectable } from '@nestjs/common'
import { VkApi } from './vk-api.service'

interface GroupSearchResult {
  id: number
  name: string
  screen_name: string
  photo_50: string
  photo_100: string
  photo_200: string
}

interface GroupDetailResult extends GroupSearchResult {
  members_count: number
  description: string
}

@Injectable()
class VkGroupApi {
  constructor(protected api: VkApi) {}

  public async search(q: string): Promise<GroupSearchResult[]> {
    const response = await this.api.request('groups.search', {
      type: 'group',
      count: 30,
      q,
    })

    return response.items
  }

  public async details(ids: number[]): Promise<GroupDetailResult[]> {
    return await this.api.request('groups.getById', {
      group_ids: ids.join(','),
      fields: 'members_count,description', // counters
    })
  }
}

export { VkGroupApi, GroupSearchResult, GroupDetailResult }
