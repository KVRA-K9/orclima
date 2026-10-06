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
