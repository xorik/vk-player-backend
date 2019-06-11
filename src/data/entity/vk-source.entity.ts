import { Column, Entity, PrimaryColumn } from 'typeorm'
import { GroupSearchResult } from '@/vk-api/service/vk-group-api.service'

@Entity()
export class VkSource {
  @PrimaryColumn()
  public id!: number

  @Column()
  public name!: string

  @Column()
  public screenName: string = ''

  @Column()
  public isCompleted: boolean = false

  @Column()
  public parsedPosts: number = 0

  constructor(group?: GroupSearchResult) {
    if (group === undefined) {
      return
    }

    this.id = -group.id
    this.name = group.name
    this.screenName = group.screen_name
  }
}
