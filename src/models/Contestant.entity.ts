import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "contestants" })
export class Contestant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  contestantName: string;
}
