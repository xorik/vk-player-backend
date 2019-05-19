import { Module } from '@nestjs/common'
import { VkApi } from './service/vk-api.service'
import { VkPostApi } from './service/vk-post-api.service'
import { VkGroupApi } from './service/vk-group-api.service'

@Module({
  providers: [VkApi, VkPostApi, VkGroupApi],
  exports: [VkPostApi, VkGroupApi],
})
export class VkApiModule {}
