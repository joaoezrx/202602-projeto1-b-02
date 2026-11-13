// Histórico e 2ª via — lista as faturas do cliente (data/faturas.json, via api.js).
// Protótipo: "Pagar" leva ao fluxo demonstrativo da HU03 (hu03-4) e não há PDF real.

import { buscarFaturasDoCliente } from './api.js';

const parametros = new URLSearchParams(location.search);
// Mesmo padrão da HU04: ?cliente=ID na URL, senão o cliente da conta logada.
const clienteId = Number(parametros.get('cliente')) || (window.BulbeSessao?.usuario()?.clienteId ?? 4);
const avisar = (mensagem) => window.BulbeAviso?.(mensagem);
const lista = document.querySelector('#historico-lista');

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// O Raio-X (HU02) tem dados próprios para estes meses e abre o mês por ?mes=.
const RAIO_X_POR_REFERENCIA = { '2026-08': 'ago', '2026-09': 'set', '2026-10': 'out' };

const moeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// Datas ISO tratadas como texto, para o fuso não mudar o dia
const dataBR = (iso) => iso.split('-').reverse().join('/');
const mesAno = (referencia) => {
  const [ano, mes] = referencia.split('-');
  const nome = MESES[Number(mes) - 1];
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}/${ano}`;
};

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// paga → Paga; emitida e não paga → Em aberto (ou Vencida, se já passou do vencimento);
// prevista sem valor → Em preparação (ainda não dá para pagar, como na HU03).
function situacao(fatura) {
  if (fatura.status === 'paga') return { id: 'paga', rotulo: 'Paga' };
  if (fatura.valor == null) return { id: 'preparacao', rotulo: 'Em preparação' };
  if (fatura.vencimento < hojeISO()) return { id: 'vencida', rotulo: 'Vencida' };
  return { id: 'aberta', rotulo: 'Em aberto' };
}

/* ── Copiar (Clipboard API, com o método antigo de reserva) ── */

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

/* ── Montagem (só constantes e números formatados; nada de texto livre do usuário) ── */

const ICONE_SETA = '<svg class="seta" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
const ICONE_CHECK = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function linha(rotulo, valor) {
  return `<div class="det-linha"><span>${rotulo}</span><strong>${valor}</strong></div>`;
}

function detalhes(fatura, s) {
  const partes = [];

  // Valores
  const valores = [];
  if (fatura.valor != null) valores.push(linha('Fatura Bulbe', moeda(fatura.valor)));
  valores.push(linha('Vencimento', dataBR(fatura.vencimento)));
  if (fatura.valorDistribuidora != null) {
    const venc = fatura.vencimentoDistribuidora ? ` · vence ${dataBR(fatura.vencimentoDistribuidora).slice(0, 5)}` : '';
    valores.push(linha(`Conta Cemig${venc}`, moeda(fatura.valorDistribuidora)));
  }
  if (fatura.economia != null) {
    // Só é economia "do mês" depois de paga; antes disso é a prevista.
    const rotulo = s.id === 'paga' ? 'Economia no mês' : 'Economia prevista';
    valores.push(linha(rotulo, `<span class="verde">${moeda(fatura.economia)}</span>`));
  }
  partes.push(`<div class="det-bloco">${valores.join('')}</div>`);

  // Situação + ações
  if (s.id === 'paga') {
    partes.push(`<div class="det-confirmado">${ICONE_CHECK}<span>Pagamento confirmado</span></div>`);
  } else if (s.id === 'preparacao') {
    partes.push('<p class="det-aviso">A fatura ainda está sendo preparada. O valor e as opções de pagamento aparecem aqui quando ela for emitida.</p>');
  } else {
    if (s.id === 'vencida') {
      partes.push('<p class="det-aviso vencida">Esta fatura venceu. Pague o quanto antes para evitar juros e multa.</p>');
    }
    partes.push(`
      <div class="det-acoes">
        <a class="botao" href="hu03-4.html">Pagar</a>
        ${fatura.pixCopiaECola
          ? `<button type="button" class="botao-contorno" data-pix="${fatura.id}">Copiar Pix</button>`
          : '<p class="det-aviso">Código Pix ainda não disponível para esta fatura.</p>'}
      </div>`);
  }

  // 2ª via: não existe PDF no protótipo, então isso fica explícito
  if (fatura.valor != null) {
    partes.push(`
      <div class="det-segunda-via">
        <strong>2ª via demonstrativa</strong>
        <span>Este protótipo não gera PDF. Os dados acima são a 2ª via desta fatura.</span>
      </div>`);
  }

  // Raio-X do mês, quando existir
  const mesRaioX = RAIO_X_POR_REFERENCIA[fatura.referencia];
  partes.push(mesRaioX
    ? `<a class="botao-texto" href="hu02.html?mes=${mesRaioX}">Ver Raio-X desta fatura</a>`
    : '<p class="det-nota">Raio-X não disponível para este mês no protótipo.</p>');

  return partes.join('');
}

function renderizar(faturas) {
  if (faturas.length === 0) {
    lista.innerHTML = '<li class="historico-vazio">Você ainda não tem faturas. Elas aparecem aqui assim que forem emitidas.</li>';
    return;
  }

  // Da mais recente para a mais antiga
  const ordenadas = [...faturas].sort((a, b) => b.referencia.localeCompare(a.referencia));

  lista.innerHTML = ordenadas.map((fatura) => {
    const s = situacao(fatura);
    const valor = fatura.valor != null ? moeda(fatura.valor) : 'A definir';
    return `
      <li class="fatura ${s.id}" id="fatura-${fatura.id}">
        <button type="button" class="fatura-cabeca" aria-expanded="false" aria-controls="detalhe-${fatura.id}">
          <span class="fatura-info">
            <span class="fatura-mes">${mesAno(fatura.referencia)}</span>
            <span class="fatura-venc">Vence ${dataBR(fatura.vencimento)}</span>
          </span>
          <span class="fatura-lado">
            <span class="fatura-valor">${valor}</span>
            <span class="selo ${s.id}">${s.rotulo}</span>
          </span>
          ${ICONE_SETA}
        </button>
        <div class="fatura-detalhe" id="detalhe-${fatura.id}" hidden>${detalhes(fatura, s)}</div>
      </li>`;
  }).join('');

  // Uma fatura aberta por vez
  lista.querySelectorAll('.fatura-cabeca').forEach((cabeca) => {
    cabeca.addEventListener('click', () => {
      const abrir = cabeca.getAttribute('aria-expanded') !== 'true';
      lista.querySelectorAll('.fatura-cabeca[aria-expanded="true"]').forEach((outra) => {
        outra.setAttribute('aria-expanded', 'false');
        document.getElementById(outra.getAttribute('aria-controls')).hidden = true;
      });
      cabeca.setAttribute('aria-expanded', String(abrir));
      document.getElementById(cabeca.getAttribute('aria-controls')).hidden = !abrir;
    });
  });

  const porId = Object.fromEntries(faturas.map((f) => [String(f.id), f]));
  lista.querySelectorAll('[data-pix]').forEach((botao) => {
    botao.addEventListener('click', async () => {
      const ok = await copiarTexto(porId[botao.dataset.pix].pixCopiaECola);
      avisar(ok ? 'Código Pix copiado! (demonstrativo)' : 'Não foi possível copiar o código Pix.');
    });
  });

  // ?fatura=ID abre direto aquela fatura
  const alvo = parametros.get('fatura');
  if (alvo) lista.querySelector(`#fatura-${CSS.escape(alvo)} .fatura-cabeca`)?.click();
}

/* ── Voltar: volta para a tela anterior do app; sem histórico, vai para o início ── */

document.querySelector('.historico-voltar').addEventListener('click', (evento) => {
  const veioDoApp = document.referrer && new URL(document.referrer).origin === location.origin;
  if (veioDoApp && history.length > 1) {
    evento.preventDefault();
    history.back();
  }
});

async function iniciar() {
  try {
    renderizar(await buscarFaturasDoCliente(clienteId));
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = '<li class="historico-erro">Não foi possível carregar suas faturas. O projeto está aberto por um servidor?</li>';
  }
}

iniciar();
