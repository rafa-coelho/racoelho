/**
 * Interface para os parâmetros do template de email do ebook
 */
interface EbookEmailTemplateParams {
  name: string;
  tituloEbook: string;
  downloadUrl: string;
}

/**
 * Retorna o HTML de um e-mail de "eBook enviado" em estilo dark.
 *
 * @param params - Objeto de parâmetros para montar o e-mail.
 * @returns HTML completo do e-mail.
 */
export function getEbookEmailTemplate({
  name,
  tituloEbook,
  downloadUrl
}: EbookEmailTemplateParams): string {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Seu eBook</title>
    <style type="text/css">
      /* Resets básicos */
      body, table, td, p {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <body style="background-color: #f4f4f4; margin:0; padding:0;">
    <!-- Container principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <!-- Caixa central -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #161b22; border-radius: 6px; overflow: hidden;">
            <!-- Cabeçalho -->
            <tr>
              <td align="center" style="background-color: #0d1117; padding: 20px;">
                <h1 style="font-size: 24px; color: #ffffff; margin: 0;">Obrigado por baixar nosso eBook!</h1>
              </td>
            </tr>
            <!-- Conteúdo principal -->
            <tr>
              <td style="background-color: #161b22; padding: 20px;">
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Olá <strong style="color: #ffffff;">${name}</strong>,
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Obrigado por se interessar pelo nosso eBook <strong style="color: #ffffff;">${tituloEbook}</strong>. Estamos muito felizes em compartilhar este conteúdo com você!
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Para baixar o eBook, clique no botão abaixo:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${downloadUrl}" style="background-color: #0070f3; color: #ffffff; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Baixar eBook</a>
                </div>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Se o botão não funcionar, você pode copiar e colar o link abaixo no seu navegador:
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px; word-break: break-all;">
                  <a href="${downloadUrl}" style="color: #0070f3;">${downloadUrl}</a>
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Esperamos que o conteúdo seja útil para você e ajude a melhorar sua presença profissional!
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Atenciosamente,<br>
                  <strong style="color: #ffffff;">Equipe de Conteúdo</strong>
                </p>
              </td>
            </tr>
            <!-- Rodapé -->
            <tr>
              <td style="background-color: #0d1117; padding: 20px; text-align: center;">
                <p style="color: #888888; font-size: 12px; margin: 0;">
                  Você recebeu este email porque se inscreveu para receber o eBook "${tituloEbook}".
                </p>
                <p style="color: #888888; font-size: 12px; margin: 10px 0 0 0;">
                  Se você não solicitou este email, por favor, ignore-o ou entre em contato conosco.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
} 