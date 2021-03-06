import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorRepository } from './actor.repository';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActorRepository])],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
