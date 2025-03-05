import nodemailer from 'nodemailer';
import { mailerConfig } from '../config/constants';

/**
 * Função para enviar e-mail.
 *
 * @param {object} data - Objeto contendo os dados do e-mail.
 * @param {string} data.name - Nome do usuário.
 * @param {string} data.email - E-mail do usuário.
 * @param {string} data.message - Mensagem do usuário.
 * @returns {Promise<string>} Retorna uma Promise que resolve para uma string de confirmação.
 */
export async function sendMail ({ name, email, subject, message }) {
    const transporter = nodemailer.createTransport({
        host: mailerConfig.host,
        port: mailerConfig.port,
        secure: mailerConfig.secure,
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

    return transporter.sendMail(mailOptions);
};
