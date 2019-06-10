import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RecentResponse, VkPostApi } from '@/vk-api/service/vk-post-api.service'
import { AudioExtractor } from '@/data/service/audio-extractor.service'
import { Audio } from '@/data/entity/audio.entity'
import { Post } from '@/data/entity/post.entity'
import { VkSource } from '@/data/entity/vk-source.entity'

interface ImportStat {
  importedCount: number
  maxId?: number
  minId?: number
  isCompleted: boolean
}

@Injectable()
export class PostImportService {
  constructor(
    private readonly postApi: VkPostApi,
    private readonly audioExtractor: AudioExtractor,
    @InjectRepository(Audio)
    private readonly audioRepository: Repository<Audio>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async import(
    source: VkSource,
    offset: number,
    count: number,
  ): Promise<ImportStat> {
    const posts = await this.postApi.getRecentById(source.id, offset, count)
    const stat = this.prepareStat(posts)

    for (const postObject of posts.items) {
      const audio = this.audioExtractor.extract([postObject])
      // No audio in the post
      if (audio.length === 0) {
        continue
      }

      // Save audio
      await this.audioRepository.save(audio)

      // Check if post is already in the DB
      const found = await this.postRepository.findOne({
        id: postObject.id,
        sourceId: source.id,
      })

      if (found === undefined) {
        stat.importedCount++
      }

      // Save post
      const postEntity = new Post(postObject, source)
      postEntity.audio = audio
      await this.postRepository.save(postEntity)
    }

    // End is reached
    if (posts.next_from === '') {
      stat.isCompleted = true
    }

    return stat
  }

  protected prepareStat(posts: RecentResponse): ImportStat {
    const stat: ImportStat = {
      importedCount: 0,
      isCompleted: false,
    }

    for (const post of posts.items) {
      if (stat.maxId === undefined || post.id > stat.maxId) {
        stat.maxId = post.id
      }
      if (stat.minId === undefined || post.id < stat.minId) {
        stat.minId = post.id
      }
    }

    return stat
  }
}
