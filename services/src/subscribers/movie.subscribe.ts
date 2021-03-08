import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { AuditLog } from '../audits/audit.entity';
import * as EAduit from '../audits/enums';

@EventSubscriber()
export class MovieSubscriber implements EntitySubscriberInterface<Movie> {
  listenTo() {
    return Movie;
  }

  /**
   * @description Called after entity insertion
   * @event
   * @Create
   * @public
   * @param {InsertEvent<Movie>} event
   */
  afterInsert(event: InsertEvent<Movie>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {InsertEvent<Movie>} event
   */
  afterUpdate(event: InsertEvent<Movie>) {
    // last contributors in the list will always be latest one commit the change
    this.insertUpdateEvent(event.entity);
  }

  /**
   * @description Insert create movie log
   * @public
   * @param {Movie} event
   */
  insertCreateEvent(event: Movie) {
    const auditLog = new AuditLog();
    auditLog.type = EAduit.EAduitType.CREATE;
    auditLog.userId = event.contributors[event.contributors.length - 1].id;
    auditLog.movieId = event.id;
    auditLog.save();
  }

  /**
   * @description Insert update movie log
   * @public
   * @param {Movie} event
   */
  insertUpdateEvent(event: Movie) {
    const auditLog = new AuditLog();
    auditLog.type = EAduit.EAduitType.UPDATE;
    auditLog.userId = event.contributors[event.contributors.length - 1].id;
    auditLog.movieId = event.id;
    auditLog.save();
  }
}
