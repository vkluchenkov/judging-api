import { DataSource } from 'typeorm';
import { Category } from './models/Category.entity';
import { Contestant } from './models/Contestant.entity';
import { Criteria } from './models/Criteria.entity';
import { Judge } from './models/Judge.entity';
import { Performance } from './models/Performance.entity';
import { Score } from './models/Score.entity';
import { User } from './models/User.entity';
import { Role } from './models/Role.entity';
import { Note } from './models/Note.entity';
import { Competition } from './models/Competition.entity';

import { config } from 'dotenv';
config();

const { DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    Category,
    Contestant,
    Competition,
    Criteria,
    Judge,
    Note,
    Performance,
    Role,
    Score,
    User,
  ],
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
//
