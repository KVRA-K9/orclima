"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { useFiltros } from "@/components/painel/filtros-context";
import { composicao } from "@/lib/data";
import { useI18n } from "@/lib/i18n/cliente";
import { formatCompactoBRL, formatPercentual } from "@/lib/format";

// Tokens semânticos, não `--eixo-1`/`--eixo-2` direto: os aliases apontam para
// os extremos da rampa, que é o que garante duas fatias distinguíveis.
const CORES = {
  exclusivo: "var(--exclusivo)",
  naoExclusivo: "var(--nao-exclusivo)",
} as const;

export function GraficoComposicao() {
  const { orgaosFiltrados, resumo } = useFiltros();
  const { t, lang } = useI18n();
  const textos = t.painel.graficos.composicao;

  const rotuloDaFatia = (chave: keyof typeof CORES) =>
    chave === "exclusivo"
      ? t.dados.tipoDotacao["Exclusivo"]
      : t.dados.tipoDotacao["Não Exclusivo"];

  const dados = composicao(orgaosFiltrados).filter((d) => d.valor > 0);

  return (
    <MolduraGrafico
      titulo={textos.titulo}
      descricao={textos.descricao}
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
              <span>{rotuloDaFatia(fatia.chave)}</span>
              <span className="ml-auto font-medium tabular-nums">
                {formatCompactoBRL(fatia.valor, lang)}
              </span>
              <span className="w-14 text-right text-muted-foreground tabular-nums">
                {formatPercentual(resumo.total > 0 ? fatia.valor / resumo.total : 0, 1, lang)}
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
          animationDuration={800}
          animationEasing="ease-out"
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
                titulo={rotuloDaFatia(chave)}
                itens={[
                  {
                    rotulo: textos.valor,
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
