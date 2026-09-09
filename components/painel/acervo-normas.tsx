"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import {
  TIPOS_NORMA,
  type Citacao,
  type Norma,
  type TipoNorma,
  type ValoresLOA,
} from "@/data/historico-leis";
import { formatBRL, formatCompactoBRL, formatNumero } from "@/lib/format";
import {
  CORES_NORMA,
  DESCRICOES_NORMA,
  ICONES_NORMA,
  dataBR,
  titulo,
} from "@/lib/normas";
import { cn } from "@/lib/utils";

/* ---------- seletor de tipo ---------- */

export function SeletorNormas({
  selecionado,
  totais,
  aoSelecionar,
}: {
  selecionado: TipoNorma | null;
  totais: Record<TipoNorma, number>;
  aoSelecionar: (tipo: TipoNorma | null) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TIPOS_NORMA.map((tipo) => {
        const Icone = ICONES_NORMA[tipo];
        const ativo = selecionado === tipo;
        return (
          <button
            key={tipo}
            type="button"
            aria-pressed={ativo}
            title={DESCRICOES_NORMA[tipo]}
            onClick={() => aoSelecionar(ativo ? null : tipo)}
            style={{ "--tinta": tinta(tipo, 25) } as React.CSSProperties}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl bg-(--tinta) p-3 text-center ring-1 transition-all",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              "motion-reduce:transition-none",
              ativo
                ? "scale-105 ring-primary"
                : "ring-transparent hover:scale-105 hover:ring-foreground/20",
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-background/70">
              <Icone className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-xs leading-tight font-medium">{tipo}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {totais[tipo]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- lista ---------- */

export function ListaNormas({
  normas,
  normaFoco,
}: {
  normas: Norma[];
  normaFoco?: string | null;
}) {
  // O cartão em foco vem do clique numa barra do gráfico e pode estar fora da
  // janela — rolar até ele é o que fecha o gesto.
  useEffect(() => {
    if (!normaFoco) return;
    const alvo = document.querySelector<HTMLElement>(
      `[data-norma-id="${CSS.escape(normaFoco)}"]`,
    );
    alvo?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [normaFoco]);

  if (normas.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        Nenhuma norma corresponde a esta busca.
      </p>
    );
  }

  // Colunas de CSS, não grade: numa grade, abrir um cartão estica a linha
  // inteira e deixa um vão branco ao lado dele. Com um resultado só, a segunda
  // coluna deixaria o cartão espremido em meia largura sem motivo.
  return (
    <div className={cn("gap-3", normas.length > 1 ? "columns-1 xl:columns-2" : "columns-1")}>
      {normas.map((norma) => (
        <CartaoNorma
          key={norma.id}
          norma={norma}
          destacado={norma.id === normaFoco}
        />
      ))}
    </div>
  );
}

/* ---------- cartão ---------- */

function CartaoNorma({ norma, destacado }: { norma: Norma; destacado: boolean }) {
  const [aberto, setAberto] = useState(destacado);

  // Sincroniza o cartão com o foco vindo do gráfico durante o render, sem
  // efeito: quem chega pelo gráfico encontra o cartão já aberto.
  const [eraDestacado, setEraDestacado] = useState(destacado);
  if (destacado !== eraDestacado) {
    setEraDestacado(destacado);
    setAberto(destacado);
  }

  const nome = titulo(norma.especie, norma.numero);

  // Data de assinatura e período, corridos ao lado do número em vez de em
  // etiquetas. O período é o que a norma orça, e não se confunde com a data:
  // uma LOA de dezembro de 2025 é a do exercício de 2026.
  const secundarios = [
    dataBR(norma.data),
    norma.exercicio ? `Exercício ${norma.exercicio}` : null,
    norma.quadrienio
      ? `Quadriênio ${norma.quadrienio[0]}–${norma.quadrienio[1]}`
      : null,
  ].filter(Boolean);

  return (
    <article
      data-norma-id={norma.id}
      style={
        {
          "--tinta": tinta(norma.tipo, 22),
          "--tinta-forte": tinta(norma.tipo, 38),
        } as React.CSSProperties
      }
      className={cn(
        "mb-3 break-inside-avoid rounded-xl bg-(--tinta) shadow-sm transition-all",
        "hover:bg-(--tinta-forte) hover:shadow-md motion-reduce:transition-none",
        destacado && "bg-(--tinta-forte) shadow-md ring-2 ring-ring",
      )}
    >
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-start gap-3.5 p-4 text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {/* Sem ícone de tipo aqui: dentro da lista todas as normas são do
            mesmo tipo, já anunciado pelo seletor e pela cor do cartão. */}
        <span className="min-w-0 flex-1">
          {/* Fluxo de texto, e não uma linha de itens: assim o mesmo ponto
              separa o nome da data e a data do período, e a quebra em telas
              estreitas acontece onde caberia numa frase. */}
          <span className="block">
            <span className="text-base font-semibold">{nome}</span>
            {secundarios.length ? (
              <span className="text-sm text-muted-foreground tabular-nums">
                {" · "}
                {secundarios.join(" · ")}
              </span>
            ) : null}
          </span>
          <span
            className={cn(
              "mt-1.5 block text-sm leading-relaxed text-muted-foreground",
              !aberto && "line-clamp-2",
            )}
          >
            {norma.ementa}
          </span>
        </span>
        <ChevronRight
          aria-hidden
          className={cn(
            "mt-1.5 size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
            aberto && "rotate-90",
          )}
        />
      </button>

      {aberto ? (
        <div className="space-y-3.5 border-t border-foreground/10 px-4 pt-3.5 pb-4">
          {norma.publicacao ? (
            <Detalhe rotulo="Publicação no DOE">{dataBR(norma.publicacao)}</Detalhe>
          ) : null}

          {norma.link ? (
            <Detalhe rotulo="Texto da norma">
              {/* O próprio endereço como rótulo, sem o protocolo: quem lê já
                  vê para onde vai antes de clicar. */}
              <a
                href={norma.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 break-all underline underline-offset-4 hover:text-primary"
              >
                {norma.link.replace(/^https?:\/\//, "")}
                <ExternalLink aria-hidden className="size-3.5 shrink-0" />
              </a>
            </Detalhe>
          ) : null}

          {norma.orgaos ? <Detalhe rotulo="Órgão">{norma.orgaos}</Detalhe> : null}

          {norma.abas.length > 1 ? (
            <Detalhe rotulo="Também consta em">
              {norma.abas.filter((a) => a !== norma.tipo).join(", ")}
            </Detalhe>
          ) : null}

          {norma.citacoes.length ? (
            <Detalhe rotulo="Descritores climáticos no texto">
              <Citacoes citacoes={norma.citacoes} />
            </Detalhe>
          ) : null}

          {norma.loa ? (
            <Detalhe rotulo="Dotação dos órgãos ambientais">
              <ValoresDaLOA loa={norma.loa} />
            </Detalhe>
          ) : null}

          {norma.metas.length ? (
            <Detalhe rotulo="Metas e prioridades">
              <ul className="space-y-1.5">
                {norma.metas.map((meta, i) => (
                  <li key={i} className="leading-relaxed">
                    {meta}
                  </li>
                ))}
              </ul>
            </Detalhe>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function Detalhe({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <p className="font-medium text-muted-foreground">{rotulo}</p>
      <div className="mt-1 leading-relaxed">{children}</div>
    </div>
  );
}

/* ---------- descritores ---------- */

/**
 * Quantas vezes cada termo climático aparece no texto da norma — o
 * levantamento é palavra por palavra, feito à mão sobre o PPA e a LDO.
 *
 * Barras em HTML, e não um gráfico: a escala é relativa ao maior termo da
 * própria norma, e o que importa é a ordem entre eles, não o valor absoluto.
 */
function Citacoes({ citacoes }: { citacoes: Citacao[] }) {
  const ordenadas = [...citacoes].sort((a, b) => b.total - a.total);
  const maior = ordenadas[0]?.total ?? 1;

  return (
    <ul className="space-y-1">
      {ordenadas.map((c) => (
        <li key={c.descritor} className="flex items-center gap-2">
          {/* Larga o bastante para o maior rótulo, "Biodiversidade/bioeconomia",
              caber inteiro no texto de 14px. */}
          <span className="w-52 shrink-0 truncate text-muted-foreground">
            {c.descritor}
          </span>
          <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/10">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.max(4, (c.total / maior) * 100)}%`,
                backgroundColor: "var(--eixo-3)",
              }}
            />
          </span>
          <span className="w-8 shrink-0 text-right font-medium tabular-nums">
            {formatNumero(c.total)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- valores da LOA ---------- */

function ValoresDaLOA({ loa }: { loa: ValoresLOA }) {
  const real = loa.moeda === "R$";
  const valor = (n: number) =>
    real ? formatBRL(n) : `Cr$ ${formatNumero(n)}`;

  return (
    <div className="space-y-2">
      <dl className="space-y-1">
        <Linha rotulo="Recursos próprios">{valor(loa.rp)}</Linha>
        <Linha rotulo="Outras fontes">{valor(loa.outrasFontes)}</Linha>
        <Linha rotulo="Total" forte>
          {valor(loa.total)}
        </Linha>
      </dl>
      {!real ? (
        <p className="text-muted-foreground">
          Exercício anterior ao real: os valores ficam na moeda da época e não
          entram no gráfico.
        </p>
      ) : null}
      <details className="group">
        <summary className="cursor-pointer text-muted-foreground underline-offset-4 hover:underline">
          {loa.orgaos.length} {loa.orgaos.length === 1 ? "órgão" : "órgãos"}
        </summary>
        <ul className="mt-1.5 space-y-1">
          {[...loa.orgaos]
            .sort((a, b) => b.total - a.total)
            .map((orgao, i) => (
              <li key={`${orgao.codigo ?? orgao.nome}-${i}`} className="flex gap-2">
                <span className="min-w-0 flex-1 text-muted-foreground">
                  {orgao.codigo ? `${orgao.codigo} · ` : ""}
                  {orgao.nome}
                </span>
                <span className="shrink-0 tabular-nums">
                  {real ? formatCompactoBRL(orgao.total) : formatNumero(orgao.total)}
                </span>
              </li>
            ))}
        </ul>
      </details>
    </div>
  );
}

function Linha({
  rotulo,
  forte,
  children,
}: {
  rotulo: string;
  forte?: boolean;
  children: React.ReactNode;
}) {
  return (
    // `items-baseline` porque o total vem num corpo maior que o rótulo: sem
    // isso o "Total" flutuaria no meio da altura do número.
    <div
      className={cn(
        "flex items-baseline justify-between gap-2",
        forte && "border-t border-foreground/10 pt-1.5",
      )}
    >
      <dt className={cn(forte ? "font-medium" : "text-muted-foreground")}>
        {rotulo}
      </dt>
      {/* O peso forte fica só no valor. Com o número em 18px, um rótulo
          igualmente pesado disputaria a atenção em vez de guiar até ele. */}
      <dd className={cn("tabular-nums", forte && "text-lg font-semibold")}>
        {children}
      </dd>
    </div>
  );
}

/* ---------- cor ---------- */

/** Cor do tipo diluída no fundo do cartão, para não competir com o texto. */
const tinta = (tipo: TipoNorma, porcento: number) =>
  `color-mix(in oklab, ${CORES_NORMA[tipo]} ${porcento}%, var(--card))`;
