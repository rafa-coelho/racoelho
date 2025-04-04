require('dotenv').config();
import { registerToForm } from '../../lib/services/convert-kit.service';

export default async function handler (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const response = await registerToForm({
      name: '',
      email,
      formId: process.env.CONVERTKIT_FORM_ID,
      tagId: process.env.CONVERTKIT_TECH_ARTICLE_TAG_ID
    });

    return res.status(200).json({ data: response.data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


