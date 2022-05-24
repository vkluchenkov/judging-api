"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User_entity_1 = require("../models/User.entity");
const data_source_1 = require("../data-source");
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
const ConflictError_1 = require("../errors/ConflictError");
dotenv.config();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const { username, password } = req.body;
    const usersRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    try {
        const user = yield usersRepository.findOneBy({ username });
        if (!user)
            throw new UnauthorizedError_1.UnauthorizedError('Incorrect credentials');
        else {
            const match = yield bcrypt.compare(password, user.password);
            if (!match)
                throw new UnauthorizedError_1.UnauthorizedError('Incorrect credentials');
            else {
                const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
                const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });
                res.send({ token });
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const usersRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    try {
        const user = yield usersRepository.findOneBy({ username });
        if (user)
            throw new ConflictError_1.ConflictError('User with this username already exists');
        else {
            const hashedPass = yield bcrypt.hash(password, 10);
            yield usersRepository.save({ username, password: hashedPass });
            res.send({ message: `User ${username} created` });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
//# sourceMappingURL=user.js.map