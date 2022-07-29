import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { Competition } from './Competition.entity';
import { Contestant } from './Contestant.entity';
import { Judge } from './Judge.entity';
import { Note } from './Note.entity';
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

  @ManyToOne(() => Contestant)
  contestant: Contestant;

  @OneToMany(() => Score, (score) => score.performance)
  @JoinTable()
  scores: Score[];

  @OneToMany(() => Note, (note) => note.performance)
  @JoinTable()
  notes: Note[];

  @ManyToOne(() => Competition)
  competition: Competition;
}
