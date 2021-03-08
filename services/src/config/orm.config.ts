import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entitiy';
import { Movie } from '../movies/movie.entity';
import { Actor } from '../actors/actor.entity';
import { AuditLog } from '../audits/audit.entity';
import { MovieSubscriber } from '../subscribers/movie.subscribe';
import { config } from '../../config';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.DB_SETTINGS.host,
  port: config.DB_SETTINGS.port,
  username: config.DB_SETTINGS.username,
  password: config.DB_SETTINGS.password,
  database: config.DB_SETTINGS.database,
  entities: [User, Movie, Actor, AuditLog],
  migrations: [`${__dirname}./migration/*.ts`],
  subscribers: [MovieSubscriber],
  synchronize: true,
  logging: false,
};
