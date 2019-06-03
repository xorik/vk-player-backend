import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { VkSource } from './vk-source.entity'

@Entity()
export class UserSource {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public name!: string

  @Column()
  public group!: string

  @ManyToOne((type: any) => User)
  public user!: User

  @ManyToOne((type: any) => VkSource)
  public source!: VkSource

  @Column()
  public sourceId!: number
}
