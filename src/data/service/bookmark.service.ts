import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '../entity/user.entity'
import { VkSource } from '../entity/vk-source.entity'
import { UserSource } from '../entity/user-source.entity'

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(VkSource)
    private readonly vkSourceRepository: Repository<VkSource>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async add(
    user: User,
    sourceId: number,
    name: string,
    group: string,
  ): Promise<void> {
    this.assertNewSource(user, sourceId)

    let source = await this.vkSourceRepository.findOne(sourceId)
    if (source === undefined) {
      source = new VkSource()
      source.id = sourceId
      source.name = name // TODO: get with API

      await this.vkSourceRepository.save(source)
    }

    const userSource = new UserSource()
    userSource.name = name
    userSource.group = group
    userSource.user = user
    userSource.source = source

    user.vkSources.push(userSource)
    await this.userRepository.save(user)
  }

  protected assertNewSource(user: User, sourceId: number): void {
    const index = user.vkSources.findIndex(
      (s: UserSource): boolean => s.sourceId === sourceId,
    )

    if (index >= 0) {
      throw new Error('Source already exists')
    }
  }
}
