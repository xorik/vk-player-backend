import { Injectable } from '@nestjs/common'
import proxyTransformer from './proxyTransformer'
import {
  Attachment,
  AudioAttachment,
  Post,
} from '@/vk-api/service/vk-post-api.service'

interface Audio {
  id: number
  ownerId: number
  title: string
  duration: number
  artist: string
  date: number
  url: string
}

@Injectable()
class AudioExtractor {
  public extract(posts: Post[]): Audio[] {
    const audio: Audio[] = []
    posts.forEach((post: Post) => {
      // Handle repost
      if (post.copy_history !== undefined) {
        const found = this.extract(post.copy_history)

        if (found.length > 0) {
          audio.push(...found)
        }
      }

      if (post.attachments === undefined) {
        return
      }

      post.attachments.forEach((attachment: Attachment) => {
        if (attachment.type !== 'audio') {
          return
        }

        // TODO: remove workaround
        audio.push(this.transform(attachment as AudioAttachment))
      })
    })

    return audio
  }

  protected transform({ audio }: AudioAttachment): Audio {
    return {
      id: audio.id,
      ownerId: audio.owner_id,
      artist: audio.artist,
      title: audio.title,
      duration: audio.duration,
      date: audio.date,
      url: proxyTransformer(audio.url),
    }
  }
}

export { AudioExtractor, Audio }
