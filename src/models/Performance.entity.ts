import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { Contestant } from './Contestant.entity';
import { Score } from './Score.entity';

@Entity({ name: 'performances' })
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  startNumber: number;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @OneToOne(() => Contestant)
  @JoinColumn()
  contestant: Contestant;

  @OneToMany(() => Score, (score) => score.performance)
  @JoinTable()
  scores: Score[];
}
