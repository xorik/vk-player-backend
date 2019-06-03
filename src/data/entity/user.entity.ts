import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserSource } from './user-source.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public name!: string

  @Column()
  public token!: string

  @OneToMany((type: any) => UserSource, (s: UserSource) => s.user, {
    cascade: true,
    eager: true,
  })
  public vkSources!: UserSource[]
}
