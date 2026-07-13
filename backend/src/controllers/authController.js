"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d');
const signToken = (userId) => jsonwebtoken_1.default.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { email, passwordHash, name },
        });
        res.status(201).json({
            token: signToken(user.id),
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        res.json({
            token: signToken(user.id),
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
