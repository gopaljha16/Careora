"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
exports.transporter = nodemailer_1.default.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
        user,
        pass,
    },
});
const sendMail = async (to, subject, text, html) => {
    try {
        const info = await exports.transporter.sendMail({
            from: process.env.MAIL_FROM || '"Careora Dev" <dev@careora.local>',
            to,
            subject,
            text,
            html: html || text,
        });
        console.log(`[Mailer] Message sent to ${to}: ${info.messageId}`);
        if (host === 'smtp.ethereal.email') {
            console.log(`[Mailer] Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
    }
    catch (error) {
        console.error(`[Mailer] Error sending message to ${to}:`, error);
    }
};
exports.sendMail = sendMail;
