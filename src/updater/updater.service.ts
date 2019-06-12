import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as delay from 'delay'
import { UpdateRequest } from './update-request.entity'
import { VkSource } from '@/data/entity/vk-source.entity'
import { PostImportService } from '@/updater/post-import.service'
import { CronLogger } from '@/logger/cron-logger.service'

const API_DELAY = 1000
const POST_COUNT_REQUESTS = 100
const POST_COUNT_NEW = 50
const REQUESTS_PER_CYCLE = 100

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

  public async updateRequests(): Promise<void> {
    const requests = await this.requestRepository.find({
      take: REQUESTS_PER_CYCLE,
    })
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

  public async updateNew(): Promise<void> {
    // TODO: pagination
    // TODO: don't update unused?
    const sources = await this.sourceRepository.find()

    for (const source of sources) {
      let offset = 0
      const maxId = source.maxId

      while (true) {
        const stat = await this.postImportService.import(
          source,
          offset,
          POST_COUNT_NEW,
        )

        // Nothing to do
        if (stat.importedCount === 0) {
          break
        }

        this.logger.debug(
          `Imported ${stat.importedCount} posts from ${source.name} (${
            source.id
          })`,
        )

        if (!source.isCompleted) {
          source.parsedPosts += stat.importedCount
        }

        if (stat.maxId === undefined || stat.minId === undefined) {
          throw new Error('This is strange')
        }

        // Update max id
        if (stat.maxId > source.maxId) {
          source.maxId = stat.maxId
        }

        if (stat.minId <= maxId) {
          await this.sourceRepository.save(source)
          break
        }

        await delay(API_DELAY)
        offset += POST_COUNT_NEW
      }
    }
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
      const stat = await this.postImportService.import(
        source,
        offset,
        POST_COUNT_REQUESTS,
      )

      // Update max id
      if (stat.maxId !== undefined && stat.maxId > source.maxId) {
        source.maxId = stat.maxId
      }

      if (stat.isCompleted) {
        source.isCompleted = true
        this.logger.debug(`All posts from the source are imported`)
      } else {
        this.logger.debug(
          `Imported ${stat.importedCount} posts from ${source.name} (${
            source.id
          })`,
        )
        // Update source info
        source.parsedPosts += POST_COUNT_REQUESTS
      }
      await this.sourceRepository.save(source)
      await delay(API_DELAY)

      offset += POST_COUNT_REQUESTS
    }
  }
}
