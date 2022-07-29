import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
