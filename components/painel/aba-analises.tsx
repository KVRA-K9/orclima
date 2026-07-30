"use client";

import { useFiltros } from "@/components/painel/filtros-context";
import { GraficoComposicao } from "@/components/painel/graficos/composicao";
import { GraficoExclusivoPorEixo } from "@/components/painel/graficos/exclusivo-por-eixo";
import { GraficoPorEixo } from "@/components/painel/graficos/por-eixo";
import { GraficoPorOrgao } from "@/components/painel/graficos/por-orgao";
import { KpiCards } from "@/components/painel/kpi-cards";
import { Card, CardContent } from "@/components/ui/card";

export function AbaAnalises() {
  const { orgaosFiltrados } = useFiltros();

  if (orgaosFiltrados.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          Nenhum órgão corresponde aos filtros selecionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Os KPIs saíram do topo do painel e passaram a viver aqui: só fazem
          sentido junto dos gráficos, e não nas abas de tabela, ODS e
          instrumentos. */}
      <KpiCards />
      <div className="grid gap-4 lg:grid-cols-3">
        <GraficoComposicao />
        <GraficoPorEixo />
        <GraficoExclusivoPorEixo />
        <GraficoPorOrgao />
      </div>
    </div>
  );
}
