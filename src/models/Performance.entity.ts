import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Score } from "./Score.entity";

@Entity({ name: "performances" })
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  number: number;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: false })
  contestantId: number;

  @Column({
    type: "jsonb",
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  judges: number[];

  @Column({
    type: "jsonb",
    array: true,
    default: () => "'[]'",
    nullable: false,
  })
  @OneToMany(() => Score, (s) => s.performanceId)
  scores: number[];
}
