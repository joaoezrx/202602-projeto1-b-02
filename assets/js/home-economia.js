import { buscarCliente, buscarFaturasDoCliente } from './api.js';
import { resumirEconomia, formatarMoeda, formatarMes, formatarData, nomeMes } from './economia.js';

// Cliente exibido quando a URL não informa ?cliente=ID (ver pagina-economia.js).
const CLIENTE_PADRAO = 4;

const clienteId = Number(new URLSearchParams(location.search).get('cliente')) || CLIENTE_PADRAO;
const linkDetalhes = `economia.html?cliente=${clienteId}`;
const area = document.querySelector('#home-economia');

// '2026-09-10' → '10/09'
function diaMes(data) {
  return formatarData(data).slice(0, 5);
}

function renderizarResumo(resumo, faturas) {
  const mes = resumo.meses[resumo.meses.length - 1];
  const fatura = faturas.find((f) => f.referencia === mes.referencia);
  const ano = mes.referencia.split('-')[0];
  const cemig = fatura.vencimentoDistribuidora
    ? `Cemig · venceu ${diaMes(fatura.vencimentoDistribuidora)}`
    : 'Cemig';

  area.innerHTML = `
    <section class="card card-economia" aria-labelledby="titulo-home-economia">
      <div class="linha">
        <h2 id="titulo-home-economia">Minha economia</h2>
        <span class="selo-mes">${nomeMes(mes.referencia)}/${ano}</span>
      </div>
      <div>
        <div class="suave" style="font-size: 13px">Você economizou este mês</div>
        <div class="economia-mes"><strong>${formatarMoeda(mes.economia)}</strong><span class="pill">economia</span></div>
      </div>
      <div class="divisor"></div>
      <div class="linha">
        <div>
          <div class="suave" style="font-size: 13px">Total desde a contratação</div>
          <div class="detalhe">${formatarMes(resumo.meses[0].referencia)} até hoje</div>
        </div>
        <div class="total-contratacao">${formatarMoeda(resumo.total)}</div>
      </div>
      <a class="botao" href="${linkDetalhes}">Ver detalhes</a>
    </section>

    <section class="card card-contas" aria-labelledby="titulo-contas">
      <h2 id="titulo-contas">Suas contas de ${nomeMes(mes.referencia)}</h2>
      <div class="linha">
        <div><div class="conta-nome">Fatura Bulbe</div><div class="detalhe">Venceu ${diaMes(fatura.vencimento)}</div></div>
        <div><div class="conta-valor">${formatarMoeda(mes.fatura)}</div><div class="status-paga">Paga</div></div>
      </div>
      <div class="divisor"></div>
      <div class="linha">
        <div><div class="conta-nome">Conta da distribuidora</div><div class="detalhe">${cemig}</div></div>
        <div><div class="conta-valor">${formatarMoeda(mes.distribuidora)}</div><div class="status-paga">Paga</div></div>
      </div>
      <div class="divisor"></div>
      <div class="linha" style="font-size: 14px"><span>Total pago no mês</span><strong style="color: var(--azul)">${formatarMoeda(mes.comBulbe)}</strong></div>
    </section>`;
}

function renderizarSemPagamento() {
  area.innerHTML = `
    <section class="card card-economia">
      <h2>Minha economia</h2>
      <div class="suave" style="font-size: 13px">Sua economia aparece aqui depois que você pagar a primeira fatura da Bulbe.</div>
      <a class="botao" href="${linkDetalhes}">Ver detalhes</a>
    </section>`;
}

async function iniciar() {
  try {
    const [cliente, faturas] = await Promise.all([
      buscarCliente(clienteId),
      buscarFaturasDoCliente(clienteId)
    ]);
    if (!cliente) throw new Error(`Cliente ${clienteId} não encontrado`);

    // Na saudação vai só o primeiro e o segundo nome, como no wireframe ("Ana Paula").
    document.querySelector('#nome-cliente').textContent = cliente.nome.split(' ').slice(0, 2).join(' ');

    const resumo = resumirEconomia(faturas);
    if (resumo.meses.length === 0) {
      renderizarSemPagamento();
    } else {
      renderizarResumo(resumo, faturas);
    }
  } catch (erro) {
    area.innerHTML = '<p class="link-claro">Não foi possível carregar sua economia. O projeto está aberto pelo Live Server?</p>';
    console.error(erro);
  }
}

iniciar();
