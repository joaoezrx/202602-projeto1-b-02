// Home — Abre a tela principal na área central do template.

// Espera o CSS carregar para a tela não aparecer sem estilo.
function carregarEstilo() {
  return new Promise((resolve, reject) => {
    const estilo = document.createElement('link');
    estilo.rel = 'stylesheet';
    estilo.href = 'assets/css/home.css';
    estilo.onload = resolve;
    estilo.onerror = reject;
    document.head.appendChild(estilo);
  });
}

export async function abrirHome() {
  const conteudo = document.querySelector('main.conteudo');

  try {
    const [resposta] = await Promise.all([fetch('pages/home.html'), carregarEstilo()]);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

    conteudo.innerHTML = await resposta.text();
  } catch (erro) {
    console.error('Erro ao carregar a home:', erro);
    conteudo.textContent = 'Não foi possível carregar esta tela.';
  }
}
