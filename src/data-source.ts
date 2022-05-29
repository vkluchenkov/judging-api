import { DataSource } from 'typeorm';
import { Category } from './models/Category.entity';
import { Contestant } from './models/Contestant.entity';
import { Criteria } from './models/Criteria.entity';
import { Judge } from './models/Judge.entity';
import { Performance } from './models/Performance.entity';
import { Score } from './models/Score.entity';
import { config } from 'dotenv';
import { User } from './models/User.entity';
config();

const { DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Category, Contestant, Criteria, Judge, Performance, Score, User],
  synchronize: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
//
