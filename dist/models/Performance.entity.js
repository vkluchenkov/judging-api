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
exports.Performance = void 0;
const typeorm_1 = require("typeorm");
const Score_entity_1 = require("./Score.entity");
let Performance = class Performance {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Performance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Performance.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Performance.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Performance.prototype, "contestantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        array: true,
        default: () => "'[]'",
        nullable: false,
    }),
    __metadata("design:type", Array)
], Performance.prototype, "judges", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        array: true,
        default: () => "'[]'",
        nullable: false,
    }),
    (0, typeorm_1.OneToMany)(() => Score_entity_1.Score, (s) => s.performanceId),
    __metadata("design:type", Array)
], Performance.prototype, "scores", void 0);
Performance = __decorate([
    (0, typeorm_1.Entity)({ name: "performances" })
], Performance);
exports.Performance = Performance;
//# sourceMappingURL=Performance.entity.js.map