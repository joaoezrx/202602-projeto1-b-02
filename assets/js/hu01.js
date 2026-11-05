
/* HU01 — Navegação entre as telas da fatura */

const telasHU01 = {
  resumo: {
    html: "pages/hu01-resumo.html",
    css: "assets/css/hu01.css"
  },
  calculo: {
    html: "pages/hu01-calculo.html",
    css: "assets/css/hu01-calculo.css"
  },
  duvidas: {
    html: "pages/hu01-duvidas.html",
    css: "assets/css/hu01-duvidas.css"
  }
};

let telaAtual = null;
let historicoHU01 = [];

export async function abrirTelaHU01(tela = "resumo", guardarHistorico = true) {
  const configuracao = telasHU01[tela];
  const conteudo = document.querySelector("#conteudo-principal");

  if (!configuracao || !conteudo) {
    console.error("Tela da HU01 não encontrada:", tela);
    return;
  }

  try {
    const resposta = await fetch(configuracao.html);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const html = await resposta.text();

    let estilo = document.getElementById("estilo-hu01");

    if (!estilo) {
      estilo = document.createElement("link");
      estilo.id = "estilo-hu01";
      estilo.rel = "stylesheet";
      document.head.appendChild(estilo);
    }

    estilo.href = configuracao.css;

    if (guardarHistorico && telaAtual && telaAtual !== tela) {
      historicoHU01.push(telaAtual);
    }

    telaAtual = tela;

    conteudo.innerHTML = `
      <button type="button" class="botao-voltar-hu" data-hu01-voltar aria-label="Voltar" title="Voltar">
       <span aria-hidden="true">‹</span>
      </button>
      ${html}
    `;

    conteudo.scrollTop = 0;

  } catch (erro) {
    console.error("Erro ao carregar HU01:", erro);
    conteudo.textContent = "Não foi possível carregar esta tela.";
  }
}

/* Navegação entre as telas */

document.addEventListener("click", (evento) => {
  const voltar = evento.target.closest("[data-hu01-voltar]");

  if (voltar) {
    evento.preventDefault();

    if (historicoHU01.length > 0) {
      const telaAnterior = historicoHU01.pop();
      abrirTelaHU01(telaAnterior, false);
    } else {
      window.location.href = "index.html";
    }

    return;
  }

  const botao = evento.target.closest("[data-hu01-destino]");

  if (!botao) return;

  evento.preventDefault();
  abrirTelaHU01(botao.dataset.hu01Destino);
});
