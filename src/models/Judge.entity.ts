import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category.entity';
import { Score } from './Score.entity';

@Entity({ name: 'judges' })
export class Judge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Category, (category) => category.id)
  approvedCategories: Category[];

  @OneToMany(() => Score, (score) => score.judge)
  @JoinTable()
  scores: Score[];
}
