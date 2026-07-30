"use client";

import { useFiltros } from "@/components/painel/filtros-context";
import { ORCAMENTO } from "@/lib/data";

/**
 * Faixa de contexto no topo do painel: nomeia a seção aberta e diz, em uma
 * frase, o que ela mostra. Os valores de `aba` são os mesmos da sidebar e de
 * `painel-conteudo.tsx`.
 */
const SECOES: Record<string, { titulo: string; descricao: string }> = {
  analises: {
    titulo: "Visão Geral",
    descricao: `Síntese da dotação climática do exercício ${ORCAMENTO.exercicio}, separando a despesa exclusiva — de finalidade integralmente climática — da não exclusiva, que contribui apenas em parte. Fonte: ${ORCAMENTO.fonte}.`,
  },
  acoes: {
    titulo: "Tabela Detalhada",
    descricao:
      "Dotação climática por órgão, com a opção de abrir cada eixo temático até a aplicação programada. Exportável em CSV e PDF.",
  },
  instrumentos: {
    titulo: "Instrumentos Legais",
    descricao:
      "Base normativa do Orçamento Climático do Estado do Acre: leis, decretos, planos e documentos técnicos que sustentam a metodologia.",
  },
  ods: {
    titulo: "ODS",
    descricao:
      "Alinhamento do Orçamento Climático aos Objetivos de Desenvolvimento Sustentável da Agenda 2030, com o eixo temático a que cada indicador se relaciona.",
  },
};

export function PainelBanner() {
  const { aba } = useFiltros();
  const secao = SECOES[aba] ?? SECOES.analises;

  return (
    <section className="rounded-xl bg-accent px-6 py-4">
      <h1 className="text-sm font-semibold text-accent-foreground">{secao.titulo}</h1>
      <p className="mt-1 max-w-5xl text-sm leading-relaxed text-muted-foreground">
        {secao.descricao}
      </p>
    </section>
  );
}
