import { buscarCliente, buscarFaturasDoCliente, buscarAdesaoDoCliente } from './api.js';
import { resumirEconomia, formatarMoeda, formatarMes, formatarData, nomeMes, linkTela } from './hu04-util.js';

// Cliente exibido quando a URL não informa ?cliente=ID (ver hu04-economia.js).
// Cliente da conta logada (assets/js/sessao.js); 4 = Ana Paula, se não houver sessão.
const CLIENTE_PADRAO = window.BulbeSessao?.usuario()?.clienteId ?? 4;

const clienteId = Number(new URLSearchParams(location.search).get('cliente')) || CLIENTE_PADRAO;
const linkDetalhes = linkTela('economia', clienteId);
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

// ===== Acompanhamento da adesão (topo da home) =====
// Linha do tempo vertical, inspirada no app oficial. A etapa atual vem do
// status do cliente (data/clientes.json); datas e protocolo, de data/adesao.json.
const ETAPAS_ADESAO = [
  { id: 'solicitacao', titulo: 'Solicitação recebida',
    descricao: 'Recebemos seu cadastro e a conta de luz enviada.' },
  { id: 'analise', titulo: 'Análise dos documentos',
    descricao: 'Estamos conferindo seus dados e a titularidade da conta de luz.' },
  { id: 'preparando', titulo: 'Preparando sua energia',
    descricao: 'Reservamos sua cota de energia solar e avisamos a Cemig.' },
  { id: 'ativa', titulo: 'Ativa',
    descricao: 'Sua energia solar já gera desconto na conta de luz.' }
];

// status do cliente → etapa atual da adesão
const ETAPA_POR_STATUS = {
  aguardando_qualificacao: 'analise',
  em_conexao: 'preparando',
  conectado: 'ativa'
};

const ROTULO_SITUACAO = { concluida: 'concluída', atual: 'etapa atual', futura: 'próxima etapa' };

const ICONE_CHECK = '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const areaAdesao = document.querySelector('#home-adesao');

function renderizarAdesao(adesao, cliente) {
  const idAtual = ETAPA_POR_STATUS[cliente.status] ?? 'solicitacao';
  const atual = ETAPAS_ADESAO.findIndex((etapa) => etapa.id === idAtual);
  const ativa = idAtual === 'ativa';

  // Ativa = todas concluídas. Senão: antes da atual = concluída; depois = futura.
  const situacao = (i) => (ativa || i < atual ? 'concluida' : i === atual ? 'atual' : 'futura');

  function quando(etapa, s) {
    const dataEtapa = adesao.datas?.[etapa.id];
    if (dataEtapa) return s === 'atual' ? `Desde ${diaMes(dataEtapa)}` : diaMes(dataEtapa);
    if (etapa.id === 'ativa' && adesao.previsaoAtivacao) return `Previsão ${diaMes(adesao.previsaoAtivacao)}`;
    return 'A seguir';
  }

  const resumo = ativa
    ? (adesao.datas?.ativa ? `Ativa desde ${diaMes(adesao.datas.ativa)}` : 'Sua energia solar está ativa')
    : adesao.previsaoAtivacao ? `Previsão de ativação: ${diaMes(adesao.previsaoAtivacao)}` : 'Avisaremos a cada nova etapa';

  const etapas = ETAPAS_ADESAO.map((etapa, i) => {
    const s = situacao(i);
    return `
        <li class="adesao-etapa ${s}"${s === 'atual' ? ' aria-current="step"' : ''}>
          <span class="adesao-marcador" aria-hidden="true">${s === 'concluida' ? ICONE_CHECK : ''}</span>
          <div class="adesao-corpo">
            <div class="adesao-cabeca">
              <strong>${etapa.titulo}<span class="so-leitor"> (${ROTULO_SITUACAO[s]})</span></strong>
              <span class="adesao-data">${quando(etapa, s)}</span>
            </div>
            <p class="adesao-desc">${etapa.descricao}</p>
          </div>
        </li>`;
  }).join('');

  areaAdesao.innerHTML = `
    <section class="card card-adesao" aria-labelledby="titulo-adesao">
      <div class="linha">
        <h2 id="titulo-adesao">Sua adesão</h2>
        <span class="selo-adesao ${ativa ? 'ativa' : ''}">${ativa ? 'Concluída' : 'Em andamento'}</span>
      </div>
      <div>
        <div class="suave" style="font-size: 13px">Status atual</div>
        <div class="adesao-status ${ativa ? 'ativa' : ''}">${ETAPAS_ADESAO[atual].titulo}</div>
        <div class="detalhe">${resumo}</div>
      </div>
      <ol class="adesao-linha" id="adesao-linha" aria-label="Etapas da adesão: etapa ${atual + 1} de ${ETAPAS_ADESAO.length}">${etapas}
      </ol>
      <div class="detalhe adesao-protocolo">Protocolo ${adesao.protocolo} · dados demonstrativos</div>
      <button type="button" class="botao-contorno" aria-expanded="false" aria-controls="adesao-linha">
        <span>Ver detalhes</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
    </section>`;

  // Recolhida: só os títulos (a etapa atual já mostra data e descrição).
  // Expandida: datas e descrições de todas as etapas.
  const card = areaAdesao.querySelector('.card-adesao');
  const botao = card.querySelector('.botao-contorno');
  botao.addEventListener('click', () => {
    const abrir = !card.classList.contains('expandida');
    card.classList.toggle('expandida', abrir);
    botao.setAttribute('aria-expanded', String(abrir));
    botao.querySelector('span').textContent = abrir ? 'Ocultar detalhes' : 'Ver detalhes';
  });

  abrirAdesaoPeloEndereco();
}

// index.html#adesao (item "Status da instalação" do menu): rola até o card e abre os detalhes.
function abrirAdesaoPeloEndereco() {
  if (location.hash !== '#adesao') return;
  const card = areaAdesao.querySelector('.card-adesao');
  if (!card) return;
  if (!card.classList.contains('expandida')) card.querySelector('.botao-contorno').click();
  card.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

window.addEventListener('hashchange', abrirAdesaoPeloEndereco);

// Falha da adesão não derruba a economia (e vice-versa): cada uma tem seu próprio try.
async function iniciarAdesao() {
  try {
    const [adesao, cliente] = await Promise.all([buscarAdesaoDoCliente(clienteId), buscarCliente(clienteId)]);
    if (adesao && cliente) renderizarAdesao(adesao, cliente);
  } catch (erro) {
    console.error('Não foi possível carregar a adesão:', erro);
  }
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

iniciarAdesao();
iniciar();
