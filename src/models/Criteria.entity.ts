import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'criterias' })
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;
}
