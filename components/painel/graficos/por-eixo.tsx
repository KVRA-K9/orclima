"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useFiltros } from "@/components/painel/filtros-context";
import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { totaisPorEixo } from "@/lib/data";
import { formatCompacto } from "@/lib/format";

export function GraficoPorEixo() {
  const { orgaosFiltrados } = useFiltros();
  const dados = totaisPorEixo(orgaosFiltrados);
  const total = dados.reduce((soma, eixo) => soma + eixo.valor, 0);

  return (
    <MolduraGrafico
      titulo="Orçamento por Eixo"
      descricao="Dotação climática planejada em cada eixo temático."
      altura={320}
      className="lg:col-span-2"
      rodape={
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {dados.map((eixo) => (
            <li key={eixo.numero} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: eixo.cor }}
              />
              <span className="text-muted-foreground">
                {eixo.romano} — {eixo.titulo}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <BarChart data={dados} margin={{ top: 24, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="romano"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={76}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          tickFormatter={(valor: number) => formatCompacto(valor)}
        />
        <Tooltip
          cursor={{ fill: "var(--surface-hover)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const eixo = payload[0].payload as (typeof dados)[number];
            return (
              <CorpoDica
                titulo={`${eixo.romano} — ${eixo.titulo}`}
                itens={[
                  {
                    rotulo: "Dotação",
                    valor: eixo.valor,
                    cor: eixo.cor,
                    participacao: eixo.participacao,
                  },
                ]}
              />
            );
          }}
        />
        {/* As barras crescem do eixo X quando o cartão entra em tela — a
            moldura só monta o gráfico nesse momento. Também toca de novo a cada
            troca de filtro, o que dá retorno de que o recorte mudou. */}
        <Bar
          dataKey="valor"
          radius={[4, 4, 0, 0]}
          maxBarSize={64}
          animationDuration={750}
          animationEasing="ease-out"
        >
          {dados.map((eixo) => (
            <Cell key={eixo.numero} fill={eixo.cor} />
          ))}
          <LabelList
            dataKey="valor"
            position="top"
            offset={8}
            fill="var(--muted-foreground)"
            fontSize={11}
            // Rótulo direto só nos eixos relevantes (≥ 5% do recorte): em tela
            // estreita os sete números se sobrepõem, e o resto fica na dica de
            // contexto. Sem "R$" — o eixo Y já estabelece a unidade.
            formatter={(valor) => {
              const n = Number(valor ?? 0);
              return total > 0 && n / total >= 0.05 ? formatCompacto(n) : "";
            }}
          />
        </Bar>
      </BarChart>
    </MolduraGrafico>
  );
}
