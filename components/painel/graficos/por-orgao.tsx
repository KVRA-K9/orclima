"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useFiltros } from "@/components/painel/filtros-context";
import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { totaisPorOrgao } from "@/lib/data";
import { formatCompacto } from "@/lib/format";

const ALTURA_BARRA = 26;

export function GraficoPorOrgao() {
  const { orgaosFiltrados } = useFiltros();
  const dados = totaisPorOrgao(orgaosFiltrados);

  // Uma barra por órgão; com 58 unidades o cartão rola verticalmente em vez de
  // espremer os rótulos.
  const altura = Math.max(240, dados.length * ALTURA_BARRA + 24);

  return (
    <MolduraGrafico
      titulo="Orçamento por Secretaria"
      descricao={`${dados.length} ${dados.length === 1 ? "órgão" : "órgãos"} no recorte atual, do maior para o menor.`}
      altura={altura}
      className="lg:col-span-3 [&_[data-slot=card-content]]:max-h-[28rem] [&_[data-slot=card-content]]:overflow-y-auto"
    >
      <BarChart
        data={dados}
        layout="vertical"
        margin={{ top: 0, right: 56, bottom: 0, left: 8 }}
        barCategoryGap={6}
      >
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          tickFormatter={(valor: number) => formatCompacto(valor)}
        />
        <YAxis
          type="category"
          dataKey="nome"
          width={150}
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          // Vários órgãos têm nome longo (fundos, autarquias). O rótulo do eixo
          // fica curto e o nome completo aparece na dica de contexto.
          tickFormatter={(nome: string) =>
            nome.length > 24 ? `${nome.slice(0, 23)}…` : nome
          }
        />
        <Tooltip
          cursor={{ fill: "var(--surface-hover)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const orgao = payload[0].payload as (typeof dados)[number];
            return (
              <CorpoDica
                titulo={orgao.nome}
                itens={[
                  { rotulo: "Exclusivo", valor: orgao.exclusivo, cor: "var(--exclusivo)" },
                  {
                    rotulo: "Não exclusivo",
                    valor: orgao.naoExclusivo,
                    cor: "var(--nao-exclusivo)",
                  },
                ]}
                total={orgao.valor}
              />
            );
          }}
        />
        <Bar
          dataKey="valor"
          fill="var(--barra-orgao)"
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </MolduraGrafico>
  );
}
