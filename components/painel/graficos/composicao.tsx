"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { useFiltros } from "@/components/painel/filtros-context";
import { composicao } from "@/lib/data";
import { formatCompactoBRL, formatPercentual } from "@/lib/format";

// Tokens semânticos, não `--eixo-1`/`--eixo-2` direto: os aliases apontam para
// os extremos da rampa, que é o que garante duas fatias distinguíveis.
const CORES = {
  exclusivo: "var(--exclusivo)",
  naoExclusivo: "var(--nao-exclusivo)",
} as const;

export function GraficoComposicao() {
  const { orgaosFiltrados, resumo } = useFiltros();
  const dados = composicao(orgaosFiltrados).filter((d) => d.valor > 0);

  return (
    <MolduraGrafico
      titulo="Composição do Orçamento Climático"
      descricao="Dotação exclusivamente climática frente à parcela que contribui de forma parcial."
      altura={260}
      rodape={
        <ul className="mt-4 space-y-2">
          {dados.map((fatia) => (
            <li key={fatia.chave} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: CORES[fatia.chave] }}
              />
              <span>{fatia.nome}</span>
              <span className="ml-auto font-medium tabular-nums">
                {formatCompactoBRL(fatia.valor)}
              </span>
              <span className="w-14 text-right text-muted-foreground tabular-nums">
                {formatPercentual(resumo.total > 0 ? fatia.valor / resumo.total : 0)}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          innerRadius="58%"
          outerRadius="86%"
          paddingAngle={2}
          strokeWidth={2}
          stroke="var(--card)"
          isAnimationActive={false}
        >
          {dados.map((fatia) => (
            <Cell key={fatia.chave} fill={CORES[fatia.chave]} />
          ))}
        </Pie>
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0];
            const chave = (item.payload as { chave: keyof typeof CORES }).chave;
            const valor = Number(item.value ?? 0);
            return (
              <CorpoDica
                titulo={String(item.name)}
                itens={[
                  {
                    rotulo: "Valor",
                    valor,
                    cor: CORES[chave],
                    participacao: resumo.total > 0 ? valor / resumo.total : 0,
                  },
                ]}
              />
            );
          }}
        />
      </PieChart>
    </MolduraGrafico>
  );
}
