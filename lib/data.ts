import bruto from "@/data/orcamento.json";
import aplicacoesBruto from "@/data/aplicacoes.json";
import { EIXOS, eixoPorNumero } from "@/data/eixos";
import type {
  Aplicacoes,
  Filtros,
  Orcamento,
  Orgao,
  ResumoOrcamento,
  TotalPorEixo,
  TotalPorOrgao,
} from "@/lib/types";

// O JSON gerado tipa `tipo` como string; o contrato real é a união de TipoDotacao.
export const ORCAMENTO = bruto as unknown as Orcamento;
export const ORGAOS = ORCAMENTO.orgaos;
export const APLICACOES = aplicacoesBruto as unknown as Aplicacoes;

/**
 * Exercícios disponíveis. Hoje a fonte traz um único exercício; a assinatura já
 * é plural para quando a planilha oficial trouxer a série histórica.
 */
export const EXERCICIOS: number[] = [ORCAMENTO.exercicio];

export const NOMES_ORGAOS: string[] = ORGAOS.map((o) => o.nome).sort((a, b) =>
  a.localeCompare(b, "pt-BR"),
);

const arredonda = (n: number) => Math.round(n * 100) / 100;

/**
 * Aplica os filtros do painel.
 *
 * Com um eixo selecionado, cada órgão é reduzido à fatia daquele eixo. Como a
 * fonte só informa o corte Exclusivo/Não Exclusivo no nível do órgão, essa
 * divisão é rateada proporcionalmente à fatia do eixo — o total do órgão
 * continua exato, o corte por tipo passa a ser uma estimativa.
 */
export function aplicarFiltros(orgaos: Orgao[], filtros: Filtros): Orgao[] {
  const termo = filtros.busca.trim().toLocaleLowerCase("pt-BR");

  return orgaos.reduce<Orgao[]>((acc, orgao) => {
    if (filtros.orgao && orgao.nome !== filtros.orgao) return acc;
    if (filtros.tipo && orgao.tipo !== filtros.tipo) return acc;
    if (termo && !orgao.nome.toLocaleLowerCase("pt-BR").includes(termo)) return acc;

    if (filtros.eixo == null) {
      acc.push(orgao);
      return acc;
    }

    const valor = orgao.eixos[String(filtros.eixo)];
    if (!valor) return acc;

    const fatia = orgao.total === 0 ? 0 : valor / orgao.total;
    acc.push({
      ...orgao,
      total: valor,
      exclusivo: arredonda(orgao.exclusivo * fatia),
      naoExclusivo: arredonda(orgao.naoExclusivo * fatia),
      eixos: { [String(filtros.eixo)]: valor },
    });
    return acc;
  }, []);
}

export function temFiltroAtivo(filtros: Filtros): boolean {
  return (
    filtros.eixo != null ||
    filtros.orgao != null ||
    filtros.tipo != null ||
    filtros.busca.trim() !== ""
  );
}

const soma = (valores: number[]) => arredonda(valores.reduce((a, b) => a + b, 0));

/** Recalcula os indicadores agregados para um subconjunto de órgãos. */
export function resumoDe(orgaos: Orgao[]): ResumoOrcamento {
  return {
    numeroOrgaosAtuantes: orgaos.length,
    acoesExclusivas: ORCAMENTO.resumo.acoesExclusivas,
    acoesNaoExclusivas: ORCAMENTO.resumo.acoesNaoExclusivas,
    gastoExclusivo: soma(orgaos.map((o) => o.exclusivo)),
    gastoNaoExclusivo: soma(orgaos.map((o) => o.naoExclusivo)),
    total: soma(orgaos.map((o) => o.total)),
  };
}

/** Número de aplicações programadas no recorte atual, contadas a partir de `APLICACOES`. */
export function contarAcoes(
  filtros: Filtros,
): { exclusivas: number; naoExclusivas: number } {
  const orgaos = aplicarFiltros(ORGAOS, filtros);
  let exclusivas = 0;
  let naoExclusivas = 0;

  for (const orgao of orgaos) {
    const porEixo = APLICACOES[orgao.nome] ?? {};
    const listas =
      filtros.eixo == null
        ? Object.values(porEixo)
        : [porEixo[String(filtros.eixo)] ?? []];

    for (const aplicacoes of listas) {
      for (const aplicacao of aplicacoes) {
        if (aplicacao.tipo === "Exclusivo") exclusivas++;
        else naoExclusivas++;
      }
    }
  }

  return { exclusivas, naoExclusivas };
}

export function totaisPorEixo(orgaos: Orgao[]): TotalPorEixo[] {
  const acumulado = new Map<number, number>();
  for (const orgao of orgaos) {
    for (const [numero, valor] of Object.entries(orgao.eixos)) {
      const n = Number(numero);
      acumulado.set(n, (acumulado.get(n) ?? 0) + valor);
    }
  }
  const total = soma([...acumulado.values()]);

  return EIXOS.map((eixo) => {
    const valor = arredonda(acumulado.get(eixo.numero) ?? 0);
    return {
      numero: eixo.numero,
      romano: eixo.romano,
      rotulo: eixo.rotulo,
      titulo: eixo.titulo,
      cor: eixo.cor,
      valor,
      participacao: total === 0 ? 0 : valor / total,
    };
  }).filter((e) => e.valor > 0);
}

export function totaisPorOrgao(orgaos: Orgao[]): TotalPorOrgao[] {
  const total = soma(orgaos.map((o) => o.total));
  return orgaos
    .map((o) => ({
      nome: o.nome,
      codigo: o.codigo,
      sigla: o.sigla,
      valor: o.total,
      exclusivo: o.exclusivo,
      naoExclusivo: o.naoExclusivo,
      participacao: total === 0 ? 0 : o.total / total,
    }))
    .sort((a, b) => b.valor - a.valor);
}

/** Composição Exclusivo × Não Exclusivo, para o gráfico de rosca. */
export function composicao(orgaos: Orgao[]) {
  const resumo = resumoDe(orgaos);
  return [
    { chave: "exclusivo" as const, nome: "Exclusivo", valor: resumo.gastoExclusivo },
    {
      chave: "naoExclusivo" as const,
      nome: "Não Exclusivo",
      valor: resumo.gastoNaoExclusivo,
    },
  ];
}

/** Série empilhada Exclusivo × Não Exclusivo por eixo. */
export function exclusivoPorEixo(orgaos: Orgao[]) {
  const acc = new Map<number, { exclusivo: number; naoExclusivo: number }>();
  for (const orgao of orgaos) {
    for (const [numero, valor] of Object.entries(orgao.eixos)) {
      const n = Number(numero);
      const fatia = orgao.total === 0 ? 0 : valor / orgao.total;
      const atual = acc.get(n) ?? { exclusivo: 0, naoExclusivo: 0 };
      atual.exclusivo += orgao.exclusivo * fatia;
      atual.naoExclusivo += orgao.naoExclusivo * fatia;
      acc.set(n, atual);
    }
  }

  return [...acc.entries()]
    .sort(([a], [b]) => a - b)
    .map(([numero, v]) => {
      const eixo = eixoPorNumero.get(numero);
      return {
        numero,
        romano: eixo?.romano ?? String(numero),
        titulo: eixo?.titulo ?? String(numero),
        cor: eixo?.cor ?? "var(--brand)",
        exclusivo: arredonda(v.exclusivo),
        naoExclusivo: arredonda(v.naoExclusivo),
      };
    });
}

/** Quantos órgãos atuam em cada eixo — usado no gráfico de dispersão. */
export function orgaosPorEixo(orgaos: Orgao[]) {
  return totaisPorEixo(orgaos).map((eixo) => ({
    ...eixo,
    orgaos: orgaos.filter((o) => Boolean(o.eixos[String(eixo.numero)])).length,
  }));
}

/**
 * Reduz `"713/001 - SEPLAN (Departamento X)"` à sigla, removendo o sufixo
 * entre parênteses — exceto quando ele começa com "Fundo" ou "Departamento do
 * Tesouro Estadual", entidades com autonomia orçamentária própria que a
 * redução esconderia.
 */
export function limparNomeOrgao(nome: string): string {
  const m = /^(.*?)\s*(\([^)]*\))\s*$/.exec(nome);
  if (!m) return nome;
  const [, base, parenteses] = m;
  const conteudo = parenteses.slice(1, -1).trim();
  if (/^(Fundo|Departamento do Tesouro Estadual)/i.test(conteudo)) return nome;
  return base;
}

/**
 * Agrupa unidades orçamentárias que colapsam no mesmo nome após
 * `limparNomeOrgao`, somando os valores. Uso local (ex.: uma visão opcional na
 * tabela de detalhamento) — não deve ser aplicado no contexto de filtros, pois
 * mudaria a contagem de "Órgãos Atuantes" reportada pelos KPIs e gráficos.
 */
export function agruparOrgaos(orgaos: Orgao[]): Orgao[] {
  const grupos = new Map<string, Orgao[]>();
  for (const orgao of orgaos) {
    const chave = limparNomeOrgao(orgao.nome);
    const membros = grupos.get(chave);
    if (membros) membros.push(orgao);
    else grupos.set(chave, [orgao]);
  }

  return [...grupos.entries()]
    .map(([nome, membros]): Orgao => {
      if (membros.length === 1) return membros[0];

      const exclusivo = soma(membros.map((o) => o.exclusivo));
      const naoExclusivo = soma(membros.map((o) => o.naoExclusivo));
      const total = arredonda(exclusivo + naoExclusivo);
      const eixos: Record<string, number> = {};
      for (const membro of membros) {
        for (const [numero, valor] of Object.entries(membro.eixos)) {
          eixos[numero] = arredonda((eixos[numero] ?? 0) + valor);
        }
      }
      const pct = total === 0 ? 0 : Math.round((exclusivo / total) * 100);

      return {
        nome,
        codigo: membros.map((o) => o.codigo).join(", "),
        sigla: nome,
        total,
        exclusivo,
        naoExclusivo,
        tipo: exclusivo >= naoExclusivo ? "Exclusivo" : "Não Exclusivo",
        intensidade: `Exclusivo (${pct}%) / Não Exclusivo (${100 - pct}%)`,
        eixos,
      };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}
