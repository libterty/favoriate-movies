import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { MovieModule } from './movies/movie.module';
import { ActorModule } from './actors/actor.module';
import { ormConfig } from './config/orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule, MovieModule, ActorModule],
})
export class AppModule {}
