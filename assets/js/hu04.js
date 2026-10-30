// HU04 — Abre as telas de economia na área central do template.

const telasHU04 = {
  inicio: { html: 'pages/economia-inicio.html', script: './home-economia.js' },
  economia: { html: 'pages/economia.html', script: './pagina-economia.js' },
  calculo: { html: 'pages/economia-calculo.html', script: './pagina-calculo.js' }
};

// Espera o CSS carregar para a tela não aparecer sem estilo.
function carregarEstilo() {
  return new Promise((resolve, reject) => {
    const estilo = document.createElement('link');
    estilo.rel = 'stylesheet';
    estilo.href = 'assets/css/economia.css';
    estilo.onload = resolve;
    estilo.onerror = reject;
    document.head.appendChild(estilo);
  });
}

export async function abrirTelaHU04(tela) {
  const configuracao = telasHU04[tela];
  const conteudo = document.querySelector('main.conteudo');

  try {
    if (!configuracao) throw new Error(`Tela da HU04 não encontrada: ${tela}`);

    const [resposta] = await Promise.all([fetch(configuracao.html), carregarEstilo()]);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    conteudo.innerHTML = await resposta.text();

    // O script da tela procura os elementos ao ser importado, então vem depois do HTML.
    await import(configuracao.script);
  } catch (erro) {
    console.error('Erro ao carregar HU04:', erro);
    conteudo.textContent = 'Não foi possível carregar esta tela.';
  }
}
