import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '../entity/user.entity'
import { VkSource } from '../entity/vk-source.entity'
import { UserSource } from '../entity/user-source.entity'
import { VkGroupApi } from '@/vk-api/service/vk-group-api.service'

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(VkSource)
    private readonly vkSourceRepository: Repository<VkSource>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly groupApi: VkGroupApi,
  ) {}

  public async add(
    user: User,
    sourceId: number,
    name: string,
    group: string,
  ): Promise<void> {
    this.assertNewSource(user, sourceId)

    // TODO: move this part somewhere else, store only IDs
    let source = await this.vkSourceRepository.findOne(sourceId)
    if (source === undefined) {
      if (sourceId < 0) {
        const response = await this.groupApi.details([-sourceId])
        source = new VkSource(response[0])
      } else {
        // TODO: get user
        source = new VkSource()
        source.name = name
        source.id = sourceId
      }

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
      // TODO: handle in controller
      throw new Error('Source already exists')
    }
  }
}
