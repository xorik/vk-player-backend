import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/data/entity/user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  public async auth(@Body('token') token: string): Promise<User> {
    const user = await this.userRepository.findOne({ token })

    if (user === undefined) {
      throw new UnauthorizedException('Token not found')
    }

    return user
  }
}
