import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category.entity';

@Entity({ name: 'judges' })
export class Judge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Category, (category) => category.approvedBy)
  approvedCategories: Category[];
}
