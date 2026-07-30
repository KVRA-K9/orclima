"use client";

import { AbaAnalises } from "@/components/painel/aba-analises";
import { AbaDetalhamento } from "@/components/painel/aba-detalhamento";
import { AbaInstrumentos } from "@/components/painel/aba-instrumentos";
import { AbaOds } from "@/components/painel/aba-ods";
import { useFiltros } from "@/components/painel/filtros-context";

/**
 * Renderiza a seção ativa. A navegação vive em `painel-sidebar.tsx` — os
 * valores de `aba` são os mesmos nos dois lugares e continuam na query string.
 */
export function PainelConteudo() {
  const { aba } = useFiltros();

  switch (aba) {
    case "acoes":
      return <AbaDetalhamento />;
    case "instrumentos":
      return <AbaInstrumentos />;
    case "ods":
      return <AbaOds />;
    default:
      return <AbaAnalises />;
  }
}
