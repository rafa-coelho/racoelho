require('dotenv').config();
import axios from 'axios';

axios.defaults.baseURL = "https://api.convertkit.com/v3";

export default function handler (req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  const data = JSON.stringify({
    "api_key": process.env.CONVERTKIT_API_KEY,
    "first_name": '',
    email
  });

  let config = {
    maxBodyLength: Infinity,
    url: '/forms/6710800/subscribe',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  axios.post(`/forms/6710800/subscribe`, data, config)
    .then((response) => {
      return res.status(200).json({ data: response.data });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}
