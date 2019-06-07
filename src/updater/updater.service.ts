import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateRequest } from './update-request.entity'
import { VkSource } from '@/data/entity/vk-source.entity'
import { PostImportService } from '@/updater/post-import.service'

const POST_COUNT = 100

@Injectable()
export class Updater {
  constructor(
    @InjectRepository(UpdateRequest)
    private readonly requestRepository: Repository<UpdateRequest>,
    @InjectRepository(VkSource)
    private readonly sourceRepository: Repository<VkSource>,
    private readonly postImportService: PostImportService,
  ) {}

  public async addRequest(sourceId: number, numPosts: number): Promise<void> {
    const request = new UpdateRequest(sourceId, numPosts)
    await this.requestRepository.save(request)
  }

  public async update(): Promise<void> {
    const requests = await this.requestRepository.find({ take: 100 })

    for (const request of requests) {
      await this.updateOne(request)
      await this.requestRepository.remove(request)
    }
  }

  protected async updateOne(request: UpdateRequest): Promise<void> {
    const source = await this.sourceRepository.findOne(request.sourceId)

    if (source === undefined) {
      throw new Error('This is strange')
    }

    let offset = source.parsedPosts
    while (true) {
      // Nothing to do more
      if (source.isCompleted || source.parsedPosts >= request.numPosts) {
        return
      }

      // Get posts
      const importedCount = await this.postImportService.import(
        request.sourceId,
        offset,
        POST_COUNT,
      )

      // Update source info
      source.parsedPosts += importedCount
      if (importedCount < POST_COUNT || importedCount === 0) {
        source.isCompleted = true
      }

      await this.sourceRepository.save(source)

      // Check if we got what we need

      offset += POST_COUNT
    }
  }
}
