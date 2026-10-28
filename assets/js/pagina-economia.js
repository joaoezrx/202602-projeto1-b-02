import { buscarCliente, buscarFaturasDoCliente } from './api.js';
import { resumirEconomia, formatarMoeda, formatarMes, formatarData } from './economia.js';

// Cliente exibido quando a URL não informa ?cliente=ID.
// Ana Paula (4) tem faturas pagas; Marina (1) mostra o estado sem economia.
const CLIENTE_PADRAO = 4;

// TODO: apontar para a tela da HU01/HU03 quando ela existir.
const LINK_PRIMEIRA_FATURA = '../index.html';

// Altura da maior barra do gráfico, em px (mockup: R$ 61,90 → 98px).
const ALTURA_MAXIMA_BARRA = 98;

const CHECK = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3"><path d="M5 12l5 5 9-10"/></svg>';

const clienteId = Number(new URLSearchParams(location.search).get('cliente')) || CLIENTE_PADRAO;
const linkCalculo = `economia-calculo.html?cliente=${clienteId}`;
const conteudo = document.querySelector('#conteudo-economia');

// Mantém o mesmo cliente ao voltar para o início da HU04.
document.querySelectorAll('.link-inicio').forEach((link) => {
  link.href = `economia-inicio.html?cliente=${clienteId}`;
});

let meses = [];
let selecionado = 0;

function rotuloMeses(quantidade) {
  return quantidade === 1 ? '1 mês' : `${quantidade} meses`;
}

function renderizarEconomia(resumo) {
  conteudo.innerHTML = `
    <section class="economia-total">
      <div class="rotulo">Você já economizou</div>
      <div class="valor-grande">${formatarMoeda(resumo.total)}</div>
      <div class="periodo">desde que entrou na Bulbe (${formatarMes(meses[0].referencia)} · ${rotuloMeses(meses.length)})</div>
    </section>

    <section class="card card-comparativo" aria-labelledby="titulo-comparativo">
      <div class="linha">
        <h2 id="titulo-comparativo">Comparativo do mês</h2>
        <div class="seletor-mes">
          <button type="button" id="mes-anterior" aria-label="Mês anterior">‹</button>
          <span id="mes-atual" aria-live="polite"></span>
          <button type="button" id="mes-seguinte" aria-label="Próximo mês">›</button>
        </div>
      </div>
      <div id="comparativo"></div>
    </section>

    <section class="card card-grafico" aria-labelledby="titulo-grafico">
      <h2 id="titulo-grafico">Economia por mês</h2>
      <div id="grafico" class="grafico"></div>
      <div id="meses-grafico" class="meses-grafico"></div>
    </section>

    <a class="link-claro" href="${linkCalculo}">Como a economia é calculada?</a>`;

  document.querySelector('#mes-anterior').addEventListener('click', () => selecionar(selecionado - 1));
  document.querySelector('#mes-seguinte').addEventListener('click', () => selecionar(selecionado + 1));
  document.querySelector('#grafico').addEventListener('click', (evento) => {
    const barra = evento.target.closest('.barra');
    if (barra) selecionar(Number(barra.dataset.indice));
  });

  document.querySelector('#meses-grafico').innerHTML = meses
    .map((m) => `<span>${formatarMes(m.referencia).slice(0, 3)}</span>`)
    .join('');

  selecionar(meses.length - 1);
}

// Atualiza o comparativo e o destaque do gráfico para o mês escolhido.
function selecionar(indice) {
  selecionado = Math.min(Math.max(indice, 0), meses.length - 1);
  const mes = meses[selecionado];

  document.querySelector('#mes-atual').textContent = formatarMes(mes.referencia);
  document.querySelector('#mes-anterior').disabled = selecionado === 0;
  document.querySelector('#mes-seguinte').disabled = selecionado === meses.length - 1;

  document.querySelector('#comparativo').innerHTML = `
    <div class="linha bloco-valor">
      <span>Sem a Bulbe você pagaria</span><strong>${formatarMoeda(mes.semBulbe)}</strong>
    </div>
    <div class="bloco-valor bloco-composto">
      <div class="linha"><span>Com a Bulbe você pagou</span><strong>${formatarMoeda(mes.comBulbe)}</strong></div>
      <div class="linha sub"><span>Fatura Bulbe</span><span>${formatarMoeda(mes.fatura)}</span></div>
      <div class="linha sub"><span>+ Conta da distribuidora (Cemig)</span><span>${formatarMoeda(mes.distribuidora)}</span></div>
    </div>
    <div class="linha bloco-valor destaque-economia">
      <span>Economia de</span><strong>${formatarMoeda(mes.economia)}</strong>
    </div>`;

  // Meses sem valor ficam com barra zerada e não influenciam a escala.
  const maior = Math.max(0, ...meses.map((m) => m.economia ?? 0)) || 1;
  document.querySelector('#grafico').innerHTML = meses
    .map((m, i) => `
      <button type="button" class="barra${i === selecionado ? ' ativa' : ''}" data-indice="${i}"
        aria-pressed="${i === selecionado}" aria-label="${formatarMes(m.referencia)}: economia ${formatarMoeda(m.economia)}">
        <span>${formatarMoeda(m.economia)}</span>
        <span class="barra-coluna" style="height: ${Math.round(((m.economia ?? 0) / maior) * ALTURA_MAXIMA_BARRA)}px"></span>
      </button>`)
    .join('');
}

function renderizarVazio(faturas) {
  const proxima = faturas
    .filter((fatura) => fatura.status !== 'paga')
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0];
  const detalhe = proxima
    ? `${formatarMoeda(proxima.valor)} · vence ${formatarData(proxima.vencimento)}`
    : 'Sua fatura está sendo preparada';

  conteudo.classList.add('vazio');
  conteudo.innerHTML = `
    <section class="estado-vazio">
      <div class="selo-bulbe"><img src="../assets/img/icone-bulbe.png" alt=""></div>
      <h2>Sua economia aparece aqui em breve</h2>
      <p>Assim que você pagar sua primeira fatura da Bulbe, vamos mostrar quanto você economizou na conta de energia.</p>
    </section>

    <section class="card card-passos" aria-labelledby="titulo-passos">
      <h2 id="titulo-passos">Seus próximos passos</h2>
      <ol class="passos">
        <li class="feito"><span class="marcador">${CHECK}</span><span>Contrato assinado</span></li>
        <li class="atual"><span class="marcador"></span>
          <div><div class="titulo-passo">Pagar a primeira fatura Bulbe</div><div class="detalhe">${detalhe}</div></div></li>
        <li><span class="marcador"></span><span class="proximo">Ver sua primeira economia</span></li>
      </ol>
    </section>

    <section class="card card-grafico" aria-labelledby="titulo-grafico-vazio">
      <h2 id="titulo-grafico-vazio">Economia por mês</h2>
      <div class="grafico-vazio" aria-hidden="true">
        <span style="height: 36px"></span><span style="height: 56px"></span><span style="height: 46px"></span>
      </div>
      <div class="legenda-vazio">Os meses aparecem aqui depois de cada pagamento</div>
    </section>

    <a class="botao claro" href="${LINK_PRIMEIRA_FATURA}">Ver minha primeira fatura</a>
    <a class="link-claro" href="${linkCalculo}">Como a economia é calculada?</a>`;
}

async function iniciar() {
  try {
    const [cliente, faturas] = await Promise.all([
      buscarCliente(clienteId),
      buscarFaturasDoCliente(clienteId)
    ]);
    if (!cliente) throw new Error(`Cliente ${clienteId} não encontrado`);

    const resumo = resumirEconomia(faturas);
    meses = resumo.meses;
    if (meses.length === 0) {
      renderizarVazio(faturas);
    } else {
      renderizarEconomia(resumo);
    }
  } catch (erro) {
    conteudo.innerHTML = '<p class="link-claro">Não foi possível carregar sua economia. O projeto está aberto pelo Live Server?</p>';
    console.error(erro);
  }
}

iniciar();
