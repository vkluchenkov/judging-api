import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Judge } from './Judge.entity';
import { Role } from './Role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Judge)
  @JoinColumn()
  judge: Judge;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
