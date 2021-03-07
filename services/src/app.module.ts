import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './users/user.module';
import { MovieModule } from './movies/movie.module';
import { ActorModule } from './actors/actor.module';
import { ormConfig } from './config/orm.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public/assets'),
      exclude: ['/v1/api/*'],
      serveStaticOptions: {
        cacheControl: true,
        extensions: ['jpeg', 'jpg', 'png'],
      },
    }),
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    MovieModule,
    ActorModule,
  ],
})
export class AppModule {}
