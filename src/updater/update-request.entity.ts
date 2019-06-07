import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UpdateRequest {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public sourceId!: number

  @Column()
  public numPosts!: number

  constructor(sourceId?: number, numPosts?: number) {
    if (sourceId !== undefined && numPosts !== undefined) {
      this.sourceId = sourceId
      this.numPosts = numPosts
    }
  }
}
