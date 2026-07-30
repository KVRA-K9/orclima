"use client";

import { formatBRL, formatPercentual } from "@/lib/format";

export type ItemDica = {
  rotulo: string;
  valor: number;
  cor: string;
  participacao?: number;
};

/**
 * Corpo da dica de contexto (tooltip) dos gráficos. Os textos usam tokens de
 * tinta; a cor da série aparece só no marcador ao lado — nunca no texto.
 */
export function CorpoDica({
  titulo,
  itens,
  total,
}: {
  titulo: string;
  itens: ItemDica[];
  total?: number;
}) {
  return (
    <div className="min-w-52 rounded-lg border border-border bg-popover px-3 py-2.5 text-popover-foreground shadow-md">
      <p className="text-sm leading-snug font-medium">{titulo}</p>
      <ul className="mt-2 space-y-1.5">
        {itens.map((item) => (
          <li key={item.rotulo} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.cor }}
            />
            <span className="text-muted-foreground">{item.rotulo}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatBRL(item.valor)}
            </span>
          </li>
        ))}
      </ul>
      {total !== undefined && itens.length > 1 ? (
        <p className="mt-2 flex justify-between border-t border-border pt-2 text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-semibold tabular-nums">{formatBRL(total)}</span>
        </p>
      ) : null}
      {itens.length === 1 && itens[0].participacao !== undefined ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formatPercentual(itens[0].participacao)} do recorte atual
        </p>
      ) : null}
    </div>
  );
}
