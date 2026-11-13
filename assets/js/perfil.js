// Meu perfil — dados da conta logada (sessão) + do cliente (data/clientes.json, via api.js).
// Mostra só os campos que existem nos dados; nada é inventado.
// "Sair da conta" reaproveita o logout de assets/js/sessao.js.

import { buscarCliente } from './api.js';

const usuario = window.BulbeSessao?.usuario() ?? null;
const secoes = document.querySelector('#perfil-secoes');

// '2026-06-18' → '18/06/2026' (texto, sem passar por Date)
const dataBR = (iso) => iso.split('-').reverse().join('/');

// [rótulo, valor]; campos sem valor ficam de fora
function campos(lista) {
  return lista.filter(([, valor]) => valor !== undefined && valor !== null && String(valor).trim() !== '');
}

function secao(titulo, itens) {
  if (itens.length === 0) return null;
  const el = document.createElement('section');
  el.className = 'perfil-card';
  el.innerHTML = '<h2></h2><dl></dl>';
  el.querySelector('h2').textContent = titulo;
  const dl = el.querySelector('dl');
  itens.forEach(([rotulo, valor]) => {
    const linha = document.createElement('div');
    linha.className = 'perfil-linha';
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = rotulo;
    dd.textContent = valor;
    linha.append(dt, dd);
    dl.appendChild(linha);
  });
  return el;
}

function renderizar(cliente) {
  const nome = usuario?.nome ?? cliente?.nome ?? 'Cliente Bulbe';
  const iniciais = nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  document.querySelector('#perfil-avatar').textContent = iniciais;
  document.querySelector('#perfil-nome').textContent = nome;

  // Telefone e unidade consumidora só aparecem se existirem no cadastro (hoje não existem nos JSON).
  const pessoais = campos([
    ['Nome', nome],
    ['E-mail', usuario?.email],
    ['Telefone', cliente?.telefone ?? usuario?.telefone]
  ]);

  const conta = campos([
    ['Unidade consumidora', cliente?.unidadeConsumidora],
    ['Cidade', cliente?.cidade],
    ['Cliente Bulbe desde', cliente?.dataAdesao ? dataBR(cliente.dataAdesao) : null]
  ]);

  secoes.replaceChildren(...[secao('Dados pessoais', pessoais), secao('Conta de luz', conta)].filter(Boolean));
}

document.querySelector('#perfil-sair').addEventListener('click', () => window.BulbeSessao?.sair());

/* Voltar: volta para a tela anterior do app; sem histórico, vai para o início */
document.querySelector('.perfil-voltar').addEventListener('click', (evento) => {
  const veioDoApp = document.referrer && new URL(document.referrer).origin === location.origin;
  if (veioDoApp && history.length > 1) {
    evento.preventDefault();
    history.back();
  }
});

async function iniciar() {
  let cliente = null;
  try {
    if (usuario?.clienteId) cliente = await buscarCliente(usuario.clienteId);
  } catch (erro) {
    // Sem os dados do cliente, o perfil mostra ao menos o que vem da sessão.
    console.error('Não foi possível carregar os dados do cliente:', erro);
  }
  renderizar(cliente);
}

iniciar();
