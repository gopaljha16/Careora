"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${statusCode} - ${message}`);
    if (err.details) {
        console.error(err.details);
    }
    res.status(statusCode).json({
        error: message,
        ...(err.details && { details: err.details }),
    });
};
exports.errorHandler = errorHandler;
