// Configurações
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyne_J2LRfVVDb9TA9nxpCJ9uFpMtlkHhA2F2NHd5bbREscIg9O8p0X18tZomaWCJR35A/exec';
const PRECOS = {
  pix: { masculino: 157, feminino: 137, copo: 10.5 },
  cartao: { masculino: 162, feminino: 142, copo: 11 }
};

// Inicialização - Atualiza totais ao carregar
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', atualizarTotais);
  });
  atualizarTotais(); // Calcula valores iniciais
});

// Atualiza totais quando quantidades mudam
function atualizarTotais() {
  const getValue = (id) => parseInt(document.getElementById(id).value) || 0;
  
  const masculino = getValue('ingresso-masculino');
  const feminino = getValue('ingresso-feminino');
  const copo = getValue('copo');

  document.getElementById('total-pix').textContent = `R$ ${(
    masculino * PRECOS.pix.masculino + 
    feminino * PRECOS.pix.feminino + 
    copo * PRECOS.pix.copo
  ).toFixed(2)}`;

  document.getElementById('total-cartao').textContent = `R$ ${(
    masculino * PRECOS.cartao.masculino + 
    feminino * PRECOS.cartao.feminino + 
    copo * PRECOS.cartao.copo
  ).toFixed(2)}`;
}

// Processa o pagamento
async function finalizarCompra(metodo) {
  // Coleta dados
  const getValue = (id) => document.getElementById(id).value.trim();
  const dados = {
    nome: getValue('nome'),
    email: getValue('email'),
    whatsapp: getValue('whatsapp'),
    itens: {
      masculino: parseInt(getValue('ingresso-masculino')) || 0,
      feminino: parseInt(getValue('ingresso-feminino')) || 0,
      copo: parseInt(getValue('copo')) || 0
    }
  };

  // Validação
  if (!dados.nome || !dados.email || !dados.whatsapp) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  // Calcula total
  dados.valorTotal = metodo === 'pix' 
    ? dados.itens.masculino * PRECOS.pix.masculino + 
      dados.itens.feminino * PRECOS.pix.feminino + 
      dados.itens.copo * PRECOS.pix.copo
    : dados.itens.masculino * PRECOS.cartao.masculino + 
      dados.itens.feminino * PRECOS.cartao.feminino + 
      dados.itens.copo * PRECOS.cartao.copo;

  try {
    // 1. Verifica CORS primeiro
    await checkCORS();
    
    // 2. Envia dados
    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dados, metodo })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const resultado = await response.json();
    
    if (!resultado.success) {
      throw new Error(resultado.error || 'Erro no processamento');
    }

    // Redireciona para o pagamento
    window.location.href = resultado.payment_link;

  } catch (error) {
    console.error('Erro no checkout:', error);
    alert(`Falha: ${error.message}\n\nVerifique o console (F12) para detalhes.`);
  }
}

// Verifica se CORS está habilitado
async function checkCORS() {
  try {
    const testeCors = await fetch(WEBAPP_URL, { 
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!testeCors.ok) {
      throw new Error('Servidor não responde a OPTIONS');
    }
  } catch (error) {
    console.error('Teste CORS falhou:', error);
    throw new Error('Problema de comunicação com o servidor. Tente novamente mais tarde.');
  }
}
