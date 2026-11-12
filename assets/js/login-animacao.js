/*
  Animação de entrada do login — Projeto Bulbe, Squad B-02
  (animação criada pelo squad em HTML/CSS; adaptada ao frame do app)

  A logo nasce no CENTRO do app, monta letra por letra, desenha os
  traços e depois sobe para o lugar dela; o formulário entra em cascata.
  Os tempos das letras, traços e da cascata estão no login.css.

  Técnica FLIP: mede onde a logo termina, joga ela para o centro com
  transform e, no fim, anima o transform de volta para "none".
*/

(function () {
  const tela = document.getElementById('login');
  const logo = document.getElementById('logo');
  const app = document.querySelector('.app');
  if (!tela || !logo || !app) return;

  const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SOBE_EM = 2400;     // ms: quando a logo sobe do centro para o topo
  const SOBE_DURACAO = 900; // ms: duração da subida
  let timer;

  // Sem movimento: a tela aparece pronta, sem esconder nada
  if (menosMovimento) return;

  // Só agora os elementos ficam escondidos (se este script falhar, nada some)
  tela.classList.add('animando');

  function tocar() {
    clearTimeout(timer);
    tela.classList.remove('play');
    logo.style.transition = 'none';
    logo.style.transform = 'none';

    // FLIP: o "centro" é o do frame do app, não o da janela
    // (no notebook o app é uma moldura de celular no meio da tela)
    const r = logo.getBoundingClientRect();
    const a = app.getBoundingClientRect();
    const dx = a.left + a.width / 2 - (r.left + r.width / 2);
    const dy = a.top + a.height / 2 - (r.top + r.height / 2);
    logo.style.transform = `translate(${dx}px, ${dy}px) scale(1.35)`;

    void logo.offsetWidth; // força o reflow para reiniciar as animações
    tela.classList.add('play');

    // Depois das letras e dos traços, a logo sobe para o lugar dela
    timer = setTimeout(() => {
      logo.style.transition = `transform ${SOBE_DURACAO}ms cubic-bezier(.65,0,.35,1)`;
      logo.style.transform = 'none';
    }, SOBE_EM);
  }

  // Espera a fonte carregar antes de medir, senão a posição sai errada
  document.fonts.ready.then(tocar);

  // Clicar na logo repete a animação (útil para apresentar)
  logo.addEventListener('click', tocar);
})();
