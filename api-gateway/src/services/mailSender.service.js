import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

export class MailSenderService {
  transporter;
  email = 'datttp113@gmail.com';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.email,
        pass: process.env.MAIL_SECRET_KEY,
      },
    });
  }

  async sendEmailWithText({ recipient, subject, content }) {
    try {
      await this.transporter.sendMail({
        from: this.email,
        to: recipient,
        subject: subject,
        text: content,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async sendEmailWithHTML({ recipient, subject }) {
    try {
      await this.transporter.sendMail({
        from: this.email,
        to: recipient,
        subject: subject,
        html: 'This is a test email',
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}

export default MailSenderService;
