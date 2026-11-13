/*
  Rodapé de navegação — Projeto Bulbe, Squad B-02

  Monta o mesmo rodapé em todas as telas. Para usar numa página:
    <nav class="rodape" aria-label="Navegação principal"></nav>
    <script src="(caminho)/assets/js/rodape.js"></script>

  Funciona tanto no index.html quanto nas páginas dentro de pages/.

  Também torna a logo do cabeçalho clicável: o cabeçalho é uma imagem
  única (header.svg), então colocamos um link invisível em cima da logo
  que leva para a tela inicial do app (index.html).
*/

(function () {
  const ICONES = {
    economia: '<path d="M4 20h16"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    fatura: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    'raio-x': '<path d="M7 4v16M17 4v16"/><path d="M3 8h8M13 14h8"/>',
    acompanhar: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };

  // Uma aba por funcionalidade. "destino" é relativo à raiz do projeto.
  const ABAS = [
    { id: 'economia', rotulo: 'Economia', destino: 'index.html' },               // HU04 (início)
    { id: 'fatura', rotulo: 'Fatura', destino: 'index.html?hu=01' },             // HU01
    { id: 'raio-x', rotulo: 'Raio-X', destino: 'pages/hu02.html' },              // HU02
    { id: 'acompanhar', rotulo: 'Acompanhar', destino: 'pages/hu03-1.html' }     // HU03
  ];

  const caminho = location.pathname;
  const dentroDePages = caminho.includes('/pages/');
  const raiz = dentroDePages ? '../' : '';

  // Descobre qual aba corresponde à tela aberta.
  function abaAtual() {
    if (caminho.includes('indique') || caminho.includes('perfil')) return null; // aberta pelo menu lateral: nenhuma aba do rodapé
    if (caminho.includes('historico')) return 'fatura'; // histórico de faturas fica sob a aba Fatura
    if (caminho.includes('hu02')) return 'raio-x';
    if (caminho.includes('hu03')) return 'acompanhar';
    if (new URLSearchParams(location.search).get('hu') === '01') return 'fatura';
    return 'economia';
  }

  function montar(rodape) {
    const ativa = abaAtual();

    rodape.innerHTML = ABAS.map((aba) => `
      <a href="${raiz}${aba.destino}"${aba.id === ativa ? ' class="ativo" aria-current="page"' : ''}>
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[aba.id]}</svg>
        <span>${aba.rotulo}</span>
      </a>`).join('');
  }

  // Logo da Bulbe no cabeçalho -> tela inicial (a mesma que abre quando o usuário entra no app)
  function linkarLogo(cabecalho) {
    if (cabecalho.querySelector('.logo-inicio')) return;

    const link = document.createElement('a');
    link.className = 'logo-inicio';
    link.href = `${raiz}index.html`;
    link.setAttribute('aria-label', 'Bulbe: voltar para a tela inicial');
    cabecalho.appendChild(link);
  }

  document.querySelectorAll('nav.rodape').forEach(montar);
  document.querySelectorAll('header.cabecalho').forEach(linkarLogo);
})();
