import { createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { User as UserEntity } from '@/data/entity/user.entity'

export const AuthUser = createParamDecorator(
  (data: any, req: Request): UserEntity => {
    return req.user
  },
)
