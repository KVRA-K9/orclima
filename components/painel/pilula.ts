/**
 * Pílula de filtro — o controle de recorte usado nas abas do painel, onde o
 * conjunto de opções é pequeno o bastante para caber na tela de uma vez.
 *
 * A cor do estado ativo é injetada por quem usa: os eixos têm cor própria
 * (`aba-ods.tsx`), e o resto cai no `PILULA_ATIVA` neutro.
 */
export const PILULA_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

export const PILULA_INATIVA = "border-border text-muted-foreground hover:bg-muted";

export const PILULA_ATIVA = "border-foreground bg-foreground text-background";
