import { Injectable } from '@nestjs/common'
import { Interval, NestSchedule } from 'nest-schedule'
import * as delay from 'delay'
import { Updater } from './updater.service'

const CRON_INTERVAL_REQUESTS = 1000 * 60 * 10
const CRON_INTERVAL_NEW = 1000 * 60 * 60
const REPEAT_DELAY = 1000 * 30

@Injectable()
export class CronService extends NestSchedule {
  constructor(private readonly updater: Updater) {
    super()
  }

  @Interval(CRON_INTERVAL_REQUESTS, { waiting: true, immediate: true })
  public async cronRequests(): Promise<void> {
    await this.updater.updateRequests()
    await delay(REPEAT_DELAY)
  }

  @Interval(CRON_INTERVAL_NEW, { waiting: true, immediate: false })
  public async cronNew(): Promise<void> {
    await this.updater.updateNew()
    await delay(REPEAT_DELAY)
  }
}
