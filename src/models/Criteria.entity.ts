import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "criterias" })
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  criteria: string;
}
