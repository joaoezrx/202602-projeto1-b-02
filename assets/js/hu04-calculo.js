import { buscarCliente, buscarFaturasDoCliente } from './api.js';
import { resumirEconomia, formatarMoeda, nomeMes, linkTela } from './hu04-util.js';

// Cliente da conta logada (assets/js/sessao.js); 4 = Ana Paula, se não houver sessão.
const CLIENTE_PADRAO = window.BulbeSessao?.usuario()?.clienteId ?? 4;

const clienteId = Number(new URLSearchParams(location.search).get('cliente')) || CLIENTE_PADRAO;

// Mantém o mesmo cliente ao voltar para a tela anterior.
document.querySelectorAll('.link-economia').forEach((link) => {
  link.href = linkTela('economia', clienteId);
});

// 214.6 → '214,60' (sem o "R$", para caber dentro dos parênteses)
function semSimbolo(valor) {
  return formatarMoeda(valor).replace(/R\$\s?/, '');
}

function renderizarExemplo(mes) {
  document.querySelector('#exemplo').innerHTML = `
    <h2>Exemplo: ${nomeMes(mes.referencia)}</h2>
    <div class="linha"><span>Sem a Bulbe</span><span>${formatarMoeda(mes.semBulbe)}</span></div>
    <div class="linha"><span>− Com a Bulbe (${semSimbolo(mes.fatura)} + ${semSimbolo(mes.distribuidora)})</span>
      <span>${formatarMoeda(mes.comBulbe)}</span></div>
    <div class="divisor"></div>
    <div class="linha total"><span>= Sua economia</span><span>${formatarMoeda(mes.economia)}</span></div>`;
  document.querySelector('#exemplo').hidden = false;
}

// Usa os meses do próprio cliente para explicar por que o valor varia.
function textoVariacao(meses, desconto) {
  if (meses.length < 2) {
    return `Quanto mais energia você usa, mais o desconto rende em reais. O percentual é sempre o mesmo: ${desconto}%.`;
  }
  const ordenados = [...meses].sort((a, b) => a.economia - b.economia);
  const menor = ordenados[0];
  const maior = ordenados[ordenados.length - 1];
  const periodo = { 2: 'nos dois meses', 3: 'nos três meses' }[meses.length] ?? 'em todos os meses';
  return `Quanto mais energia você usa, mais o desconto rende em reais.
    Em ${nomeMes(maior.referencia)} você usou mais e economizou ${formatarMoeda(maior.economia)}.
    Em ${nomeMes(menor.referencia)} usou menos e economizou ${formatarMoeda(menor.economia)}.
    O desconto foi de ${desconto}% ${periodo}.`;
}

async function iniciar() {
  try {
    const [cliente, faturas] = await Promise.all([
      buscarCliente(clienteId),
      buscarFaturasDoCliente(clienteId)
    ]);
    if (!cliente) throw new Error(`Cliente ${clienteId} não encontrado`);

    const desconto = cliente.descontoPercentual;
    document.querySelectorAll('.desconto').forEach((el) => {
      el.textContent = `${desconto}%`;
    });

    // Para explicar a conta, só servem meses com todos os valores.
    const meses = resumirEconomia(faturas).meses.filter((mes) => mes.economia !== null);
    if (meses.length > 0) {
      renderizarExemplo(meses[meses.length - 1]);
    }
    document.querySelector('#variacao').textContent = textoVariacao(meses, desconto);
  } catch (erro) {
    document.querySelector('#variacao').textContent =
      'Não foi possível carregar seus dados. O projeto está aberto pelo Live Server?';
    console.error(erro);
  }
}

iniciar();
