/*
  HU03 — Tela 2 (Acompanhe sua primeira fatura)
  Botão "Alterar": abre a folha para escolher por onde a fatura chega
  (e-mail, notificação no app, WhatsApp, SMS). A escolha fica salva no
  navegador (dado fictício de protótipo) e atualiza o texto do card.
*/

(function () {
  const CHAVE = 'bulbe.canaisFatura';
  const PADRAO = ['email', 'app'];
  const NOMES = { email: 'E-mail', app: 'notificação no app', whatsapp: 'WhatsApp', sms: 'SMS' };

  const app = document.querySelector('.app');
  const botao = document.getElementById('alterar-canais');
  const texto = document.getElementById('canais-texto');
  const fundo = document.getElementById('folha-fundo');
  const folha = document.getElementById('folha-canais');
  const erro = document.getElementById('folha-erro');
  const caixas = [...folha.querySelectorAll('input[name="canal"]')];

  function lerCanais() {
    try {
      const salvos = JSON.parse(localStorage.getItem(CHAVE));
      return Array.isArray(salvos) && salvos.length ? salvos : PADRAO;
    } catch (e) {
      return PADRAO;
    }
  }

  // ["email","app","whatsapp"] -> "E-mail, notificação no app e WhatsApp"
  function descrever(canais) {
    const nomes = canais.map((c) => NOMES[c]);
    const frase = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}` : nomes[0];
    return frase.charAt(0).toUpperCase() + frase.slice(1);
  }

  function mostrarTexto() {
    texto.textContent = descrever(lerCanais());
  }

  function abrir() {
    const canais = lerCanais();
    caixas.forEach((caixa) => { caixa.checked = canais.includes(caixa.value); });
    erro.hidden = true;
    fundo.hidden = false;
    folha.hidden = false;
    requestAnimationFrame(() => app.classList.add('folha-aberta'));
    botao.setAttribute('aria-expanded', 'true');
    caixas[0].focus();
  }

  function fechar() {
    app.classList.remove('folha-aberta');
    botao.setAttribute('aria-expanded', 'false');
    setTimeout(() => { fundo.hidden = true; folha.hidden = true; }, 250);
    botao.focus();
  }

  botao.addEventListener('click', abrir);
  fundo.addEventListener('click', fechar);
  document.getElementById('folha-cancelar').addEventListener('click', fechar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !folha.hidden) fechar(); });

  folha.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const escolhidos = caixas.filter((c) => c.checked).map((c) => c.value);

    if (!escolhidos.length) {
      erro.hidden = false;
      return;
    }

    try {
      localStorage.setItem(CHAVE, JSON.stringify(escolhidos));
    } catch (e) { /* sem armazenamento: vale só até recarregar */ }

    texto.textContent = descrever(escolhidos);
    fechar();
    window.BulbeAviso?.(`Pronto! Canais salvos: ${descrever(escolhidos)}.`);
  });

  caixas.forEach((c) => c.addEventListener('change', () => { erro.hidden = true; }));

  mostrarTexto();
})();
