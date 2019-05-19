import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { VkApiError } from '../error/vk-api.error'

const API_VERSION = '5.53'

interface VkResponse {
  response: any
  error?: {
    error_code: number
    error_msg: string
    request_params: Array<{ key: string; value: string }>
  }
}

@Injectable()
export class VkApi {
  private api: AxiosInstance

  constructor() {
    const token = process.env.VK_TOKEN
    const appId = process.env.VK_APP_ID

    this.api = axios.create({
      baseURL: process.env.VK_API_BASEURL,
      params: {
        access_token: token,
        api_id: appId,
        v: API_VERSION,
      },
    })
  }

  public async request(method: string, params?: any): Promise<any> {
    const response: AxiosResponse<VkResponse> = await this.api.get(method, {
      params,
    })

    if (response.data.error !== undefined) {
      const error = response.data.error

      throw new VkApiError(
        error.error_msg,
        error.error_code,
        error.request_params,
      )
    }

    return response.data.response
  }
}
