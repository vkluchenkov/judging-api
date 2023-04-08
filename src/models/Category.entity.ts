import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Competition } from './Competition.entity';
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

  @OneToOne(() => Competition)
  competition: Competition;

  @ManyToMany(() => Judge, (judge) => judge.id)
  @JoinTable()
  approvedBy: Judge[];

  @ManyToMany(() => Judge, (judge) => judge.categories)
  @JoinTable()
  judges: Judge[];
}
