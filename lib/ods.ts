import { ODS, type IndicadorOds, type Ods } from "@/data/ods";

/**
 * Situação do indicador. A planilha de origem não traz um campo próprio para
 * isso — a informação vem marcada no fim do texto do indicador, entre
 * parênteses. Derivamos aqui para não espalhar a heurística pela interface.
 */
export type StatusOds = "produzido" | "construcao" | "sem-dados";

export const STATUS_ROTULO: Record<StatusOds, string> = {
  produzido: "Produzido",
  construcao: "Em construção",
  "sem-dados": "Sem dados",
};

/** Classe da bolinha de status. Verde/âmbar/laranja, do pronto ao ausente. */
export const STATUS_COR: Record<StatusOds, string> = {
  produzido: "bg-emerald-500",
  construcao: "bg-amber-500",
  "sem-dados": "bg-orange-500",
};

export const STATUS_ORDEM: StatusOds[] = ["produzido", "construcao", "sem-dados"];

export type IndicadorDerivado = IndicadorOds & {
  /** "Indicador 1.5.3" — null quando o texto não segue o padrão "código: descrição". */
  codigo: string | null;
  /** Texto sem o prefixo do código; igual a `texto` quando não há código. */
  descricao: string;
  status: StatusOds;
};

export type OdsDerivado = Omit<Ods, "indicadores"> & {
  indicadores: IndicadorDerivado[];
  /** Eixos do Orçamento Climático citados pelos indicadores, únicos e ordenados. */
  eixosRelacionados: number[];
};

/** Minúsculas e sem acento — para comparar marcadores e busca sem surpresa. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function statusDoIndicador(texto: string): StatusOds {
  const t = normalizar(texto);
  if (t.includes("(em construcao)")) return "construcao";
  if (t.includes("(sem dados)")) return "sem-dados";
  return "produzido";
}

function derivarIndicador(indicador: IndicadorOds): IndicadorDerivado {
  // Só o primeiro ":" separa código de descrição — os textos costumam ter
  // outros dois-pontos no meio, em enumerações do tipo "(a) …; (b) …".
  const corte = indicador.texto.indexOf(":");
  const codigo = corte > 0 ? indicador.texto.slice(0, corte).trim() : null;
  const descricao =
    corte > 0 ? indicador.texto.slice(corte + 1).trim() : indicador.texto.trim();

  return {
    ...indicador,
    codigo,
    descricao,
    status: statusDoIndicador(indicador.texto),
  };
}

/** Os 18 ODS já derivados. Dado estático: calculado uma vez, na carga do módulo. */
export const ODS_DERIVADOS: OdsDerivado[] = ODS.map((ods) => ({
  ...ods,
  indicadores: ods.indicadores.map(derivarIndicador),
  eixosRelacionados: [
    ...new Set(ods.indicadores.map((i) => i.eixo).filter((e): e is number => e != null)),
  ].sort((a, b) => a - b),
}));

export const TOTAL_ODS = ODS_DERIVADOS.length;

export type FiltroOds = {
  /** Vazio = sem restrição. Vários eixos somam (união), não se intersectam. */
  eixos: number[];
  status: StatusOds[];
  busca: string;
};

/**
 * Reduz os indicadores de cada ODS ao filtro, mas **mantém os 18 na lista**:
 * a grade de logos precisa de posições fixas, então quem sobra sem indicador é
 * apagado visualmente em vez de sumir e reordenar tudo.
 */
export function filtrarOds({ eixos, status, busca }: FiltroOds): OdsDerivado[] {
  const termo = normalizar(busca.trim());

  return ODS_DERIVADOS.map((ods) => {
    // Buscar pelo nome do ODS ("ODS 13", "ação contra a mudança global do
    // clima") traz o objetivo inteiro; senão, o termo é casado indicador a
    // indicador.
    const odsCasaBusca =
      termo.length === 0 ||
      normalizar(ods.cod).includes(termo) ||
      normalizar(ods.titulo).includes(termo);

    const indicadores = ods.indicadores.filter((indicador) => {
      // Indicador sem eixo mapeado (há um, no ODS 6) sai de qualquer recorte
      // por eixo — não pertence a nenhum dos selecionados.
      if (eixos.length > 0 && (indicador.eixo == null || !eixos.includes(indicador.eixo)))
        return false;
      if (status.length > 0 && !status.includes(indicador.status)) return false;
      if (!odsCasaBusca && !normalizar(indicador.texto).includes(termo)) return false;
      return true;
    });

    return { ...ods, indicadores };
  });
}
