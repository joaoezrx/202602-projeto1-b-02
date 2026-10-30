
/*
  Carregamento inicial das telas
  Projeto Bulbe — Squad B-02
*/

import { abrirTelaHU01 } from "./hu01.js";
import { abrirTelaHU04 } from "./hu04.js";

const parametros = new URLSearchParams(location.search);

if (parametros.get("hu") === "04") {
  // index.html?hu=04&tela=inicio|economia|calculo&cliente=ID
  abrirTelaHU04(parametros.get("tela") ?? "inicio");
} else {
  // Abre a Tela A (resumo da fatura) ao iniciar
  abrirTelaHU01("resumo");
}
