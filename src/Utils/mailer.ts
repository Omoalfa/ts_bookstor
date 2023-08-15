import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from '@/Config';
import { logger } from '@/Logger';
import nodemailer from 'nodemailer';

export interface MailData {
  to: string | string[];
  from: string;
  type: 'html' | 'text',
  content: string;
  subject: string;
}

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  },
  port: Number(MAIL_PORT),
})

export const sendMail = async (data: MailData) => {
  const { to, from, content, type, subject } = data;
  try {
    await transport.sendMail({
      to, from, subject, html: type === 'html' ? content : `<p>${content}</p>`
    })
  } catch (error) {
    logger.error(error);
  }
}
