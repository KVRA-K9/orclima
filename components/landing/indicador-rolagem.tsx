import Link from "next/link";

/**
 * Convite de rolagem do hero: linha vertical com um traço descendo em loop e o
 * rótulo em caixa alta. Fica sempre visível e sempre animando — não reage ao
 * scroll, então não precisa de JavaScript no cliente: hover e foco são CSS.
 */
export function IndicadorRolagem({ destino }: { destino: string }) {
  return (
    <Link
      href={destino}
      aria-label="Rolar para a próxima seção"
      className="group absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {/* Trilho da linha: o traço claro é recortado por ele, e por isso parece
          nascer e morrer dentro da linha. Cresce um pouco no hover. */}
      <span
        aria-hidden
        className="relative block h-14 w-px overflow-hidden bg-white/30 transition-[height] duration-300 group-hover:h-16 group-focus-visible:h-16"
      >
        <span className="block h-3 w-full animate-descer-linha bg-white motion-reduce:hidden" />
      </span>
      {/* Sombra em vez de fundo: abaixo do rótulo está sempre a foto, escura
          nos dois temas, então a cor fixa em branco é a que funciona. */}
      <span className="text-[11px] font-medium tracking-[0.25em] text-white/75 uppercase [text-shadow:0_1px_4px_rgb(0_0_0/0.85)] transition-colors group-hover:text-white group-focus-visible:text-white">
        Role para baixo
      </span>
    </Link>
  );
}
