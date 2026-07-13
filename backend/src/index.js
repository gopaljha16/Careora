"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const applications_1 = __importDefault(require("./routes/applications"));
const notes_1 = __importDefault(require("./routes/notes"));
const interviews_1 = __importDefault(require("./routes/interviews"));
const stats_1 = __importDefault(require("./routes/stats"));
const settings_1 = __importDefault(require("./routes/settings"));
const referrals_1 = __importDefault(require("./routes/referrals"));
const learning_1 = __importDefault(require("./routes/learning"));
require("./jobs/dailyDigest");
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Rate Limiters
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // Limit each IP to 30 auth requests per hour
    message: { error: 'Too many authentication attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use((0, helmet_1.default)());
// Restrict CORS in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
        : '*',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/applications/:applicationId/notes', notes_1.default);
app.use('/api/applications/:applicationId/interviews', interviews_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/referrals', referrals_1.default);
app.use('/api/learning', learning_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`🚀 API server running on port ${port}`);
});
