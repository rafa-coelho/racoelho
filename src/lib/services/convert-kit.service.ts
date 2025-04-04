import axios from 'axios';
import { convertKitConfig } from '../config/constants';

// Configuração base do axios
axios.defaults.baseURL = "https://api.convertkit.com/v3";

/**
 * Interface para os parâmetros de registro no ConvertKit
 */
interface RegisterToFormParams {
  name?: string;
  email: string;
  formId: string;
  tagId?: string;
}

/**
 * Registra um usuário em uma form do ConvertKit, opcionalmente associando uma tag.
 *
 * @param params - Objeto de parâmetros para inscrição no ConvertKit.
 * @returns Promessa que resolve para a resposta do Axios.
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
export async function registerToForm({ name, email, formId, tagId }: RegisterToFormParams) {
  const data = JSON.stringify({
    "api_key": convertKitConfig.apiKey,
    "first_name": name || '',
    tags: tagId ? [tagId] : [],
    email
  });

  const config = {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  return axios.post(`/forms/${formId}/subscribe`, data, config);
} 