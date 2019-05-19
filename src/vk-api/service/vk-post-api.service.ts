import { Injectable } from '@nestjs/common'
import { VkApi } from './vk-api.service'

interface RecentResponse {
  count: number
  items: Post[]
  next_from: string
}

interface Post {
  id: number
  date: number
  text: string
  attachments?: Array<Attachment | AudioAttachment>
  copy_history?: Post[]
  [others: string]: any
}

interface Attachment {
  type: string
  [others: string]: any
}

interface AudioAttachment extends Attachment {
  type: 'audio'
  audio: {
    id: number
    owner_id: number
    artist: string
    title: string
    duration: number
    date: number
    url: string
  }
}

interface ResolveScreenNameResult {
  type?: 'user' | 'group'
  object_id?: number
}

@Injectable()
class VkPostApi {
  constructor(private readonly api: VkApi) {}

  public async getRecentById(
    ownerId: number,
    offset: number = 0,
    count: number = 50,
  ): Promise<RecentResponse> {
    return await this.api.request('wall.get', {
      owner_id: ownerId,
      filter: 'owner',
      count,
      offset,
    })
  }

  public async getPost(id: string): Promise<Post> {
    const posts = await this.api.request('wall.getById', {
      posts: id,
    })

    return posts[0]
  }

  public async resolveScreenName(
    screenName: string,
  ): Promise<ResolveScreenNameResult> {
    return await this.api.request('utils.resolveScreenName', {
      screen_name: screenName,
    })
  }
}

export { VkPostApi, RecentResponse, Post, Attachment, AudioAttachment }
