import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UserRepository } from '../users/user.repository';
import { MovieRepository } from './movie.repository';
import { ActorRepository } from '../actors/actor.repository';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { UploaderService } from '../uploaders/uploader.service';

@Module({
  imports: [MulterModule.register(), TypeOrmModule.forFeature([MovieRepository, UserRepository, ActorRepository])],
  controllers: [MovieController],
  providers: [MovieService, UploaderService],
})
export class MovieModule {}
