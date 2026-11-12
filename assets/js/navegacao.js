/*
  Navegação do cabeçalho — Projeto Bulbe, Squad B-02

  Carregar em toda tela do app, depois do rodape.js:
    index.html:   <script src="assets/js/navegacao.js"></script>
    pages/*.html: <script src="../assets/js/navegacao.js"></script>
  Estilo em assets/css/navegacao.css.

  O cabeçalho é uma imagem única (header.svg). Aqui colocamos botões
  invisíveis em cima do desenho:
  - ☰ menu  -> abre a BARRA LATERAL com as funcionalidades do app Bulbe;
  - 🔔 sino -> liga/desliga as notificações (estado salvo no navegador).

  Também expõe window.BulbeAviso(mensagem): um aviso rápido (toast)
  que qualquer tela pode usar.

  Funcionalidades da barra lateral: telas do protótipo + o que o app real
  da Bulbe oferece (App Store: 2ª via, histórico de pagamentos, status da
  instalação, promoções, notificações; site: Indique e Ganhe R$ 50,
  parceria Livelo, WhatsApp e ouvidoria). O que ainda não tem tela no
  protótipo aparece com o selo "Em breve".
*/

(function () {
  const app = document.querySelector('.app');
  const cabecalho = document.querySelector('header.cabecalho');
  if (!app || !cabecalho) return;

  const naPastaPages = location.pathname.includes('/pages/');
  const raiz = naPastaPages ? '../' : '';
  const CHAVE_NOTIF = 'bulbe.notificacoes';

  /* ───────────── Aviso rápido (toast) ───────────── */

  const aviso = document.createElement('div');
  aviso.className = 'aviso-app';
  aviso.setAttribute('role', 'status');
  aviso.setAttribute('aria-live', 'polite');
  app.appendChild(aviso);
  let timerAviso;

  function mostrarAviso(mensagem) {
    aviso.textContent = mensagem;
    aviso.classList.add('visivel');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => aviso.classList.remove('visivel'), 2800);
  }

  window.BulbeAviso = mostrarAviso;

  /* ───────────── Notificações (sino) ───────────── */

  function notificacoesLigadas() {
    try {
      return localStorage.getItem(CHAVE_NOTIF) !== 'off';
    } catch (erro) {
      return true;
    }
  }

  function definirNotificacoes(ligar, avisar = true) {
    try {
      localStorage.setItem(CHAVE_NOTIF, ligar ? 'on' : 'off');
    } catch (erro) { /* sem armazenamento: vale só nesta página */ }

    botaoSino.setAttribute('aria-pressed', String(ligar));
    botaoSino.setAttribute('aria-label', ligar ? 'Notificações ligadas. Desligar' : 'Notificações desligadas. Ligar');
    const chave = document.querySelector('#chave-notificacoes');
    if (chave) chave.checked = ligar;

    if (avisar) {
      mostrarAviso(ligar
        ? 'Notificações ligadas: avisaremos sobre vencimentos e novidades.'
        : 'Notificações desligadas.');
    }
  }

  const botaoSino = document.createElement('button');
  botaoSino.type = 'button';
  botaoSino.className = 'sino-notificacoes';
  cabecalho.appendChild(botaoSino);
  botaoSino.addEventListener('click', () => definirNotificacoes(!notificacoesLigadas()));

  /* ───────────── Barra lateral ───────────── */

  const ICONE = {
    economia: '<path d="M4 20h16"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    fatura: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    raiox: '<path d="M7 4v16M17 4v16"/><path d="M3 8h8M13 14h8"/>',
    acompanhar: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    historico: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    instalacao: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    indique: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M19 8v6M16 11h6"/>',
    parceiros: '<path d="M20 12v9H4v-9"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 21V7"/><path d="M12 7c-2-4-6-4-6-1.5S10 7 12 7zM12 7c2-4 6-4 6-1.5S14 7 12 7z"/>',
    tutorial: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M9.5 15.5c1.4 1 3.6 1 5 0"/>',
    duvidas: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5v.01"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    ouvidoria: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    sino: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'
  };

  // Cada item: destino (tela do protótipo) OU aviso (recurso ainda sem tela)
  const SECOES = [
    {
      titulo: 'Minha conta de luz',
      itens: [
        { id: 'economia', rotulo: 'Minha economia', destino: 'index.html' },
        { id: 'fatura', rotulo: 'Minha fatura', destino: 'index.html?hu=01' },
        { id: 'raiox', rotulo: 'Raio-X da fatura', destino: 'pages/hu02.html' },
        { id: 'acompanhar', rotulo: 'Acompanhar fatura', destino: 'pages/hu03-1.html' },
        { id: 'historico', rotulo: 'Histórico e 2ª via', destino: 'pages/hu03-3.html' },
        { id: 'instalacao', rotulo: 'Status da instalação', emBreve: true,
          aviso: 'Em breve: acompanhe aqui cada etapa da sua conexão com a Bulbe.' }
      ]
    },
    {
      titulo: 'Benefícios',
      itens: [
        { id: 'indique', rotulo: 'Indique e ganhe', etiqueta: 'R$ 50', emBreve: true,
          aviso: 'Em breve: indique amigos e ganhe R$ 50 de desconto por indicação aprovada.' },
        { id: 'parceiros', rotulo: 'Promoções', emBreve: true,
          aviso: 'Em breve: promoções exclusivas e pontos Livelo para clientes Bulbe.' }
      ]
    },
    {
      titulo: 'Ajuda',
      itens: [
        { id: 'tutorial', rotulo: 'Tutorial com o Continha', destino: 'index.html?tutorial=1' },
        { id: 'duvidas', rotulo: 'Dúvidas frequentes', destino: 'index.html?hu=01&tela=duvidas' },
        { id: 'whatsapp', rotulo: 'Falar no WhatsApp', aviso: 'Abrindo o WhatsApp da Bulbe… (protótipo)' },
        { id: 'ouvidoria', rotulo: 'Ouvidoria', aviso: 'Ouvidoria Bulbe: atendimento para reclamações e sugestões. (protótipo)' }
      ]
    }
  ];

  // Qual item corresponde à tela aberta (para destacar)
  function itemAtual() {
    const caminho = location.pathname;
    const params = new URLSearchParams(location.search);
    if (caminho.includes('hu02')) return 'raiox';
    if (caminho.includes('hu03-3') || caminho.includes('hu03-4')) return 'historico';
    if (caminho.includes('hu03')) return 'acompanhar';
    if (params.get('hu') === '01') return params.get('tela') === 'duvidas' ? 'duvidas' : 'fatura';
    return 'economia';
  }

  function svg(nome) {
    return `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONE[nome]}</svg>`;
  }

  const usuario = window.BulbeSessao?.usuario?.() ?? null;
  const iniciais = (usuario?.nome ?? 'Cliente Bulbe').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('');
  const atual = itemAtual();

  const fundo = document.createElement('div');
  fundo.className = 'lateral-fundo';
  fundo.hidden = true;

  const lateral = document.createElement('aside');
  lateral.className = 'lateral';
  lateral.id = 'barra-lateral';
  lateral.hidden = true;
  lateral.setAttribute('role', 'dialog');
  lateral.setAttribute('aria-modal', 'true');
  lateral.setAttribute('aria-label', 'Menu do aplicativo');

  // Conteúdo montado só com constantes deste arquivo; nome/e-mail entram via textContent
  lateral.innerHTML = `
    <div class="lateral-topo">
      <span class="lateral-avatar" aria-hidden="true"></span>
      <div class="lateral-usuario">
        <strong class="lateral-nome"></strong>
        <span class="lateral-email"></span>
      </div>
      <button type="button" class="lateral-fechar" aria-label="Fechar menu">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav class="lateral-corpo" aria-label="Funcionalidades">
      ${SECOES.map((secao) => `
        <p class="lateral-secao">${secao.titulo}</p>
        <ul>
          ${secao.itens.map((item) => {
            const conteudo = `${svg(item.id)}<span class="lateral-rotulo">${item.rotulo}</span>
              ${item.etiqueta ? `<span class="lateral-etiqueta">${item.etiqueta}</span>` : ''}
              ${item.emBreve && !item.etiqueta ? '<span class="lateral-embreve">Em breve</span>' : ''}`;
            return item.destino
              ? `<li><a class="lateral-item${item.id === atual ? ' atual' : ''}" href="${raiz}${item.destino}"${item.id === atual ? ' aria-current="page"' : ''}>${conteudo}</a></li>`
              : `<li><button type="button" class="lateral-item" data-aviso="${item.id}">${conteudo}</button></li>`;
          }).join('')}
        </ul>`).join('')}

      <p class="lateral-secao">Configurações</p>
      <ul>
        <li>
          <label class="lateral-item lateral-chave">
            ${svg('sino')}<span class="lateral-rotulo">Notificações</span>
            <input type="checkbox" id="chave-notificacoes" class="chave">
          </label>
        </li>
        <li>
          <button type="button" class="lateral-item lateral-sair">${svg('sair')}<span class="lateral-rotulo">Sair da conta</span></button>
        </li>
      </ul>
    </nav>
    <p class="lateral-rodape">Bulbe App · protótipo acadêmico</p>`;

  lateral.querySelector('.lateral-avatar').textContent = iniciais.toUpperCase();
  lateral.querySelector('.lateral-nome').textContent = usuario?.nome ?? 'Cliente Bulbe';
  lateral.querySelector('.lateral-email').textContent = usuario?.email ?? '';

  app.append(fundo, lateral);

  const botaoMenu = document.createElement('button');
  botaoMenu.type = 'button';
  botaoMenu.className = 'menu-lateral';
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-controls', 'barra-lateral');
  cabecalho.appendChild(botaoMenu);

  function abrir() {
    fundo.hidden = false;
    lateral.hidden = false;
    // um quadro depois, para a transição de entrada acontecer
    requestAnimationFrame(() => app.classList.add('lateral-aberta'));
    botaoMenu.setAttribute('aria-expanded', 'true');
    lateral.querySelector('.lateral-fechar').focus();
  }

  function fechar() {
    app.classList.remove('lateral-aberta');
    botaoMenu.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      fundo.hidden = true;
      lateral.hidden = true;
    }, 250);
    botaoMenu.focus();
  }

  botaoMenu.addEventListener('click', abrir);
  fundo.addEventListener('click', fechar);
  lateral.querySelector('.lateral-fechar').addEventListener('click', fechar);

  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape' || lateral.hidden) return;
    fechar();
  });

  // Mantém o Tab dentro da barra enquanto ela está aberta
  lateral.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab') return;
    const focaveis = [...lateral.querySelectorAll('a, button, input')];
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  // Itens sem tela: mostram o aviso
  const AVISOS = Object.fromEntries(SECOES.flatMap((s) => s.itens).filter((i) => i.aviso).map((i) => [i.id, i.aviso]));
  lateral.querySelectorAll('[data-aviso]').forEach((botao) => {
    botao.addEventListener('click', () => mostrarAviso(AVISOS[botao.dataset.aviso]));
  });

  lateral.querySelector('#chave-notificacoes').addEventListener('change', (evento) => {
    definirNotificacoes(evento.target.checked);
  });

  lateral.querySelector('.lateral-sair').addEventListener('click', () => window.BulbeSessao?.sair());

  // Estado inicial do sino e da chave, sem aviso
  definirNotificacoes(notificacoesLigadas(), false);
})();
