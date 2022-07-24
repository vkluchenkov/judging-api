import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Judge } from './Judge.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  isClosed: boolean;

  @Column({ nullable: false })
  isFinished: boolean;

  @ManyToMany(() => Judge, (judge) => judge.approvedCategories)
  @JoinTable()
  approvedBy: Judge[];
}
