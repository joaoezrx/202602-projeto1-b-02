/*
  Sessão de login — Projeto Bulbe, Squad B-02

  Carregar no <head> de TODA tela do app (antes do conteúdo aparecer):
    index.html:      <script src="assets/js/sessao.js"></script>
    pages/*.html:    <script src="../assets/js/sessao.js"></script>

  - Sem sessão, manda para pages/login.html?voltar=<tela atual>.
  - Expõe window.BulbeSessao (usuario, salvar, sair) para as outras telas.
  - Monta o menu da conta no avatar do cabeçalho (nome, e-mail e Sair).

  ATENÇÃO: é um protótipo. O "login" acontece todo no navegador, com
  dados fictícios em data/usuarios.json; não é autenticação de verdade.
*/

(function () {
  const CHAVE = 'bulbe.sessao';

  const naPastaPages = location.pathname.includes('/pages/');
  const raiz = naPastaPages ? '../' : '';
  const ehLogin = location.pathname.endsWith('/login.html');

  // localStorage = "Manter conectado"; sessionStorage = só até fechar o navegador
  function ler() {
    try {
      const texto = sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE);
      return texto ? JSON.parse(texto) : null;
    } catch (erro) {
      return null;
    }
  }

  function salvar(sessao, manterConectado) {
    const texto = JSON.stringify(sessao);
    try {
      sessionStorage.removeItem(CHAVE);
      localStorage.removeItem(CHAVE);
      (manterConectado ? localStorage : sessionStorage).setItem(CHAVE, texto);
    } catch (erro) {
      console.error('Não foi possível salvar a sessão:', erro);
    }
  }

  // Apaga a sessão sem sair da página (usado no "Entrar com outra conta")
  function limpar() {
    try {
      sessionStorage.removeItem(CHAVE);
      localStorage.removeItem(CHAVE);
    } catch (erro) { /* navegador sem armazenamento: nada a apagar */ }
  }

  function sair() {
    limpar();
    location.replace(`${raiz}pages/login.html`);
  }

  // Caminho da tela atual relativo à raiz do projeto (index.html ou pages/x.html)
  function telaAtual() {
    const arquivo = location.pathname.split('/').pop() || 'index.html';
    return (naPastaPages ? `pages/${arquivo}` : arquivo) + location.search;
  }

  window.BulbeSessao = { usuario: ler, salvar, sair, limpar, raiz };

  // Recomeçar do zero (útil em apresentações): pages/login.html?reiniciar=1
  // apaga tudo que o app guardou neste navegador (sessão, tutorial visto,
  // sino, canais) e mostra o login limpo, com a animação.
  if (ehLogin && new URLSearchParams(location.search).get('reiniciar') === '1') {
    try {
      [localStorage, sessionStorage].forEach((armazenamento) => {
        Object.keys(armazenamento)
          .filter((chave) => chave.startsWith('bulbe.'))
          .forEach((chave) => armazenamento.removeItem(chave));
      });
    } catch (erro) { /* sem armazenamento: já está limpo */ }
    history.replaceState(null, '', location.pathname);
  }

  // Guarda: sem sessão, nenhuma tela do app abre (exceto o próprio login)
  if (!ehLogin && !ler()) {
    location.replace(`${raiz}pages/login.html?voltar=${encodeURIComponent(telaAtual())}`);
    return;
  }

  if (ehLogin) return;

  // ── Menu da conta no avatar do cabeçalho ──
  // O cabeçalho é uma imagem única (header.svg); como na logo, um botão
  // invisível fica por cima do avatar.
  function montarMenuConta() {
    const cabecalho = document.querySelector('header.cabecalho');
    const app = document.querySelector('.app');
    const usuario = ler();
    if (!cabecalho || !app || !usuario) return;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'avatar-conta';
    botao.setAttribute('aria-label', 'Minha conta');
    botao.setAttribute('aria-haspopup', 'true');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-controls', 'menu-conta');
    cabecalho.appendChild(botao);

    const menu = document.createElement('div');
    menu.className = 'menu-conta';
    menu.id = 'menu-conta';
    menu.hidden = true;

    const nome = document.createElement('strong');
    nome.textContent = usuario.nome;
    const email = document.createElement('span');
    email.textContent = usuario.email;
    const botaoSair = document.createElement('button');
    botaoSair.type = 'button';
    botaoSair.className = 'menu-conta-sair';
    botaoSair.textContent = 'Sair da conta';
    botaoSair.addEventListener('click', sair);

    menu.append(nome, email, botaoSair);
    app.appendChild(menu);

    function alternar(abrir) {
      menu.hidden = !abrir;
      botao.setAttribute('aria-expanded', String(abrir));
    }

    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();
      alternar(menu.hidden);
    });

    // Fecha ao clicar fora ou apertar Esc
    document.addEventListener('click', (evento) => {
      if (!menu.hidden && !menu.contains(evento.target)) alternar(false);
    });
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && !menu.hidden) {
        alternar(false);
        botao.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarMenuConta);
  } else {
    montarMenuConta();
  }
})();
