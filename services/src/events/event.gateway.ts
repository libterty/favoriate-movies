import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { Movie } from 'movies/movie.entity';
import { MovieAggregate } from '../aggregates/movie.aggregate';
import { config } from '../../config';

@Injectable()
export class EventGateway {
  private wss: WebSocket.Server;
  private client: WebSocket;
  private readonly logger: Logger = new Logger('EventGateway');
  private readonly movieAggregate: MovieAggregate = new MovieAggregate();

  constructor() {
    this.init();
  }

  /**
   * @description Init
   * @private
   * @returns {void}
   */
  private init(): void {
    this.wss = new WebSocket.Server({ port: config.WSPORT });
    this.wss.on('connection', (ws: WebSocket) => {
      //connection is up, let's add a simple simple event
      ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
      });
      this.logger.log('Connection WS Success');
    });
  }

  /**
   * @description New movie event
   * @public
   * @param {Movie} movie
   * @returns {void}
   */
  public sendNewMovie(movie: Movie): void {
    this.wss.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify(this.movieAggregate.getCreateMovieAggregate(movie)), (err) => {
        if (err) {
          this.logger.error(err.message, '', 'SendUpdateMovieError');
        }
      });
    });
  }

  /**
   * @description Update movie event
   * @public
   * @param {Movie} movie
   * @returns {void}
   */
  public sendUpdateMovie(movie: Movie): void {
    this.wss.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify(this.movieAggregate.getUpdateMovieAggreagte(movie)), (err) => {
        if (err) {
          this.logger.error(err.message, '', 'SendUpdateMovieError');
        }
      });
    });
  }

  /**
   * @description Del movie event
   * @public
   * @param {string} id
   * @returns {void}
   */
  public sendDeleteMovie(id: string): void {
    this.wss.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify(this.movieAggregate.getDeleteMovieAggregate(id)), (err) => {
        if (err) {
          this.logger.error(err.message, '', 'SendUpdateMovieError');
        }
      });
    });
  }
}
