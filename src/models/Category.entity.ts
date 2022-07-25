import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Judge } from './Judge.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: false })
  isClosed: boolean;

  @Column({ nullable: false, default: false })
  isFinished: boolean;

  @ManyToMany(() => Judge, (judge) => judge.id)
  @JoinTable()
  approvedBy: Judge[];
}
