import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as EAduit from './enums';

@Entity()
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EAduit.EAduitType,
    default: EAduit.EAduitType.CREATE,
    nullable: false,
  })
  type: EAduit.EAduitType;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  movieId: string;

  /**
   * @description Time area
   */
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @BeforeInsert()
  updateWhenInsert() {
    this.createdAt = new Date();
  }
}
