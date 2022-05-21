import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Criteria } from './Criteria.entity';
import { Judge } from './Judge.entity';
import { Performance } from './Performance.entity';

@Entity({ name: 'scores' })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  score: string;

  // @Column({ nullable: false })
  @OneToOne(() => Judge)
  @JoinColumn()
  judgeId: number;

  @Column({ nullable: false })
  @OneToOne(() => Criteria, (c) => c.id)
  @JoinColumn()
  criteriaId: number;

  @Column({ nullable: false })
  @ManyToOne(() => Performance, (p) => p.id)
  performanceId: number;
}
