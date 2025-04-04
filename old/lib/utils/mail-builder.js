/**
 * Retorna o HTML de um e-mail de "eBook enviado" em estilo dark.
 *
 * @param {object} params - Objeto de parâmetros para montar o e-mail.
 * @param {string} params.name - Nome do destinatário.
 * @param {string} params.tituloEbook - Título do eBook.
 * @param {string} params.downloadUrl - URL para baixar o eBook.
 * @returns {string} HTML completo do e-mail.
 */
export function getEbookEmailTemplate ({
    name,
    tituloEbook,
    downloadUrl
}) {
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
                  Aqui está seu eBook <strong style="color: #ffffff;">${tituloEbook}</strong>. Esperamos que você aproveite ao máximo o conteúdo!
                </p>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Caso o download não inicie automaticamente, clique no botão abaixo:
                </p>
                <!-- Botão -->
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 20px;">
                  <tr>
                    <td align="center" style="border-radius: 4px;" bgcolor="#FF7A00">
                      <a
                        href="${downloadUrl}"
                        style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; font-weight: bold;"
                      >
                        Baixar eBook
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Ficou com alguma dúvida? Basta responder este e-mail.
                </p>
              </td>
            </tr>
            <!-- Rodapé -->
            <tr>
              <td align="center" style="background-color: #0d1117; padding: 15px;">
                <p style="color: #777777; font-size: 12px;">
                  &copy; 2025 - Todos os direitos reservados
                </p>
              </td>
            </tr>
          </table>
          <!-- Fim da caixa central -->
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
