import nodemailer, { SentMessageInfo } from 'nodemailer';
import { mailerConfig } from '../config/constants';

/**
 * Interface para os dados do email
 */
interface MailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Função para enviar e-mail.
 *
 * @param data - Objeto contendo os dados do e-mail.
 * @returns Retorna uma Promise que resolve para uma string de confirmação ou um objeto SentMessageInfo do nodemailer.
 */
export async function sendMail({ name, email, subject, message }: MailData): Promise<string | SentMessageInfo> {

  const transporter = nodemailer.createTransport({
    host: mailerConfig.host,
    port: Number(mailerConfig.port),
    secure: mailerConfig.secure === 'true',
    auth: {
      user: mailerConfig.user,
      pass: mailerConfig.pass
    }
  });

  const mailOptions = {
    from: `"${mailerConfig.from.name}" <${mailerConfig.from.email}>`,
    to: `${name} <${email}>`,
    subject,
    html: message,
  };


  return await transporter.sendMail(mailOptions);
} 