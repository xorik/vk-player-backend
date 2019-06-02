import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User])],
})
export class DataModule {}
