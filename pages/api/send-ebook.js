import { registerToForm } from '../../lib/services/convert-kit.service';
import { convertKitConfig, SITE_URL } from '../../lib/config/constants';
import { registerEbookToken } from '../../lib/services/data.service';
import { getEbookEmailTemplate } from '../../lib/utils/mail-builder';
import { getEbookBySlug } from '../../lib/local-api';
import { sendMail } from '../../lib/services/mailer.service';

export default async function handler (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { name, email, slug } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    try {
        await registerToForm({
            name,
            email,
            formId: convertKitConfig.ebook.formId,
            tagId: convertKitConfig.ebook.tagId
        });

        const token = await registerEbookToken({
            name,
            email,
            slug
        });

        const ebookData = getEbookBySlug(slug);

        await sendMail({
            name,
            email,
            subject: 'Seu eBook está aqui!',
            message: getEbookEmailTemplate({
                downloadUrl: `${SITE_URL}/ebooks/${slug}/download?token=${token}`,
                name,
                tituloEbook: ebookData.title,
            })
        });

        return res.status(200).json({ success: true, message: '' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Erro interno ao processar seu pedido.' });
    }
}
