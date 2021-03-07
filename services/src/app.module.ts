import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { MovieModule } from './movies/movie.module';
import { ActorModule } from './actors/actor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ormConfig } from './config/orm.config';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public/assets'),
      serveStaticOptions: { extensions: ['jpeg', 'jpg', 'png'], dotfiles: 'allow' }
    }),
    TypeOrmModule.forRoot(ormConfig), 
    UserModule, 
    MovieModule, 
    ActorModule
  ],
})
export class AppModule {}
