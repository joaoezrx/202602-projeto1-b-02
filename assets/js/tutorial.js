/*
  Tutorial do Continha — Projeto Bulbe, Squad B-02

  O Continha (assets/img/continha-bulbe.svg) é o guia de quem acabou de
  criar a conta: aparece no primeiro acesso, mostra o básico em 5 passos
  curtos e sai do caminho. Estilo em assets/css/tutorial.css.

  Quando aparece:
  - automático: conta com primeiroAcesso (data/usuarios.json) que ainda
    não viu o tutorial neste navegador;
  - sob demanda: index.html?tutorial=1 (item "Tutorial com o Continha"
    na barra lateral) ou window.BulbeTutorial.iniciar().

  Carregado só no index.html (tela inicial), onde ficam as abas que ele mostra.
*/

(function () {
  const app = document.querySelector('.app');
  const sessao = window.BulbeSessao?.usuario?.();
  if (!app || !sessao) return;

  const naPastaPages = location.pathname.includes('/pages/');
  const raiz = naPastaPages ? '../' : '';
  const CHAVE_VISTO = `bulbe.tutorialVisto.${sessao.usuarioId}`;

  // Reações do Continha (assets/img/continha/continha-<pose>.svg), feitas pelo squad
  const POSES = ['feliz', 'pensando', 'piscando', 'surpresa', 'comemorando', 'apaixonada', 'triste'];
  const imagemPose = (pose) => `${raiz}assets/img/continha/continha-${pose}.svg`;

  // alvo: seletor do que fica iluminado (null = passo no centro da tela)
  // pose: reação do Continha que combina com a fala
  const PASSOS = [
    {
      pose: 'feliz',
      titulo: 'Oi! Eu sou o Continha 👋',
      texto: 'Vou te mostrar o app da Bulbe em 1 minutinho. Prometo ser rápido!',
      alvo: null
    },
    {
      pose: 'pensando',
      titulo: 'O que a Bulbe faz?',
      texto: 'A Bulbe gera energia solar nas fazendas dela e manda pra rede da Cemig. Você paga menos na conta de luz, sem instalar nada.',
      alvo: null
    },
    {
      pose: 'piscando',
      titulo: 'Acompanhe sua fatura',
      texto: 'Sua primeira fatura está sendo preparada. Aqui você vê cada etapa até ela chegar.',
      alvo: 'nav.rodape a[href$="hu03-1.html"]'
    },
    {
      pose: 'surpresa',
      titulo: 'Duas contas? Calma!',
      texto: 'Chegam duas: a da Cemig e a da Bulbe. O Raio-X mostra as duas lado a lado, pra você não se perder.',
      alvo: 'nav.rodape a[href$="hu02.html"]'
    },
    {
      pose: 'comemorando',
      titulo: 'Sua economia mora aqui',
      texto: 'Depois que você pagar a primeira fatura, aqui aparece quanto economizou. E o menu ☰ tem todo o resto. Bora?',
      alvo: 'nav.rodape a[href$="index.html"]',
      final: true
    }
  ];

  // Despedidas rápidas (fecham sozinhas, não deixam o tutorial mais longo)
  const DESPEDIDAS = {
    concluiu: { pose: 'apaixonada', titulo: 'Valeu! 💙', texto: 'Qualquer dúvida, é só me chamar no menu ☰.' },
    pulou: { pose: 'triste', titulo: 'Tudo bem!', texto: 'Se mudar de ideia, tô no menu ☰ te esperando.' }
  };
  const DURACAO_DESPEDIDA = 1600;

  // Carrega as reações antes, para a troca de pose não "piscar"
  POSES.forEach((pose) => { new Image().src = imagemPose(pose); });

  let indice = 0;
  let camada = null;
  let despedindo = false;
  let timerDespedida;

  function jaViu() {
    try { return localStorage.getItem(CHAVE_VISTO) === 'sim'; } catch (e) { return false; }
  }

  function marcarVisto() {
    try { localStorage.setItem(CHAVE_VISTO, 'sim'); } catch (e) { /* sem armazenamento */ }
  }

  function montar() {
    camada = document.createElement('div');
    camada.className = 'tutorial';
    camada.setAttribute('role', 'dialog');
    camada.setAttribute('aria-modal', 'true');
    camada.setAttribute('aria-labelledby', 'tutorial-titulo');
    camada.setAttribute('aria-describedby', 'tutorial-texto');
    camada.tabIndex = -1; // recebe o foco durante a despedida (para o Esc)

    // Estrutura fixa (só constantes); os textos entram por textContent
    camada.innerHTML = `
      <div class="tutorial-escuro"></div>
      <div class="tutorial-foco" aria-hidden="true"></div>
      <div class="tutorial-caixa">
        <img class="tutorial-continha" src="${imagemPose('feliz')}" alt="">
        <div class="tutorial-balao">
          <p class="tutorial-titulo" id="tutorial-titulo"></p>
          <p class="tutorial-texto" id="tutorial-texto"></p>
          <div class="tutorial-rodape">
            <div class="tutorial-pontos" aria-hidden="true">${PASSOS.map(() => '<span></span>').join('')}</div>
            <span class="sr-only tutorial-progresso"></span>
            <button type="button" class="tutorial-pular">Pular</button>
            <button type="button" class="tutorial-proximo">Próximo</button>
          </div>
        </div>
      </div>`;

    app.appendChild(camada);

    camada.querySelector('.tutorial-proximo').addEventListener('click', avancar);
    camada.querySelector('.tutorial-pular').addEventListener('click', () => despedir('pulou'));
    camada.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') encerrar();
      if (evento.key === 'Tab') {
        // foco preso entre os dois botões
        const [pular, proximo] = camada.querySelectorAll('button');
        if (evento.shiftKey && document.activeElement === pular) { evento.preventDefault(); proximo.focus(); }
        else if (!evento.shiftKey && document.activeElement === proximo) { evento.preventDefault(); pular.focus(); }
      }
    });
    addEventListener('resize', posicionar);
  }

  // Ilumina o alvo: um recorte com sombra enorme em volta escurece o resto
  function posicionar() {
    if (!camada) return;
    const passo = PASSOS[indice];
    const foco = camada.querySelector('.tutorial-foco');
    // na despedida o Continha volta para o centro, sem nada iluminado
    const alvo = !despedindo && passo.alvo && document.querySelector(passo.alvo);

    camada.classList.toggle('com-alvo', Boolean(alvo));

    if (!alvo) {
      foco.style.cssText = '';
      return;
    }

    const a = app.getBoundingClientRect();
    const r = alvo.getBoundingClientRect();
    const folga = 4;
    const margem = 6; // o contorno (2px + 2px de afastamento) precisa caber dentro do frame
    const esquerda = Math.max(margem, r.left - a.left - folga);
    const topo = Math.max(margem, r.top - a.top - folga);
    const direita = Math.min(a.width - margem, r.right - a.left + folga);
    const base = Math.min(a.height - margem, r.bottom - a.top + folga);
    foco.style.left = `${esquerda}px`;
    foco.style.top = `${topo}px`;
    foco.style.width = `${direita - esquerda}px`;
    foco.style.height = `${base - topo}px`;
  }

  function mostrar() {
    const passo = PASSOS[indice];
    camada.querySelector('.tutorial-titulo').textContent = passo.titulo;
    camada.querySelector('.tutorial-texto').textContent = passo.texto;
    camada.querySelector('.tutorial-proximo').textContent = passo.final ? 'Começar!' : 'Próximo';
    camada.querySelector('.tutorial-pular').hidden = Boolean(passo.final);
    camada.querySelector('.tutorial-progresso').textContent = `Passo ${indice + 1} de ${PASSOS.length}`;
    camada.querySelectorAll('.tutorial-pontos span').forEach((ponto, i) => {
      ponto.classList.toggle('ativo', i === indice);
    });

    trocarPose(passo.pose);
    posicionar();
    camada.querySelector('.tutorial-proximo').focus();
  }

  // Troca a reação do Continha e reinicia o "pulinho"
  function trocarPose(pose) {
    const continha = camada.querySelector('.tutorial-continha');
    continha.src = imagemPose(pose);
    continha.classList.remove('pula');
    void continha.offsetWidth;
    continha.classList.add('pula');
  }

  // Reação final rápida (apaixonada ao concluir, triste ao pular) e fecha sozinho
  function despedir(tipo) {
    if (!camada || despedindo) return;
    despedindo = true;
    const fala = DESPEDIDAS[tipo];
    camada.classList.add('despedindo');
    camada.querySelector('.tutorial-titulo').textContent = fala.titulo;
    camada.querySelector('.tutorial-texto').textContent = fala.texto;
    trocarPose(fala.pose);
    posicionar();
    // o foco sai dos botões escondidos, mas o Esc continua funcionando
    camada.focus();
    timerDespedida = setTimeout(encerrar, DURACAO_DESPEDIDA);
  }

  function avancar() {
    if (PASSOS[indice].final) {
      despedir('concluiu');
      return;
    }
    indice += 1;
    mostrar();
  }

  function encerrar() {
    if (!camada || camada.classList.contains('saindo')) return;
    clearTimeout(timerDespedida);
    marcarVisto();
    camada.classList.add('saindo');
    removeEventListener('resize', posicionar);
    setTimeout(() => {
      camada?.remove();
      camada = null;
      despedindo = false;
    }, 200);
    // tira o ?tutorial=1 da URL, para não repetir ao recarregar
    if (new URLSearchParams(location.search).has('tutorial')) {
      history.replaceState(null, '', location.pathname);
    }
  }

  function iniciar() {
    if (camada) return;
    indice = 0;
    montar();
    // espera o rodapé e o conteúdo da home aparecerem antes de medir
    requestAnimationFrame(() => requestAnimationFrame(mostrar));
  }

  window.BulbeTutorial = { iniciar };

  const pedido = new URLSearchParams(location.search).get('tutorial') === '1';
  const telaInicial = !new URLSearchParams(location.search).has('hu');

  if (pedido || (telaInicial && sessao.primeiroAcesso && !jaViu())) {
    // um respiro para a tela carregar e o usuário ver onde está
    setTimeout(iniciar, 500);
  }
})();
