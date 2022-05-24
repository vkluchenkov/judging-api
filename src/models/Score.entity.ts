import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Criteria } from './Criteria.entity';
import { Judge } from './Judge.entity';
import { Performance } from './Performance.entity';

@Entity({ name: 'scores' })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  value: string;

  @OneToOne(() => Judge, (j) => j.id)
  @JoinColumn()
  judge: Judge;

  @OneToOne(() => Criteria, (c) => c.id)
  @JoinColumn()
  criteria: Criteria;

  @ManyToOne(() => Performance, (p) => p.scores)
  performance: Performance;
}
