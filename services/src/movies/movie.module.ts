import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { ActorRepository } from '../actors/actor.repository';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieRepository, ActorRepository])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
