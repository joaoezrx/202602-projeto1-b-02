
import { abrirTelaHU01 } from "./hu01.js";
import { abrirTelaHU04 } from "./hu04.js";

const estiloMenu = document.createElement("link");
estiloMenu.rel = "stylesheet";
estiloMenu.href = "assets/css/menu.css";
document.head.appendChild(estiloMenu);

const conteudo = document.getElementById("conteudo-principal");

function abrirMenu() {
  document.getElementById("estilo-hu01")?.remove();

  conteudo.innerHTML = `
    <section class="menu-hus">
      <h1>Bem-vindo à Bulbe!</h1>
      <p>Escolha uma funcionalidade para continuar.</p>

      <div class="lista-hus">

        <button data-hu="01" class="card-funcionalidade">
          <span class="card-texto">
            <strong>Resumo da fatura</strong>
            <small>Consulte os valores e detalhes da sua conta de energia.</small>
          </span>
          <span class="card-seta" aria-hidden="true">›</span>
        </button>

        <button data-hu="02" class="card-funcionalidade">
          <span class="card-texto">
            <strong>Comparativo de faturas</strong>
            <small>Compare seus gastos e acompanhe a evolução do consumo.</small>
          </span>
          <span class="card-seta" aria-hidden="true">›</span>
        </button>

        <button data-hu="03" class="card-funcionalidade">
          <span class="card-texto">
            <strong>Acompanhamento da primeira fatura</strong>
            <small>Veja as etapas e saiba quando sua primeira fatura estará disponível.</small>
          </span>
          <span class="card-seta" aria-hidden="true">›</span>
        </button>

        <button data-hu="04" class="card-funcionalidade">
          <span class="card-texto">
            <strong>Economia de energia</strong>
            <small>Descubra quanto você economiza utilizando a energia Bulbe.</small>
          </span>
          <span class="card-seta" aria-hidden="true">›</span>
        </button>

      </div>
    </section>
  `;
}

document.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-hu]");

  if (!botao) return;

  const hu = botao.dataset.hu;

  if (hu === "01") {
    abrirTelaHU01("resumo");
  }

  if (hu === "02") {
    window.location.href = "pages/hu02.html";
  }

  if (hu === "03") {
    window.location.href = "pages/hu03-1.html";
  }

  if (hu === "04") {
    abrirTelaHU04("inicio");
  }
});

const parametros = new URLSearchParams(window.location.search);

if (parametros.get("hu") === "01") {
  abrirTelaHU01(parametros.get("tela") || "resumo");
} else if (parametros.get("hu") === "04") {
  abrirTelaHU04(parametros.get("tela") || "inicio");
} else {
  abrirMenu();
}
