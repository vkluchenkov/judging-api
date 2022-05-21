"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const typeorm_1 = require("typeorm");
const Criteria_entity_1 = require("./Criteria.entity");
const Judge_entity_1 = require("./Judge.entity");
const Performance_entity_1 = require("./Performance.entity");
let Score = class Score {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Score.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Score.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Judge_entity_1.Judge),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Number)
], Score.prototype, "judgeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, typeorm_1.OneToOne)(() => Criteria_entity_1.Criteria, (c) => c.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Number)
], Score.prototype, "criteriaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, typeorm_1.ManyToOne)(() => Performance_entity_1.Performance, (p) => p.id),
    __metadata("design:type", Number)
], Score.prototype, "performanceId", void 0);
Score = __decorate([
    (0, typeorm_1.Entity)({ name: 'scores' })
], Score);
exports.Score = Score;
//# sourceMappingURL=Score.entity.js.map