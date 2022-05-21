import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Score } from "./Score.entity";

@Entity({ name: "criterias" })
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  criteria: string;
}
