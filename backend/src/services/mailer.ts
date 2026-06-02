import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user,
    pass,
  },
});

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Careora Dev" <dev@careora.local>',
      to,
      subject,
      text,
      html: html || text,
    });
    console.log(`[Mailer] Message sent to ${to}: ${info.messageId}`);
    if (host === 'smtp.ethereal.email') {
      console.log(`[Mailer] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error(`[Mailer] Error sending message to ${to}:`, error);
  }
};
