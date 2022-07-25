import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
}
