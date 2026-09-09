"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CorpoDica } from "@/components/painel/graficos/dica";
import { MolduraGrafico } from "@/components/painel/graficos/moldura";
import { EXERCICIOS_EM_CRUZEIRO, SERIE_LOA } from "@/data/historico-leis";
import { formatCompacto } from "@/lib/format";

// Os mesmos tokens semânticos usados na composição do painel: apontam para os
// extremos da rampa, que é o par com separação suficiente nos dois temas.
const CORES = {
  rp: "var(--exclusivo)",
  outrasFontes: "var(--nao-exclusivo)",
} as const;

const ROTULOS = {
  rp: "Recursos próprios",
  outrasFontes: "Outras fontes",
} as const;

/*
 * O recorte da pandemia neste gráfico, alinhado ao do painel do OCAD.
 *
 * Vai até 2024 porque o que se quer marcar é o efeito orçamentário, que
 * sobrevive ao fim da emergência: no Brasil a ESPIN foi encerrada em maio de
 * 2022 e a emergência internacional em maio de 2023. O aviso abaixo do gráfico
 * diz as duas datas, para a moldura não passar por marco oficial.
 */
const PANDEMIA_INICIO = 2020;
const PANDEMIA_FIM = 2024;
const PANDEMIA_TEXTO =
  "Emergência declarada em março de 2020, encerrada no Brasil em maio de 2022 (Portaria GM/MS nº 913/2022) e pela OMS em maio de 2023. O recorte vai até 2024 pelos efeitos orçamentários, que sobrevivem ao fim da emergência.";
const PANDEMIA_TITULO = `Pandemia de COVID-19 nos exercícios de ${PANDEMIA_INICIO} a ${PANDEMIA_FIM}`;

/** Espaço reservado acima da moldura para o rótulo "COVID-19". */
const PANDEMIA_FOLGA_TOPO = 18;
/** Quanto a moldura desce abaixo do eixo, para passar sob os rótulos de ano. */
const PANDEMIA_ALCANCE_ABAIXO = 40;
/**
 * O retângulo que o Recharts entrega para a área de referência não coincide
 * com as bordas das faixas: ele nasce 4px à esquerda delas. Medido em 1024px e
 * em 1440px de viewport, o desvio é o mesmo nos dois, então é constante e não
 * proporcional. Sem corrigir, a borda direita cortava o rótulo do último ano.
 */
const AJUSTE_FAIXA = 4;

/** Anos abrangidos pelo recorte, usado para deduzir a largura de uma faixa. */
const PANDEMIA_ANOS = PANDEMIA_FIM - PANDEMIA_INICIO + 1;
/**
 * Largura de um rótulo de ano em pé, com folga. Abaixo disso o rótulo é mais
 * largo que a própria faixa e transborda para a vizinha: nenhuma borda
 * vertical consegue contê-lo, e a moldura desiste de descer.
 */
const LARGURA_ROTULO = 16;

/*
 * A moldura é justa ao período: ocupa a largura da faixa menos uma folga de
 * 2px, então não encosta nas colunas vizinhas e, sendo retângulo, também não
 * corta nenhuma barra de dentro. Desce abaixo do eixo para envolver também os
 * anos marcados.
 *
 * É esse envolvimento que obriga os rótulos a ficarem em pé (`angle={-90}`).
 * A 45° o texto sai na diagonal e ocupa cerca de 30px de largura numa faixa de
 * 31px: sobra menos de 2px entre um ano e o vizinho, e qualquer borda vertical
 * acaba cortando o primeiro ou o último rótulo do recorte. Em pé, cada rótulo
 * ocupa 14px e fica bem dentro da sua faixa, o que deixa 6px de folga à
 * esquerda e 14px à direita da moldura.
 *
 * Duas medidas dependem uma da outra e não devem ser mexidas isoladamente:
 * `height` do XAxis (64) precisa caber o texto em pé, e `PANDEMIA_ALCANCE_ABAIXO`
 * precisa passar dos rótulos sem estourar a altura do SVG.
 */
function geometriaPandemia(x: number, y: number, width: number, height: number) {
  const topo = y + PANDEMIA_FOLGA_TOPO;
  // Num gráfico estreito a faixa fica menor que o rótulo, e aí a moldura para
  // na linha do eixo em vez de descer: melhor não abraçar os anos do que
  // abraçá-los cortando o primeiro.
  const cabeOsRotulos = width / PANDEMIA_ANOS >= LARGURA_ROTULO;
  const base = y + height + (cabeOsRotulos ? PANDEMIA_ALCANCE_ABAIXO : 0);
  return {
    x: x + AJUSTE_FAIXA,
    y: topo,
    width: Math.max(0, width),
    height: Math.max(0, base - topo),
    rx: 16,
    ry: 16,
    meio: x + width / 2,
    topo,
  };
}

/**
 * A marca do período, em duas camadas: a mancha vai atrás das barras e o
 * contorno por cima delas. Nenhuma das duas recebe ponteiro — as barras de
 * dentro seguem inteiras para a dica e para o clique que leva à lei —, e a
 * explicação fica no aviso fixo abaixo do gráfico.
 */
function MarcaPandemia({
  x,
  y,
  width,
  height,
  camada,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  camada: "mancha" | "contorno";
}) {
  if (x == null || y == null || width == null || height == null) return null;

  const { meio, topo, ...moldura } = geometriaPandemia(x, y, width, height);

  return (
    <g role="img" style={{ pointerEvents: "none" }}>
      <title>{`${PANDEMIA_TITULO}. ${PANDEMIA_TEXTO}`}</title>
      {camada === "mancha" ? (
        <rect {...moldura} fill="var(--destructive)" fillOpacity={0.07} />
      ) : (
        <>
          <rect
            {...moldura}
            fill="none"
            stroke="var(--destructive)"
            strokeOpacity={0.75}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <text
            x={meio}
            y={topo - 7}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
            fill="var(--destructive)"
          >
            COVID-19
          </text>
        </>
      )}
    </g>
  );
}

export function GraficoSerieLOA({
  exercicioEmFoco,
  aoEscolherExercicio,
}: {
  exercicioEmFoco: number | null;
  aoEscolherExercicio: (exercicio: number) => void;
}) {
  const primeiro = SERIE_LOA[0]?.exercicio;
  const ultimo = SERIE_LOA[SERIE_LOA.length - 1]?.exercicio;

  return (
    <MolduraGrafico
      titulo="A dotação dos órgãos ambientais, exercício a exercício"
      descricao={`Soma das dotações dos órgãos ambientais em cada Lei Orçamentária Anual, de ${primeiro} a ${ultimo}. Clique numa barra para abrir a lei daquele exercício.`}
      altura={340}
      rodape={
        <div className="mt-4 space-y-3">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {(["rp", "outrasFontes"] as const).map((chave) => (
              <li key={chave} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: CORES[chave] }}
                />
                <span className="text-muted-foreground">{ROTULOS[chave]}</span>
              </li>
            ))}
          </ul>
          {/* Aviso da pandemia: repete o tracejado da moldura para ligar o
              texto ao desenho — a marca no gráfico não tem ponteiro, então é
              aqui que ela se explica. */}
          <p
            className="flex items-start gap-2 rounded-lg px-2.5 py-2 text-xs leading-relaxed"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--destructive) 8%, transparent)",
            }}
          >
            <svg
              aria-hidden
              viewBox="0 0 18 12"
              className="mt-0.5 size-[18px] shrink-0"
            >
              <rect
                x="1"
                y="1"
                width="16"
                height="10"
                rx="3"
                ry="3"
                fill="none"
                stroke="var(--destructive)"
                strokeOpacity={0.75}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            </svg>
            <span>
              <span className="font-medium text-foreground">
                {PANDEMIA_TITULO}.
              </span>{" "}
              <span className="text-muted-foreground">{PANDEMIA_TEXTO}</span>
            </span>
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Os exercícios de {EXERCICIOS_EM_CRUZEIRO[0]} a{" "}
            {EXERCICIOS_EM_CRUZEIRO[EXERCICIOS_EM_CRUZEIRO.length - 1]} foram
            orçados em cruzeiro e ficaram de fora do gráfico. Converter aqueles
            valores para real por um fator fixo daria um número sem sentido,
            porque a inflação da época corroía o dinheiro mês a mês. Eles estão
            na lista abaixo, na moeda em que foram escritos.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Esta série soma o que coube aos órgãos e fundos da área ambiental em
            cada exercício. O restante do painel usa outro recorte, por eixo
            temático, que alcança dotações climáticas de qualquer secretaria.
            Por isso os dois totais não batem.
          </p>
        </div>
      }
    >
      <BarChart
        data={SERIE_LOA}
        // O topo precisa de folga: com 8, o rótulo mais alto do eixo Y encosta
        // na borda do SVG e sai cortado.
        margin={{ top: 16, right: 8, left: 8, bottom: 0 }}
        onClick={(estado) => {
          const rotulo = Number(estado?.activeLabel);
          if (Number.isFinite(rotulo)) aoEscolherExercicio(rotulo);
        }}
        className="cursor-pointer"
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="exercicio"
          tickLine={false}
          axisLine={false}
          // Sem `interval={0}`: forçar os 32 anos cabe no desktop, mas num
          // celular de 390px sobram 9px por ano e os rótulos viram um borrão.
          // Deixando o Recharts decidir, ele mostra todos quando cabem e vai
          // raleando conforme aperta, sempre preservando o primeiro e o último.
          interval="preserveStartEnd"
          angle={-90}
          textAnchor="end"
          height={64}
          fontSize={11}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          tickFormatter={(valor: number) => formatCompacto(valor)}
          tickLine={false}
          axisLine={false}
          // 64 não cabia "260,0 MI" numa linha só — o rótulo quebrava em duas.
          width={76}
          fontSize={12}
          stroke="var(--muted-foreground)"
        />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const ponto = payload[0].payload as (typeof SERIE_LOA)[number];
            return (
              <CorpoDica
                titulo={`Exercício ${label}, Lei nº ${ponto.numero}`}
                itens={[
                  { rotulo: ROTULOS.rp, valor: ponto.rp, cor: CORES.rp },
                  {
                    rotulo: ROTULOS.outrasFontes,
                    valor: ponto.outrasFontes,
                    cor: CORES.outrasFontes,
                  },
                ]}
                total={ponto.total}
              />
            );
          }}
        />
        {/* Anotação, não série: fica fora da legenda e da dica, e não entra no
            empilhamento. São duas camadas porque as barras ficam no meio delas
            — a mancha em zIndex 100, atrás das barras (300), e o contorno em
            350, à frente delas e atrás do eixo (500), para os rótulos de ano
            ficarem por cima. */}
        <ReferenceArea
          x1={PANDEMIA_INICIO}
          x2={PANDEMIA_FIM}
          shape={(props) => <MarcaPandemia {...props} camada="mancha" />}
        />
        <ReferenceArea
          x1={PANDEMIA_INICIO}
          x2={PANDEMIA_FIM}
          zIndex={350}
          shape={(props) => <MarcaPandemia {...props} camada="contorno" />}
        />
        {(["rp", "outrasFontes"] as const).map((chave, indice) => (
          <Bar
            key={chave}
            dataKey={chave}
            stackId="loa"
            name={ROTULOS[chave]}
            radius={indice === 1 ? [4, 4, 0, 0] : undefined}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {SERIE_LOA.map((ponto) => (
              <Cell
                key={ponto.exercicio}
                fill={CORES[chave]}
                // O exercício escolhido fica cheio e os demais recuam: o
                // gráfico passa a dizer onde a lista parou.
                fillOpacity={
                  exercicioEmFoco === null || exercicioEmFoco === ponto.exercicio
                    ? 1
                    : 0.3
                }
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </MolduraGrafico>
  );
}
