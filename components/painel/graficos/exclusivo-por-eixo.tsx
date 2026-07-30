"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { useFiltros } from "@/components/painel/filtros-context";
import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { exclusivoPorEixo } from "@/lib/data";
import { formatCompacto } from "@/lib/format";

// Tokens semânticos, não `--eixo-1`/`--eixo-2` direto — ver comentário em
// globals.css sobre por que o par binário usa os extremos da rampa.
const SERIES = [
  { chave: "exclusivo" as const, rotulo: "Exclusivo", cor: "var(--exclusivo)" },
  { chave: "naoExclusivo" as const, rotulo: "Não exclusivo", cor: "var(--nao-exclusivo)" },
];

export function GraficoExclusivoPorEixo() {
  const { orgaosFiltrados } = useFiltros();
  const dados = exclusivoPorEixo(orgaosFiltrados);

  return (
    <MolduraGrafico
      titulo="Exclusivo × Não exclusivo por eixo"
      descricao="Divisão estimada em cada eixo — a fonte informa a classificação no nível do órgão, rateada aqui pela fatia do eixo."
      altura={320}
      className="lg:col-span-3"
      rodape={
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {SERIES.map((serie) => (
            <li key={serie.chave} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: serie.cor }}
              />
              <span className="text-muted-foreground">{serie.rotulo}</span>
            </li>
          ))}
        </ul>
      }
    >
      <BarChart data={dados} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
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
                itens={SERIES.map((serie) => ({
                  rotulo: serie.rotulo,
                  valor: eixo[serie.chave],
                  cor: serie.cor,
                }))}
                total={eixo.exclusivo + eixo.naoExclusivo}
              />
            );
          }}
        />
        {SERIES.map((serie, indice) => (
          <Bar
            key={serie.chave}
            dataKey={serie.chave}
            stackId="eixo"
            fill={serie.cor}
            maxBarSize={64}
            animationDuration={750}
            animationEasing="ease-out"
            // 2px de respiro entre os segmentos empilhados, na cor da superfície.
            stroke="var(--card)"
            strokeWidth={2}
            radius={indice === SERIES.length - 1 ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </MolduraGrafico>
  );
}
