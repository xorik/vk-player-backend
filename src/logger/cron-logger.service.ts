import { LoggerService, LoggerTransport } from 'nest-logger'

export class CronLogger extends LoggerService {
  constructor() {
    super(
      process.env.LOG_LEVEL || 'info',
      'cron',
      [LoggerTransport.CONSOLE, LoggerTransport.ROTATE],
      'log',
    )
  }
}
