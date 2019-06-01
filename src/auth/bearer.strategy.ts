import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy } from 'passport-http-bearer'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  public async validate(token: string): Promise<User> {
    // String? WTF?
    if (token === 'undefined') {
      throw new UnauthorizedException()
    }

    const user = await this.userRepository.findOne({ token })

    if (user === undefined) {
      throw new UnauthorizedException()
    }

    return user
  }
}
