import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AudioAttachment } from '@/vk-api/service/vk-post-api.service'

@Entity()
export class Audio {
  @PrimaryColumn()
  public id!: number

  @PrimaryColumn()
  public ownerId!: number

  @Column()
  public artist!: string

  @Column()
  public title!: string

  @Column()
  public duration!: number

  @Column()
  public date!: number

  @Column()
  public url!: string

  constructor(audioAttachment?: AudioAttachment) {
    if (audioAttachment === undefined) {
      return
    }
    const audio = audioAttachment.audio

    this.id = audio.id
    this.ownerId = audio.owner_id
    this.artist = audio.artist
    this.title = audio.title
    this.duration = audio.duration
    this.date = audio.date
    this.url = audio.url
  }
}
