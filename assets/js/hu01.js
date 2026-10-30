
/* HU01 — Navegação entre as telas da fatura */

const telasHU01 = {
  resumo: {
    html: "pages/hu01-resumo.html",
    css: "pages/css/hu01.css"
  },

  calculo: {
    html: "pages/hu01-calculo.html",
    css: "pages/css/hu01-calculo.css"
  },

  duvidas: {
    html: "pages/hu01-duvidas.html",
    css: "pages/css/hu01-duvidas.css"
  }
};

export async function abrirTelaHU01(tela = "resumo") {
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

    conteudo.innerHTML = html;
    conteudo.scrollTop = 0;

  } catch (erro) {
    console.error("Erro ao carregar HU01:", erro);
    conteudo.textContent = "Não foi possível carregar esta tela.";
  }
}

/* Navegação entre as telas */

document.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-hu01-destino]");

  if (!botao) return;

  evento.preventDefault();

  abrirTelaHU01(botao.dataset.hu01Destino);
});
