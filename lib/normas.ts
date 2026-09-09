import {
  Building2,
  Landmark,
  ListChecks,
  Map,
  Scale,
  Stamp,
  type LucideIcon,
} from "lucide-react";

import { type TipoNorma } from "@/data/historico-leis";

/**
 * Cor de cada tipo de norma.
 *
 * A rampa `--eixo-1..7` é sequencial e cobre pouco mais de 100° de matiz — o
 * aviso em `globals.css` vale aqui: a cor sozinha não separa vizinhos com
 * folga. Por isso os seis tipos usam passos alternados da rampa, e o tipo
 * nunca é comunicado só pela cor: o ícone e o rótulo andam sempre junto, no
 * seletor e no cabeçalho de cada cartão.
 */
export const CORES_NORMA: Record<TipoNorma, string> = {
  "Lei Ordinária": "var(--eixo-1)",
  Decreto: "var(--eixo-2)",
  "Estrutura Administrativa": "var(--eixo-3)",
  PPA: "var(--eixo-5)",
  LDO: "var(--eixo-6)",
  LOA: "var(--eixo-7)",
};

export const ICONES_NORMA: Record<TipoNorma, LucideIcon> = {
  "Lei Ordinária": Scale,
  Decreto: Stamp,
  "Estrutura Administrativa": Building2,
  PPA: Map,
  LDO: ListChecks,
  LOA: Landmark,
};

export const DESCRICOES_NORMA: Record<TipoNorma, string> = {
  "Lei Ordinária":
    "Leis aprovadas pela Assembleia Legislativa em matéria ambiental e climática: fundos, programas e políticas do setor.",
  Decreto:
    "Atos do governador que regulamentam as leis, instituem comitês e declaram situações de emergência ambiental.",
  "Estrutura Administrativa":
    "Leis que criam e reorganizam os órgãos ambientais do Estado e as carreiras de seus servidores.",
  PPA: "Plano Plurianual. Define os programas e as metas do Estado para um período de quatro anos.",
  LDO: "Lei de Diretrizes Orçamentárias. Fixa as prioridades que a lei orçamentária do ano seguinte deve atender.",
  LOA: "Lei Orçamentária Anual. Estima a receita e fixa a despesa de cada órgão no exercício.",
};

/** Rótulo curto para o plural, usado nos contadores do seletor. */
export const PLURAL_NORMA: Record<TipoNorma, string> = {
  "Lei Ordinária": "leis",
  Decreto: "decretos",
  "Estrutura Administrativa": "leis",
  PPA: "planos",
  LDO: "leis",
  LOA: "leis",
};

/** "19/01/2026" a partir do ISO gravado pelo script de ingestão. */
export function dataBR(iso: string | null): string | null {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : null;
}

/** "Lei nº 4.679" — a Constituição não tem número e fica só com a espécie. */
export function titulo(especie: string, numero: string): string {
  return numero === "—" ? especie : `${especie} nº ${numero}`;
}
