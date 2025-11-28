import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.mail.smtpHost,
      port: env.mail.smtpPort,
      secure: false,
      auth: {
        user: env.mail.user,
        pass: env.mail.password
      }
    });
  }

  async sendVerification(email, token) {
    return this.transporter.sendMail({
      to: email,
      subject: 'Verify your Fluxstore account',
      text: `Click to verify: https://fluxstore.example.com/verify?token=${token}`
    });
  }

  async sendPasswordReset(email, token) {
    return this.transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      text: `Reset token: ${token}`
    });
  }

  async sendNewsletter({ to, name, locale = 'pt', content }) {
    const greetings = {
      pt: 'Olá',
      en: 'Hello'
    };

    const headline = content.subject || 'Novidades e ofertas da Fluxstore';
    const hero = content.highlightProducts
      .map((product) => `- ${product.title} por ${product.price} ${product.currency}`)
      .join('\n');
    const announcements = content.announcements.map((a) => `• ${a}`).join('\n');

    return this.transporter.sendMail({
      from: env.mail.user,
      to,
      subject: headline,
      text: `${greetings[locale] || greetings.pt} ${name || ''}\n${headline}\n${hero}\n${announcements}`
    });
  }

  async sendNotification({ to, subject, body }) {
    return this.transporter.sendMail({
      from: env.mail.user,
      to,
      subject: subject || 'Atualização da Fluxstore',
      text: body
    });
  }
}

export const mailer = new Mailer();
