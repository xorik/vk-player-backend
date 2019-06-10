import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VkPostApi } from '@/vk-api/service/vk-post-api.service'
import { AudioExtractor } from '@/data/service/audio-extractor.service'
import { Audio } from '@/data/entity/audio.entity'
import { Post } from '@/data/entity/post.entity'
import { VkSource } from '@/data/entity/vk-source.entity'

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
  ): Promise<number> {
    const posts = await this.postApi.getRecentById(source.id, offset, count)

    for (const postObject of posts.items) {
      const audio = this.audioExtractor.extract([postObject])
      // No audio in the post
      if (audio.length === 0) {
        continue
      }

      // Save audio
      await this.audioRepository.save(audio)

      // Save post
      const postEntity = new Post(postObject, source)
      postEntity.audio = audio
      await this.postRepository.save(postEntity)
    }

    // TODO: check the next_from field and return exception?
    // TODO: count number of new posts
    return posts.items.length
  }
}
