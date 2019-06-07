import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VkPostApi } from '@/vk-api/service/vk-post-api.service'
import { AudioExtractor } from '@/data/service/audio-extractor.service'
import { Audio } from '@/data/entity/audio.entity'

@Injectable()
export class PostImportService {
  constructor(
    private readonly postApi: VkPostApi,
    private readonly audioExtractor: AudioExtractor,
    @InjectRepository(Audio)
    private readonly audioRepository: Repository<Audio>,
  ) {}

  public async import(
    sourceId: number,
    offset: number,
    count: number,
  ): Promise<number> {
    const posts = await this.postApi.getRecentById(sourceId, offset, count)
    const audio = this.audioExtractor.extract(posts.items)

    // TODO: check for duplicates
    // Save audio
    for (const track of audio) {
      await this.audioRepository.save(track)
    }

    // TODO: check the next_from field and return boolean
    return posts.items.length
  }
}
