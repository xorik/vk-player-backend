import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as delay from 'delay'
import { UpdateRequest } from './update-request.entity'
import { VkSource } from '@/data/entity/vk-source.entity'
import { PostImportService } from '@/updater/post-import.service'
import { CronLogger } from '@/logger/cron-logger.service'

const API_DELAY = 1000
const POST_COUNT = 100

@Injectable()
export class Updater {
  constructor(
    @InjectRepository(UpdateRequest)
    private readonly requestRepository: Repository<UpdateRequest>,
    @InjectRepository(VkSource)
    private readonly sourceRepository: Repository<VkSource>,
    private readonly postImportService: PostImportService,
    private readonly logger: CronLogger,
  ) {}

  public async addRequest(sourceId: number, numPosts: number): Promise<void> {
    const request = new UpdateRequest(sourceId, numPosts)
    await this.requestRepository.save(request)
  }

  public async update(): Promise<void> {
    const requests = await this.requestRepository.find({ take: 100 })
    if (requests.length === 0) {
      return
    }

    this.logger.info(`Updating ${requests.length} requests`)

    for (const request of requests) {
      await this.updateOne(request)
      await this.requestRepository.remove(request)
    }

    this.logger.info(`Update finished`)
  }

  protected async updateOne(request: UpdateRequest): Promise<void> {
    const source = await this.sourceRepository.findOne(request.sourceId)

    if (source === undefined) {
      throw new Error('This is strange')
    }

    let offset = source.parsedPosts
    if (offset > 0) {
      this.logger.debug(`Starting offset is ${offset}`)
    }
    while (true) {
      // Nothing to do more
      if (source.isCompleted || source.parsedPosts >= request.numPosts) {
        this.logger.debug(
          `Parsed ${source.parsedPosts} from ${request.numPosts}`,
        )
        return
      }

      // Get posts
      const importedCount = await this.postImportService.import(
        request.sourceId,
        offset,
        POST_COUNT,
      )
      this.logger.debug(
        `Imported ${importedCount} posts from ${source.name} (${source.id})`,
      )

      // Update source info
      source.parsedPosts += importedCount
      if (importedCount < POST_COUNT || importedCount === 0) {
        source.isCompleted = true
        this.logger.debug(`Assume that we imported all posts from the source`)
      }

      await this.sourceRepository.save(source)
      await delay(API_DELAY)

      offset += POST_COUNT
    }
  }
}
