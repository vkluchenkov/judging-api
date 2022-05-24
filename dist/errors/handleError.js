"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (args) => {
    const statusCode = args.err.statusCode || 500;
    const message = args.err.message || 'Server error';
    args.res.status(statusCode).send({ message });
};
exports.handleError = handleError;
//# sourceMappingURL=handleError.js.map