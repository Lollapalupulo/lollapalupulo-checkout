const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxIQvOyjHD6aLQXmXt-GM_knTtP1n5bldUqGCqbbua2Iz-mL80uQ0M9FAH-qGnkW5R6og/exec';

async function finalizarCompra(metodo) {
  // ... (código anterior de validação dos campos)

  try {
    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value,
        itens: {
          masculino: parseInt(document.getElementById('ingresso-masculino').value) || 0,
          feminino: parseInt(document.getElementById('ingresso-feminino').value) || 0,
          copo: parseInt(document.getElementById('copo').value) || 0
        },
        valorTotal: metodo === 'pix' ? 
          (masculino * 157 + feminino * 137 + copo * 10.5) : 
          (masculino * 162 + feminino * 142 + copo * 11),
        metodo: metodo
      })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erro desconhecido');
    window.location.href = data.payment_link;

  } catch (error) {
    console.error('Erro no frontend:', error);
    alert(`Falha: ${error.message}. Verifique o console (F12) para detalhes.`);
  }
}
