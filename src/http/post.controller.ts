import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import proxyTransformer from './transformer/proxyTransformer'
import { VkPostApi } from '@/vk-api/service/vk-post-api.service'
import { AudioExtractor } from '@/data/service/audio-extractor.service'
import { Audio } from '@/data/entity/audio.entity'

@Controller('post')
export class PostController {
  constructor(
    private readonly postApi: VkPostApi,
    private readonly audioExtractor: AudioExtractor,
  ) {}

  @Get('recent/:owner')
  public async getRecentAudio(@Param('owner') owner: string): Promise<Audio[]> {
    // Check if owner is number
    let ownerId = parseInt(owner, 10)
    if (isNaN(ownerId)) {
      const type = await this.postApi.resolveScreenName(owner)

      if (type.type === undefined || type.object_id === undefined) {
        throw new NotFoundException(`User/group ${owner} is not found`)
      }

      ownerId = type.type === 'user' ? type.object_id : -type.object_id
    }

    return this.getRecentById(ownerId)
  }

  protected async getRecentById(ownerId: number): Promise<Audio[]> {
    let recent = await this.postApi.getRecentById(ownerId, 0, 50)

    const extracted = this.audioExtractor.extract(recent.items)

    if (extracted.length >= 30) {
      return this.convertUrls(extracted)
    }

    recent = await this.postApi.getRecentById(ownerId, 50, 100)

    return this.convertUrls(
      extracted.concat(this.audioExtractor.extract(recent.items)),
    )
  }

  protected convertUrls(audio: Audio[]): Audio[] {
    for (const track of audio) {
      track.url = proxyTransformer(track.url)
    }

    return audio
  }
}
