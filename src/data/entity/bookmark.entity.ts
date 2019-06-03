import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  public id!: number

  @ManyToOne((type: any) => User)
  public user!: User

  @Column()
  public groupId!: number

  @Column()
  public name!: string

  @Column()
  public group!: string
}
