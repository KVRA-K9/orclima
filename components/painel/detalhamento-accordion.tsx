"use client";

import { useMemo } from "react";

import { useFiltros } from "@/components/painel/filtros-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EIXOS } from "@/data/eixos";
import { formatBRL } from "@/lib/format";
import type { Aplicacao, Orgao } from "@/lib/types";

export function DetalhamentoAccordion() {
  const { orgaosFiltrados, filtros, aplicacoesDe } = useFiltros();

  const orgaos = useMemo(
    () => [...orgaosFiltrados].sort((a, b) => b.total - a.total),
    [orgaosFiltrados],
  );

  if (orgaos.length === 0) {
    return (
      <p className="py-14 text-center text-sm text-muted-foreground">
        Nenhum órgão corresponde aos filtros selecionados.
      </p>
    );
  }

  return (
    <Accordion type="multiple">
      {orgaos.map((orgao) => (
        <ItemOrgao
          key={orgao.nome}
          orgao={orgao}
          filtroEixo={filtros.eixo}
          aplicacoes={aplicacoesDe(orgao.nome)}
        />
      ))}
    </Accordion>
  );
}

function ItemOrgao({
  orgao,
  filtroEixo,
  aplicacoes,
}: {
  orgao: Orgao;
  filtroEixo: number | null;
  aplicacoes: Record<string, Aplicacao[]>;
}) {
  const eixosPresentes = Object.keys(orgao.eixos)
    .map(Number)
    .sort((a, b) => a - b);

  const rotuloTotal =
    filtroEixo != null
      ? `Total por Eixo Temático (Eixo ${EIXOS.find((e) => e.numero === filtroEixo)?.romano ?? filtroEixo})`
      : "Total Orçamentário";

  return (
    <AccordionItem value={orgao.nome}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-2">
          <span className="text-left">
            <span className="block font-medium">{orgao.sigla}</span>
            <span className="block text-xs text-muted-foreground">{orgao.codigo}</span>
          </span>
          <span className="flex items-center gap-3">
            <span className="flex flex-wrap gap-1">
              {eixosPresentes.map((numero) => {
                const eixo = EIXOS.find((e) => e.numero === numero);
                return (
                  <span
                    key={numero}
                    title={eixo?.rotulo}
                    className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs"
                  >
                    <span
                      aria-hidden
                      className="size-2 rounded-[2px]"
                      style={{ backgroundColor: eixo?.cor }}
                    />
                    {eixo?.romano ?? numero}
                  </span>
                );
              })}
            </span>
            <span className="font-medium tabular-nums">{formatBRL(orgao.total)}</span>
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent>
        <Accordion
          type="multiple"
          className="ml-1 border-l border-border pl-4"
        >
          {eixosPresentes.map((numero) => {
            const eixo = EIXOS.find((e) => e.numero === numero);
            const itens = aplicacoes[String(numero)] ?? [];
            if (itens.length === 0) return null;
            return (
              <AccordionItem key={numero} value={`${orgao.nome}|${numero}`}>
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex flex-1 items-center justify-between gap-2 pr-2 text-sm">
                    <span className="text-left">{eixo?.rotulo ?? `Eixo ${numero}`}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatBRL(orgao.eixos[String(numero)] ?? 0)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {itens.map((item, i) => (
                      <li key={i} className="flex items-start justify-between gap-3 text-sm">
                        <span className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-1.5 size-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                item.tipo === "Exclusivo"
                                  ? "var(--exclusivo)"
                                  : "var(--nao-exclusivo)",
                            }}
                          />
                          {item.aplicacao}
                        </span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {formatBRL(item.dotacao)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Orçamento Exclusivo:{" "}
            <strong className="text-foreground">{formatBRL(orgao.exclusivo)}</strong>
          </span>
          <span>
            Orçamento Não Exclusivo:{" "}
            <strong className="text-foreground">{formatBRL(orgao.naoExclusivo)}</strong>
          </span>
          <span>
            {rotuloTotal}:{" "}
            <strong className="text-foreground">{formatBRL(orgao.total)}</strong>
          </span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
