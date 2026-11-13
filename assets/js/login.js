// Tela de login — Projeto Bulbe, Squad B-02
// Confere e-mail + senha com data/usuarios.json (dados fictícios).
// A senha digitada vira hash SHA-256 e é comparada com o hash salvo:
// a senha em si não fica guardada em lugar nenhum.

import { buscarUsuarios } from './api.js';

const sessao = window.BulbeSessao;
const form = document.querySelector('#form-login');
const campoEmail = document.querySelector('#email');
const campoSenha = document.querySelector('#senha');
const campoManter = document.querySelector('#manter');
const caixaErro = document.querySelector('#login-erro');
const botaoEntrar = document.querySelector('#botao-entrar');
const botaoMostrar = document.querySelector('#mostrar-senha');

// Só aceita voltar para telas do próprio app (evita redirecionar para fora)
function destinoDepoisDoLogin() {
  const voltar = new URLSearchParams(location.search).get('voltar') ?? '';
  const valido = /^(index\.html|pages\/(hu[\w-]+|indique|historico|perfil)\.html)(\?[\w=&%.-]*)?$/.test(voltar);
  return `../${valido ? voltar : 'index.html'}`;
}

// Já está logado? Em vez de pular direto (o que impedia trocar de conta),
// mostra "Você já está conectado como X" com Continuar / Entrar com outra conta.
function mostrarJaConectado() {
  const atual = sessao.usuario();
  if (!atual) return;

  const painel = document.querySelector('#ja-conectado');
  const primeiroNome = atual.nome.split(' ').slice(0, 2).join(' ');
  document.querySelector('#conectado-nome').textContent = atual.nome;
  const continuar = document.querySelector('#continuar-como');
  continuar.textContent = `Continuar como ${primeiroNome}`;
  continuar.href = destinoDepoisDoLogin();

  form.classList.add('conectado');
  form.querySelector('h1').textContent = 'Bem-vindo de volta!';
  painel.hidden = false;

  document.querySelector('#outra-conta').addEventListener('click', () => {
    sessao.limpar();
    painel.hidden = true;
    form.classList.remove('conectado');
    form.querySelector('h1').textContent = 'Entrar na sua conta';
    campoEmail.focus();
  });
}

mostrarJaConectado();

async function sha256(texto) {
  const bytes = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function mostrarErro(mensagem, campos = []) {
  caixaErro.textContent = mensagem;
  caixaErro.hidden = false;
  [campoEmail, campoSenha].forEach((campo) => campo.removeAttribute('aria-invalid'));
  campos.forEach((campo) => campo.setAttribute('aria-invalid', 'true'));
  (campos[0] ?? campoEmail).focus();
}

function limparErro() {
  caixaErro.hidden = true;
  [campoEmail, campoSenha].forEach((campo) => campo.removeAttribute('aria-invalid'));
}

async function entrar(evento) {
  evento.preventDefault();
  limparErro();

  const email = campoEmail.value.trim().toLowerCase();
  const senha = campoSenha.value;

  if (!email || !senha) {
    mostrarErro('Preencha o e-mail e a senha.', [!email ? campoEmail : campoSenha]);
    return;
  }

  if (!campoEmail.checkValidity()) {
    mostrarErro('Digite um e-mail válido, como voce@email.com.', [campoEmail]);
    return;
  }

  // crypto.subtle só existe em contexto seguro (localhost ou https)
  if (!window.crypto?.subtle) {
    mostrarErro('Abra o projeto pelo localhost (Live Server) para conseguir entrar.');
    return;
  }

  botaoEntrar.disabled = true;
  botaoEntrar.textContent = 'Entrando…';

  try {
    const [usuarios, hashDigitado] = await Promise.all([buscarUsuarios(), sha256(senha)]);
    const usuario = usuarios.find((u) => u.email.toLowerCase() === email && u.senhaSha256 === hashDigitado);

    if (!usuario) {
      // Mensagem genérica: não revela se o e-mail existe
      mostrarErro('E-mail ou senha incorretos.', [campoEmail, campoSenha]);
      return;
    }

    sessao.salvar({
      usuarioId: usuario.id,
      clienteId: usuario.clienteId,
      nome: usuario.nome,
      email: usuario.email,
      primeiroAcesso: Boolean(usuario.primeiroAcesso), // conta nova -> tutorial do Continha
      entrouEm: new Date().toISOString()
    }, campoManter.checked);

    location.replace(destinoDepoisDoLogin());
  } catch (erro) {
    console.error('Erro no login:', erro);
    mostrarErro('Não foi possível entrar agora. O projeto está aberto pelo Live Server?');
  } finally {
    botaoEntrar.disabled = false;
    botaoEntrar.textContent = 'Entrar';
  }
}

form.addEventListener('submit', entrar);
[campoEmail, campoSenha].forEach((campo) => campo.addEventListener('input', limparErro));

botaoMostrar.addEventListener('click', () => {
  const mostrando = campoSenha.type === 'text';
  campoSenha.type = mostrando ? 'password' : 'text';
  botaoMostrar.setAttribute('aria-pressed', String(!mostrando));
  botaoMostrar.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Esconder senha');
});
