"use client";

import { Building2, Layers, Leaf, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useFiltros } from "@/components/painel/filtros-context";
import { Card, CardContent } from "@/components/ui/card";
import { contarAcoes } from "@/lib/data";
import { formatCompactoBRL, formatNumero, formatPercentual } from "@/lib/format";

type Kpi = {
  titulo: string;
  valor: string;
  rotuloValor?: string;
  subtitulo: string;
  icone: LucideIcon;
};

export function KpiCards() {
  const { resumo, filtros } = useFiltros();
  const acoes = contarAcoes(filtros);

  const participacaoExclusiva =
    resumo.total > 0 ? resumo.gastoExclusivo / resumo.total : 0;

  const kpis: Kpi[] = [
    {
      titulo: "Órgãos Atuantes",
      valor: formatNumero(resumo.numeroOrgaosAtuantes),
      subtitulo: "Identificados",
      icone: Building2,
    },
    {
      titulo: "Orçamento Climático Exclusivo Planejado",
      valor: formatCompactoBRL(resumo.gastoExclusivo),
      subtitulo: `${formatPercentual(participacaoExclusiva)} do total`,
      icone: Leaf,
    },
    {
      titulo: "Dotação Exclusiva",
      valor: formatNumero(acoes.exclusivas),
      rotuloValor: "Aplicações programadas",
      subtitulo: formatCompactoBRL(resumo.gastoExclusivo),
      icone: Wallet,
    },
    {
      titulo: "Dotação Não Exclusiva",
      valor: formatNumero(acoes.naoExclusivas),
      rotuloValor: "Aplicações programadas",
      subtitulo: formatCompactoBRL(resumo.gastoNaoExclusivo),
      icone: Layers,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icone = kpi.icone;
        return (
          <Card key={kpi.titulo} className="relative gap-0 overflow-hidden">
            {/* Marca d'água: sangra pelas bordas e é recortada pelo rounded-xl
                do cartão. Decorativo, então fora da árvore de acessibilidade —
                não acrescenta nada ao que o texto já diz.
                Vem antes do texto para ficar atrás dele sem z-index negativo,
                que em alguns navegadores some atrás do fundo do cartão.
                Opacidade maior no escuro: lá o primary é verde claro (#4ade80)
                e precisa de mais alfa para o mesmo peso visual. */}
            <Icone
              aria-hidden
              strokeWidth={1.5}
              className="pointer-events-none absolute -right-3 -bottom-4 size-28 text-primary/35 dark:text-primary/40"
            />
            {/* relative: mantém o texto acima da marca d'água. Sem o ícone
                ocupando uma coluna, o conteúdo usa a largura inteira. */}
            <CardContent className="relative">
              <p className="text-sm leading-snug font-medium text-muted-foreground">
                {kpi.titulo}
              </p>
              {/* 24px: com a sidebar ocupando 268px, o cartão fica em ~269px
                  — a 30px "R$ 200,1 MI" quebrava. */}
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                {kpi.valor}
              </p>
              {kpi.rotuloValor ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{kpi.rotuloValor}</p>
              ) : null}
              <p className="mt-1.5 text-sm font-medium text-primary">{kpi.subtitulo}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
