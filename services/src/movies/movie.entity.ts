import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, JoinColumn, ManyToMany, AfterLoad } from 'typeorm';
import { User } from '../users/user.entitiy';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  desc: string;

  @Column({ type: 'float', nullable: false, default: 0.0 })
  ratings: number;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  /**
   * @description Relation with users
   */
  @ManyToMany(
    () => User,
    (user) => user.rateMovies,
  )
  @JoinColumn()
  rateUsers: User[];

  @ManyToMany(
    () => User,
    (user) => user.contributings,
  )
  @JoinColumn()
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
