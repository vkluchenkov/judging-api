"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map