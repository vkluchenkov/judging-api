import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  scores: number[];
}
