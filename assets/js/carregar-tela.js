
/* =========================================
   BULBE — CARREGAMENTO DAS TELAS
   ========================================= */

async function carregarTela(caminho) {
  const conteudo = document.getElementById("conteudo-principal");

  if (!conteudo) {
    console.error("Área de conteúdo não encontrada.");
    return;
  }

  try {
    const resposta = await fetch(caminho);

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar a tela.");
    }

    const html = await resposta.text();

    // Coloca a tela dentro do template
    conteudo.innerHTML = html;

    // Volta a rolagem para o início
    conteudo.scrollTop = 0;

  } catch (erro) {
    conteudo.textContent = "Erro ao carregar a página.";
    console.error(erro);
  }
}

// Carrega a primeira tela da HU01
carregarTela("pages/hu01-resumo.html");
