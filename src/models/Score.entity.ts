import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "scores" })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  score: string;

  @Column({ nullable: false })
  judgeId: number;

  @Column({ nullable: false })
  criteriaId: number;

  @Column({ nullable: false })
  performanceId: number;
}
