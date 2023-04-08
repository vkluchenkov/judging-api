import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Score } from './Score.entity';

@Entity({ name: 'criterias' })
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @OneToMany(() => Score, (score) => score.criteria)
  @JoinTable()
  scores: Score[];
}
