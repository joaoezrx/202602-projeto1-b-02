// Funções de acesso aos dados. Toda leitura de JSON passa por aqui.
// Importante: fetch só funciona com o projeto aberto por um servidor (Live Server),
// e não abrindo o arquivo direto no navegador (file://).

const BASE = new URL('../../data/', import.meta.url);

async function lerJSON(arquivo) {
  const resposta = await fetch(new URL(arquivo, BASE));
  if (!resposta.ok) {
    throw new Error(`Erro ao carregar ${arquivo}: ${resposta.status}`);
  }
  return resposta.json();
}

export function buscarClientes() {
  return lerJSON('clientes.json');
}

export async function buscarCliente(clienteId) {
  const clientes = await buscarClientes();
  return clientes.find((cliente) => cliente.id === clienteId);
}

// Contas de acesso (fictícias). A senha fica só como hash SHA-256.
export function buscarUsuarios() {
  return lerJSON('usuarios.json');
}

// Acompanhamento da adesão (dados demonstrativos), usado na home.
export async function buscarAdesaoDoCliente(clienteId) {
  const adesoes = await lerJSON('adesao.json');
  return adesoes.find((adesao) => adesao.clienteId === clienteId);
}

// Programa Indique e ganhe (código e histórico fictícios, valores demonstrativos).
export async function buscarIndicacoesDoCliente(clienteId) {
  const registros = await lerJSON('indicacoes.json');
  return registros.find((registro) => registro.clienteId === clienteId);
}

export function buscarFaturas() {
  return lerJSON('faturas.json');
}

export async function buscarFaturasDoCliente(clienteId) {
  const faturas = await buscarFaturas();
  return faturas.filter((fatura) => fatura.clienteId === clienteId);
}
