/**
 * API Provider Based on https://www.back4app.com/database/paul-datasets/dataset-with-all-movies/get-started/node-js/rest-api/node-fetch?objectClassSlug=movies-list-api
 * Copyright (c) 2020, Back4App Inc. https://www.back4app.com/database
 *
 *
 * Additional inconsequential by @libterty
 * opyright (c) 2021, libterty https://github.com/libterty/favoriate-movies/blob/master/LICENCE
 */

import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { createConnection, Connection } from 'typeorm';
import { User } from '../users/user.entitiy';
import { Movie } from '../movies/movie.entity';
import { Actor } from '../actors/actor.entity';
import { AuditLog } from '../audits/audit.entity';
import { config } from '../../config';
import { CreateActorDto } from '../actors/dtos';

class Back4Provider {
  private readonly logger: Logger = new Logger('Back4Provider');

  /**
   * @description Get Stars from Back4 and stor in db
   * @private
   * @param {Connection} connection
   * @returns {Promise<boolean>}
   */
  private async getStars(connection: Connection): Promise<boolean> {
    try {
      const response = await fetch('https://parseapi.back4app.com/classes/Star?limit=1000', {
        // this key is not important
        headers: {
          'X-Parse-Application-Id': 'xjK389lSZ70YgvRNe9fb1kd94z9IllRKqOrQIa6l', // This is the fake app's application id
          'X-Parse-Master-Key': '7wHPVDC4MkHR7f6a3gUcYqu8rb8XfVt0GY0gkAs0', // This is the fake app's readonly master key
        },
      });
      const data = await response.json();
      if (!data) throw new Error('Api key probably died, please renew');
      if (!(data.results instanceof Array)) throw new Error('Return result malform');
      for (let i = 0; i < data.results.length; ++i) {
        await this.createSampleActor(connection, { name: data.results[i].name });
      }
      return true;
    } catch (error) {
      this.logger.error(error.message, '', 'GetStartsError');
      throw new Error(error.message);
    }
  }

  /**
   * @description Create sample actor
   * @private
   * @param {Connection} connection
   * @param {CreateActorDto} createActorDto
   * @returns {Promise<boolean>}
   */
  private async createSampleActor(connection: Connection, createActorDto: CreateActorDto): Promise<boolean> {
    const actor = await connection.manager.findOne<Actor>(Actor, { where: { name: createActorDto.name } });
    if (actor) return false;
    const newActor = new Actor();
    newActor.name = createActorDto.name;
    return connection.manager
      .save(newActor)
      .then((result) => {
        this.logger.log(result, 'NewActor');
        return true;
      })
      .catch((error) => {
        this.logger.error(error.message, '', 'NewActorError');
        return false;
      });
  }

  /**
   * @description Generate Entry
   * @public
   * @returns {Promise<void>}
   */
  public async generate(): Promise<void> {
    await createConnection({
      type: 'postgres',
      host: config.DB_SETTINGS.host,
      port: config.DB_SETTINGS.port,
      username: config.DB_SETTINGS.username,
      password: config.DB_SETTINGS.password,
      database: config.DB_SETTINGS.database,
      entities: [User, Movie, Actor, AuditLog],
      synchronize: true,
    })
      .then((connection) => this.getStars(connection))
      .catch((error) => this.logger.error(error.message, '', 'ConnectInitError'));
  }
}

/**
 * @description Bootstrap generate
 */
function bootstrap(): Promise<void> {
  return new Back4Provider().generate();
}

bootstrap();
