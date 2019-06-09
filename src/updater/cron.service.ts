import { Injectable } from '@nestjs/common'
import { Interval, NestSchedule } from 'nest-schedule'
import * as delay from 'delay'
import { Updater } from './updater.service'

const CRON_INTERVAL = 1000 * 60 * 10
const REPEAT_DELAY = 1000 * 30

@Injectable()
export class CronService extends NestSchedule {
  constructor(private readonly updater: Updater) {
    super()
  }

  @Interval(CRON_INTERVAL, { waiting: true, immediate: true })
  public async cron(): Promise<void> {
    await this.updater.update()
    await delay(REPEAT_DELAY)
  }
}
