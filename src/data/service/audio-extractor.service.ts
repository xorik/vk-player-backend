import { Injectable } from '@nestjs/common'
import { Audio } from '../entity/audio.entity'
import { AudioAttachment, Post } from '@/vk-api/service/vk-post-api.service'

@Injectable()
export class AudioExtractor {
  public extract(posts: Post[]): Audio[] {
    const audio: Audio[] = []
    for (const post of posts) {
      // Handle repost
      if (post.copy_history !== undefined) {
        const found = this.extract(post.copy_history)

        if (found.length > 0) {
          audio.push(...found)
        }
      }

      if (post.attachments === undefined) {
        continue
      }

      for (const attachment of post.attachments) {
        if (attachment.type === 'audio') {
          // TODO: fix workaround
          audio.push(new Audio(attachment as AudioAttachment))
        }
      }
    }

    return audio
  }
}
