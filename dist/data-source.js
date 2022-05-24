"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Category_entity_1 = require("./models/Category.entity");
const Contestant_entity_1 = require("./models/Contestant.entity");
const Criteria_entity_1 = require("./models/Criteria.entity");
const Judge_entity_1 = require("./models/Judge.entity");
const Performance_entity_1 = require("./models/Performance.entity");
const Score_entity_1 = require("./models/Score.entity");
const dotenv = require("dotenv");
const User_entity_1 = require("./models/User.entity");
dotenv.config();
const { DB_HOST, DB_USERNAME, DB_NAME, DB_PASSWORD } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [Category_entity_1.Category, Contestant_entity_1.Contestant, Criteria_entity_1.Criteria, Judge_entity_1.Judge, Performance_entity_1.Performance, Score_entity_1.Score, User_entity_1.User],
    synchronize: false,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
//
//# sourceMappingURL=data-source.js.map