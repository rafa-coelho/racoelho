require('dotenv').config();
import axios from 'axios';
import { convertKitConfig } from '../config/constants';

axios.defaults.baseURL = "https://api.convertkit.com/v3";

/**
 * Registra um usuário em uma form do ConvertKit, opcionalmente associando uma tag.
 *
 * @param {object} params - Objeto de parâmetros para inscrição no ConvertKit.
 * @param {string} [params.name] - Nome do usuário (opcional).
 * @param {string} params.email - Endereço de e-mail do usuário.
 * @param {string} params.formId - ID da form no ConvertKit.
 * @param {string} [params.tagId] - ID da tag do ConvertKit (opcional).
 * @returns {Promise<import('axios').AxiosResponse>} Promessa que resolve para a resposta do Axios.
 *
 * @example
 * const response = await registerToForm({
 *   name: 'Alice',
 *   email: 'alice@example.com',
 *   formId: '12345',
 *   tagId: '67890'
 * });
 * console.log(response.data);
 */
export async function registerToForm ({ name, email, formId, tagId }) {
    const data = JSON.stringify({
        "api_key": convertKitConfig.apiKey,
        "first_name": name || '',
        tags: [tagId],
        email
    });

    const config = {
        maxBodyLength: Infinity,
        url: `/forms/${formId}/subscribe`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    return axios.post(`/forms/${formId}/subscribe`, data, config);
}
