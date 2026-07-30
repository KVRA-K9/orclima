"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";

import {
  APLICACOES,
  ORGAOS,
  aplicarFiltros,
  resumoDe,
  temFiltroAtivo,
} from "@/lib/data";
import {
  FILTROS_VAZIOS,
  type Aplicacao,
  type Filtros,
  type Orgao,
  type ResumoOrcamento,
  type TipoDotacao,
} from "@/lib/types";

/** Valor usado nos <Select> para "sem restrição" — Radix não aceita item vazio. */
export const TODOS = "todos";

export const PARAMS = {
  exercicio: "ano",
  eixo: "eixo",
  orgao: "orgao",
  tipo: "tipo",
  busca: "q",
  aba: "aba",
} as const;

type Contexto = {
  filtros: Filtros;
  orgaosFiltrados: Orgao[];
  resumo: ResumoOrcamento;
  ativo: boolean;
  definir: (parciais: Partial<Filtros>) => void;
  limpar: () => void;
  aba: string;
  definirAba: (aba: string) => void;
  /** Aplicações de um órgão, já reduzidas ao eixo filtrado quando há um ativo. */
  aplicacoesDe: (orgao: string) => Record<string, Aplicacao[]>;
};

const FiltrosContext = createContext<Contexto | null>(null);

function lerFiltros(params: URLSearchParams): Filtros {
  const numero = (chave: string) => {
    const bruto = params.get(chave);
    if (!bruto) return null;
    const n = Number(bruto);
    return Number.isFinite(n) ? n : null;
  };
  const tipo = params.get(PARAMS.tipo);

  return {
    exercicio: numero(PARAMS.exercicio),
    eixo: numero(PARAMS.eixo),
    orgao: params.get(PARAMS.orgao) || null,
    tipo: tipo === "Exclusivo" || tipo === "Não Exclusivo" ? (tipo as TipoDotacao) : null,
    busca: params.get(PARAMS.busca) ?? "",
  };
}

export function FiltrosProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filtros = useMemo(
    () => lerFiltros(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const aba = searchParams.get(PARAMS.aba) ?? "analises";

  // Toda mudança de filtro vai para a URL: o estado do painel fica compartilhável
  // e sobrevive ao recarregamento. `scroll: false` evita o salto para o topo.
  const escrever = useCallback(
    (mutacao: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutacao(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const definir = useCallback(
    (parciais: Partial<Filtros>) => {
      escrever((params) => {
        for (const [campo, valor] of Object.entries(parciais) as [
          keyof Filtros,
          Filtros[keyof Filtros],
        ][]) {
          const chave = PARAMS[campo];
          if (valor === null || valor === "" || valor === undefined) params.delete(chave);
          else params.set(chave, String(valor));
        }
      });
    },
    [escrever],
  );

  const limpar = useCallback(() => {
    escrever((params) => {
      for (const campo of Object.keys(FILTROS_VAZIOS) as (keyof Filtros)[]) {
        params.delete(PARAMS[campo]);
      }
    });
  }, [escrever]);

  const definirAba = useCallback(
    (proxima: string) => {
      escrever((params) => {
        if (proxima === "analises") params.delete(PARAMS.aba);
        else params.set(PARAMS.aba, proxima);
      });
    },
    [escrever],
  );

  const orgaosFiltrados = useMemo(() => aplicarFiltros(ORGAOS, filtros), [filtros]);
  const resumo = useMemo(() => resumoDe(orgaosFiltrados), [orgaosFiltrados]);

  const aplicacoesDe = useCallback(
    (orgao: string) => {
      const porEixo = APLICACOES[orgao] ?? {};
      if (filtros.eixo == null) return porEixo;
      const chave = String(filtros.eixo);
      return porEixo[chave] ? { [chave]: porEixo[chave] } : {};
    },
    [filtros.eixo],
  );

  const valor = useMemo<Contexto>(
    () => ({
      filtros,
      orgaosFiltrados,
      resumo,
      ativo: temFiltroAtivo(filtros),
      definir,
      limpar,
      aba,
      definirAba,
      aplicacoesDe,
    }),
    [aba, aplicacoesDe, definir, definirAba, filtros, limpar, orgaosFiltrados, resumo],
  );

  return <FiltrosContext.Provider value={valor}>{children}</FiltrosContext.Provider>;
}

export function useFiltros(): Contexto {
  const contexto = useContext(FiltrosContext);
  if (!contexto) throw new Error("useFiltros precisa estar dentro de <FiltrosProvider>");
  return contexto;
}
