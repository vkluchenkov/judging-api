import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competition } from './Competition.entity';
import { Performance } from './Performance.entity';

@Entity({ name: 'contestants' })
export class Contestant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Performance, (p) => p.contestant)
  @JoinTable()
  performances: Performance[];

  @ManyToMany(() => Competition, (competition) => competition.id)
  competitions: Competition[];
}
