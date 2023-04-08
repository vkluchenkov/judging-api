import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competition } from './Competition.entity';
import { User } from './User.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: 'judge' | 'contestAdmin' | 'globalAdmin';

  @OneToOne(() => Competition, { nullable: true })
  @JoinColumn()
  competition: Competition;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
