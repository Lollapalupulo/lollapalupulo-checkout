// api/create_preference.js

import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken('APP_USR-4722721204894622-060518-34718637138c713482a4658b89b48c8c-51454938');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { masculino, feminino, copo } = req.body.items || {};

  const items = [];

  if (masculino > 0) {
    items.push({
      title: 'Ingresso Masculino',
      quantity: masculino,
      unit_price: 162,
    });
  }

  if (feminino > 0) {
    items.push({
      title: 'Ingresso Feminino',
      quantity: feminino,
      unit_price: 142,
    });
  }

  if (copo > 0) {
    items.push({
      title: 'Copo Personalizado 2025',
      quantity: copo,
      unit_price: 11,
    });
  }

  const preference = {
    items,
    back_urls: {
      success: 'https://lollapalupulo.com.br/sucesso', // ajuste para sua página real
      failure: 'https://lollapalupulo.com.br/fracasso',
      pending: 'https://lollapalupulo.com.br/pendente',
    },
    auto_return: 'approved',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar preferência' });
  }
}
