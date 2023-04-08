import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contestant } from './Contestant.entity';
import { Judge } from './Judge.entity';
import { Performance } from './Performance.entity';

@Entity({ name: 'competitions' })
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Judge, (judge) => judge.id)
  @JoinTable()
  judges: Judge[];

  @ManyToMany(() => Contestant, (contestant) => contestant.id)
  @JoinTable()
  contestants: Contestant[];

  @OneToMany(() => Performance, (performance) => performance.competition)
  @JoinTable()
  performances: Performance[];
}
