"use client";

import { useEffect } from "react";

/**
 * Aplica a mesma animação de entrada da primeira dobra (`.revelar-entrada`) nos
 * blocos marcados com `data-revelar`, no momento em que eles chegam à tela.
 *
 * Por que um observador e não `animation-timeline: view()`, que era o
 * mecanismo anterior:
 *
 * - **Cascata.** A animação de rolagem do CSS é posicional: itens de uma mesma
 *   linha da grade compartilham a posição e entram todos juntos. Aqui os que
 *   chegam no mesmo lote são ordenados e escalonados, como no carregamento.
 * - **Firefox.** `animation-timeline` ainda não existe lá; a página ficava
 *   estática. `IntersectionObserver` funciona em todos.
 * - **Um gesto só.** Carregamento e rolagem passam a usar exatamente a mesma
 *   animação, em vez de dois caminhos que precisam ser mantidos iguais.
 *
 * Monta uma vez, na raiz, e acompanha a árvore: o painel troca de aba e
 * re-renderiza por filtro, então há blocos que nascem muito depois desta
 * montagem. Ver `observadorDeNovos` abaixo.
 *
 * Não renderiza nada.
 */
export function RevelarAoRolar() {
  useEffect(() => {
    const raiz = document.documentElement;
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (semMovimento.matches || typeof IntersectionObserver === "undefined") return;

    // Só agora o CSS passa a esconder os blocos. A regra depende desta classe
    // de propósito: sem JavaScript — ou se este bundle falhar — nada é
    // escondido, e o conteúdo aparece normalmente. Numa ferramenta pública,
    // conteúdo permanentemente invisível é pior que animação ausente.
    raiz.classList.add("revelar-pronto");

    const observador = new IntersectionObserver(
      (entradas) => {
        const chegando = entradas
          .filter((e) => e.isIntersecting)
          // Ordem de leitura: de cima para baixo, e da esquerda para a direita
          // dentro da mesma linha. É o que faz a grade cascatear em vez de
          // acender inteira.
          .sort((a, b) => {
            const dy = a.boundingClientRect.top - b.boundingClientRect.top;
            return Math.abs(dy) > 8 ? dy : a.boundingClientRect.left - b.boundingClientRect.left;
          });

        chegando.forEach((entrada, ordem) => {
          const alvo = entrada.target as HTMLElement;
          alvo.style.animationDelay = `${ordem * 80}ms`;
          alvo.classList.add("revelar-entrada");
          observador.unobserve(alvo);
        });
      },
      // Espera o bloco entrar de fato, e não apenas encostar na borda inferior.
      { rootMargin: "0px 0px -12% 0px" },
    );

    const observar = (raizDaBusca: ParentNode) => {
      if (raizDaBusca instanceof Element && raizDaBusca.hasAttribute("data-revelar")) {
        observador.observe(raizDaBusca);
      }
      raizDaBusca.querySelectorAll("[data-revelar]").forEach((no) => observador.observe(no));
    };

    observar(document);

    // Sem isto, só os blocos presentes nesta montagem seriam observados — e
    // como este componente vive no layout, ele monta uma vez por sessão. Tudo
    // que aparecesse depois (troca de aba do painel, re-render por filtro)
    // ficaria preso em `opacity: 0`, porque a regra que esconde só solta quem
    // recebe `.revelar-entrada`, e quem aplica essa classe é o observador.
    const observadorDeNovos = new MutationObserver((mutacoes) => {
      for (const mutacao of mutacoes) {
        for (const no of mutacao.addedNodes) {
          if (no instanceof Element) observar(no);
        }
      }
    });

    observadorDeNovos.observe(document.body, { childList: true, subtree: true });

    return () => {
      observadorDeNovos.disconnect();
      observador.disconnect();
      raiz.classList.remove("revelar-pronto");
    };
  }, []);

  return null;
}
