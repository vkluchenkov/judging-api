import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'judges' })
export class Judge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;
}
