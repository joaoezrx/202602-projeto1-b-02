// Indique e ganhe — código, compartilhar e histórico (dados fictícios em data/indicacoes.json).
// Protótipo: nenhum valor é creditado de verdade.

import { buscarIndicacoesDoCliente } from './api.js';

const clienteId = window.BulbeSessao?.usuario()?.clienteId ?? 4;
const avisar = (mensagem) => window.BulbeAviso?.(mensagem);

const moeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
// '2026-09-15' → '15/09' (sem passar por Date, para não mudar o dia pelo fuso)
const data = (iso) => iso.split('-').reverse().slice(0, 2).join('/');

// O selo mostra o estado; o significado de cada um fica no title (passos explicados no topo).
const STATUS = {
  pendente: { rotulo: 'Pendente', dica: 'Aguardando o amigo pagar a 1ª fatura' },
  concluida: { rotulo: 'Concluída', dica: 'Desconto liberado (demonstrativo)' }
};

/* ── Copiar ── */

// Clipboard API (localhost conta como contexto seguro); se falhar, usa o método antigo.
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (erro) {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    const ok = document.execCommand('copy');
    campo.remove();
    return ok;
  }
}

function mensagemConvite(codigo, valor) {
  return `Estou economizando na conta de luz com a Bulbe! Use meu código ${codigo} ao contratar `
    + `e ganhe ${moeda(valor)} de desconto. (Protótipo: valor demonstrativo)`;
}

/* ── Histórico ── */

function renderizarHistorico(registro) {
  const lista = document.querySelector('#lista-indicacoes');
  const concluidas = registro.indicacoes.filter((i) => i.status === 'concluida').length;

  document.querySelector('#total-ganho').textContent = `${moeda(concluidas * registro.valorPorIndicacao)} ganhos`;

  if (registro.indicacoes.length === 0) {
    lista.innerHTML = '<li class="vazio">Você ainda não indicou ninguém. Compartilhe seu código para começar.</li>';
    return;
  }

  lista.replaceChildren(...registro.indicacoes.map((indicacao) => {
    const status = STATUS[indicacao.status] ?? STATUS.pendente;
    const item = document.createElement('li');
    item.className = 'indicacao';
    item.innerHTML = `
      <span class="indicacao-avatar" aria-hidden="true"></span>
      <div class="indicacao-texto">
        <strong class="indicacao-nome"></strong>
        <span class="indicacao-detalhe"></span>
      </div>
      <span class="selo-status ${indicacao.status}" title="${status.dica}">${status.rotulo}</span>`;
    // Nome vem do JSON: entra por textContent
    item.querySelector('.indicacao-avatar').textContent = indicacao.nome.charAt(0);
    item.querySelector('.indicacao-nome').textContent = indicacao.nome;
    item.querySelector('.indicacao-detalhe').textContent = `Indicado em ${data(indicacao.data)}`;
    return item;
  }));
}

/* ── Voltar: volta para a tela anterior do app; sem histórico, vai para o início ── */

document.querySelector('.indique-voltar').addEventListener('click', (evento) => {
  const veioDoApp = document.referrer && new URL(document.referrer).origin === location.origin;
  if (veioDoApp && history.length > 1) {
    evento.preventDefault();
    history.back();
  }
});

/* ── Início ── */

async function iniciar() {
  try {
    const registro = await buscarIndicacoesDoCliente(clienteId);
    if (!registro) throw new Error(`Sem dados de indicação para o cliente ${clienteId}`);

    const { codigo, valorPorIndicacao: valor } = registro;
    document.querySelector('#codigo-indicacao').textContent = codigo;
    document.querySelector('#valor-indicacao').textContent = moeda(valor);
    renderizarHistorico(registro);

    const mensagem = mensagemConvite(codigo, valor);

    document.querySelector('#copiar-codigo').addEventListener('click', async (evento) => {
      const botao = evento.currentTarget;
      const ok = await copiarTexto(codigo);
      avisar(ok ? 'Código copiado!' : 'Não foi possível copiar. Selecione o código e copie.');
      if (!ok) return;
      botao.classList.add('copiado');
      botao.querySelector('span').textContent = 'Copiado';
      setTimeout(() => {
        botao.classList.remove('copiado');
        botao.querySelector('span').textContent = 'Copiar';
      }, 2000);
    });

    document.querySelector('#copiar-mensagem').addEventListener('click', async () => {
      const ok = await copiarTexto(mensagem);
      avisar(ok ? 'Mensagem copiada! É só colar no WhatsApp ou onde preferir.' : 'Não foi possível copiar a mensagem.');
    });

    // Web Share API quando existe (celular); senão, copia a mensagem.
    document.querySelector('#compartilhar').addEventListener('click', async () => {
      const dados = { title: 'Indique e ganhe · Bulbe', text: mensagem };
      if (navigator.share && (!navigator.canShare || navigator.canShare(dados))) {
        try {
          await navigator.share(dados);
        } catch (erro) {
          // AbortError = a pessoa fechou a folha de compartilhar: não é erro
          if (erro.name !== 'AbortError') {
            const ok = await copiarTexto(mensagem);
            avisar(ok ? 'Não deu para abrir o compartilhamento. Copiamos a mensagem para você.' : 'Não foi possível compartilhar.');
          }
        }
        return;
      }
      const ok = await copiarTexto(mensagem);
      avisar(ok ? 'Compartilhar não está disponível aqui. Copiamos a mensagem para você.' : 'Não foi possível copiar a mensagem.');
    });
  } catch (erro) {
    console.error(erro);
    document.querySelector('.indique-pilha').innerHTML =
      '<p class="indique-erro">Não foi possível carregar suas indicações. O projeto está aberto por um servidor?</p>';
  }
}

iniciar();
