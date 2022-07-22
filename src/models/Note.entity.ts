import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Judge } from './Judge.entity';
import { Performance } from './Performance.entity';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToOne(() => Judge, (j) => j.id)
  @JoinColumn()
  judge: Judge;

  @ManyToOne(() => Performance, (p) => p.scores)
  performance: Performance;
}
