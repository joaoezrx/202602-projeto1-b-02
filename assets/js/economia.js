// Regras e formatação da HU04 (Minha economia).
// Nada aqui mexe na página: as funções recebem dados e devolvem dados ou texto,
// para serem usadas tanto em economia.html quanto em economia-calculo.html.

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Valores ausentes (null) aparecem como "Sem valor" em vez de "R$ NaN".
export function formatarMoeda(valor) {
  return valor === null ? 'Sem valor' : moeda.format(valor);
}

// Arredonda para centavos, evitando resíduos como 48.199999999.
function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

// '2026-09' → 'setembro'
export function nomeMes(referencia) {
  const mes = Number(referencia.split('-')[1]);
  return MESES[mes - 1];
}

// '2026-09' → 'set/2026'
export function formatarMes(referencia) {
  const ano = referencia.split('-')[0];
  return `${nomeMes(referencia).slice(0, 3)}/${ano}`;
}

// '2026-11-12' → '12/11/2026' (sem usar Date, para não sofrer com fuso horário)
export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Recebe todas as faturas de um cliente e devolve o resumo usado pelas telas:
//
//   {
//     meses: [
//       { referencia: '2026-07', semBulbe: 282.5, fatura: 192.8,
//         distribuidora: 41.5, comBulbe: 234.3, economia: 48.2 },
//       ...
//     ],
//     total: 163.75
//   }
//
// - `meses` deve vir em ordem cronológica (o gráfico e o seletor dependem disso).
// - Só entram faturas pagas. Sem nenhuma, devolve { meses: [], total: 0 }:
//   a tela mostra o estado "Sua economia aparece aqui em breve".
// - Se faltar o valor da Bulbe, da distribuidora ou o "sem Bulbe", o campo
//   fica null (exibido como "Sem valor") e o mês não soma no total.
export function resumirEconomia(faturas) {
  const meses = faturas
    .filter((fatura) => fatura.status === 'paga')
    .sort((a, b) => a.referencia.localeCompare(b.referencia))
    .map((fatura) => {
      const semBulbe = fatura.valorSemBulbe ?? null;
      const valorFatura = fatura.valor ?? null;
      const distribuidora = fatura.valorDistribuidora ?? null;
      const comBulbe = valorFatura !== null && distribuidora !== null
        ? arredondar(valorFatura + distribuidora)
        : null;
      const economia = comBulbe !== null && semBulbe !== null
        ? arredondar(semBulbe - comBulbe)
        : null;

      return { referencia: fatura.referencia, semBulbe, fatura: valorFatura, distribuidora, comBulbe, economia };
    });

  const total = arredondar(meses.reduce((soma, mes) => soma + (mes.economia ?? 0), 0));
  return { meses, total };
}
