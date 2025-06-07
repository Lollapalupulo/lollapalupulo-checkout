// Preços
const precos = {
  pix: {
    masculino: 157,
    feminino: 137,
    copo: 10.5
  },
  cartao: {
    masculino: 162,
    feminino: 142,
    copo: 11
  }
};

// Atualizar totais quando alterar quantidades
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('change', atualizarTotais);
});

function atualizarTotais() {
  const masculino = parseInt(document.getElementById('ingresso-masculino').value) || 0;
  const feminino = parseInt(document.getElementById('ingresso-feminino').value) || 0;
  const copo = parseInt(document.getElementById('copo').value) || 0;

  const totalPix = (masculino * precos.pix.masculino) + (feminino * precos.pix.feminino) + (copo * precos.pix.copo);
  const totalCartao = (masculino * precos.cartao.masculino) + (feminino * precos.cartao.feminino) + (copo * precos.cartao.copo);

  document.getElementById('total-pix').textContent = `R$ ${totalPix.toFixed(2)}`;
  document.getElementById('total-cartao').textContent = `R$ ${totalCartao.toFixed(2)}`;
}

async function finalizarCompra(metodo) {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const itens = {
    masculino: parseInt(document.getElementById('ingresso-masculino').value) || 0,
    feminino: parseInt(document.getElementById('ingresso-feminino').value) || 0,
    copo: parseInt(document.getElementById('copo').value) || 0
  };

  if (!nome || !email || !whatsapp) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const valorTotal = metodo === 'pix' ? 
    (itens.masculino * precos.pix.masculino) + (itens.feminino * precos.pix.feminino) + (itens.copo * precos.pix.copo) :
    (itens.masculino * precos.cartao.masculino) + (itens.feminino * precos.cartao.feminino) + (itens.copo * precos.cartao.copo);

  try {
    const response = await fetch('SUA_URL_DO_WEBAPP_AQUI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, whatsapp, itens, valorTotal, metodo })
    });

    const data = await response.json();
    if (data.payment_link) {
      window.location.href = data.payment_link; // Redireciona para o Mercado Pago
    }
  } catch (error) {
    alert("Erro ao processar pagamento. Tente novamente!");
    console.error(error);
  }
}
