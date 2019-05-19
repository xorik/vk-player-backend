import { Injectable } from '@nestjs/common'
import proxyTransformer from './proxyTransformer'
import { GroupSearchResult } from '@/vk-api/service/vk-group-api.service'

interface Group {
  id: number
  name: string
  url: string
  photo: string
  count?: number
  description?: string
}

@Injectable()
class GroupTransformer {
  public transform(group: GroupSearchResult): Group {
    return {
      id: group.id,
      name: group.name,
      url: group.screen_name,
      photo: proxyTransformer(group.photo_200),
    }
  }
}

export { GroupTransformer, Group }
