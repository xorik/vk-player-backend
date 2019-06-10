import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Audio } from './audio.entity'
import { Post as PostResponse } from '@/vk-api/service/vk-post-api.service'
import { VkSource } from '@/data/entity/vk-source.entity'

@Entity()
export class Post {
  @PrimaryColumn()
  public id!: number

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  public text!: string

  // @Column()
  // public date!: Date

  @Column()
  public isRepost!: boolean

  @ManyToMany((type: any) => Audio)
  @JoinTable()
  public audio!: Audio[]

  @ManyToOne((type: any) => VkSource)
  public source!: VkSource

  @PrimaryColumn()
  public sourceId!: number

  constructor(post?: PostResponse, source?: VkSource) {
    if (post === undefined || source === undefined) {
      return
    }

    this.id = post.id
    // TODO: import date
    // this.date = post.date
    this.text = post.text
    this.isRepost = post.copy_history !== undefined
    this.source = source
    this.sourceId = source.id
  }
}
