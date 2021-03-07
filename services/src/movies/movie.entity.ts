import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, Index, JoinTable } from 'typeorm';
import { User } from '../users/user.entitiy';
import { Actor } from '../actors/actor.entity';
import * as EMovie from './enums';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Index({ unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  desc: string;

  @Column({ type: 'float', nullable: false, default: 0.0 })
  ratings: number;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: false })
  director: string;

  @Column({
    type: 'enum',
    enum: EMovie.EMovieTypes,
    nullable: false,
  })
  genre: EMovie.EMovieTypes;

  /**
   * @description Relation with actors
   */
  @ManyToMany(
    () => Actor,
    (actor) => actor.movies,
  )
  @JoinTable()
  actors: Actor[];

  /**
   * @description Relation with users
   */
  @ManyToMany(
    () => User,
    (user) => user.rateMovies,
  )
  @JoinTable()
  rateUsers: User[];

  @ManyToMany(
    () => User,
    (user) => user.contributings,
  )
  @JoinTable()
  contributors: User[];

  /**
   * @description Time area
   */
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @BeforeInsert()
  updateWhenInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDateWhenUpdate() {
    this.updatedAt = new Date();
  }
}
