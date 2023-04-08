import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category.entity';
import { Competition } from './Competition.entity';
import { Score } from './Score.entity';

@Entity({ name: 'judges' })
export class Judge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Category, (category) => category.id)
  approvedCategories: Category[];

  @ManyToMany(() => Competition, (competition) => competition.id)
  competitions: Competition[];

  @OneToMany(() => Score, (score) => score.judge)
  @JoinTable()
  scores: Score[];

  @ManyToMany(() => Category, (category) => category.judges)
  categories: Category[];
}
