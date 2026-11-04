
/*
  Carregamento inicial das telas
  Projeto Bulbe — Squad B-02
*/

import { abrirHome } from "./home.js";
import { abrirTelaHU01 } from "./hu01.js";
import { abrirTelaHU04 } from "./hu04.js";

const parametros = new URLSearchParams(location.search);
const hu = parametros.get("hu");

if (hu === "01") {
  // index.html?hu=01&tela=resumo|calculo|duvidas
  abrirTelaHU01(parametros.get("tela") ?? "resumo");
} else if (hu === "04") {
  // index.html?hu=04&tela=inicio|economia|calculo&cliente=ID
  abrirTelaHU04(parametros.get("tela") ?? "inicio");
} else {
  // Sem ?hu=, abre a home, que leva para as telas de cada HU
  abrirHome();
}
