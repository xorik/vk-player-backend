import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class VkSource {
  @PrimaryColumn()
  public id!: number

  @Column()
  public name!: string
}
