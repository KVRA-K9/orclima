"use client";

import { useFiltros } from "@/components/painel/filtros-context";
import { useI18n } from "@/lib/i18n/cliente";
import { ORCAMENTO } from "@/lib/data";

/**
 * Faixa de contexto no topo do painel: nomeia a seção aberta e diz, em uma
 * frase, o que ela mostra. Os valores de `aba` são os mesmos da sidebar e de
 * `painel-conteudo.tsx`.
 */
export function PainelBanner() {
  const { aba } = useFiltros();
  const { t, lang } = useI18n();

  const secoes = {
    analises: {
      titulo: t.painel.banner.secoes.analises.titulo,
      descricao: t.painel.banner.secoes.analises.descricao(
        ORCAMENTO.exercicio,
        lang === "pt" ? ORCAMENTO.fonte : t.dados.fonteBanner,
      ),
    },
    acoes: {
      titulo: t.painel.banner.secoes.acoes.titulo,
      descricao: t.painel.banner.secoes.acoes.descricao,
    },
    instrumentos: {
      titulo: t.painel.banner.secoes.instrumentos.titulo,
      descricao: t.painel.banner.secoes.instrumentos.descricao,
    },
    historico: {
      titulo: t.painel.banner.secoes.historico.titulo,
      descricao: t.painel.banner.secoes.historico.descricao,
    },
    ods: {
      titulo: t.painel.banner.secoes.ods.titulo,
      descricao: t.painel.banner.secoes.ods.descricao,
    },
  };

  const secao = secoes[aba as keyof typeof secoes] ?? secoes.analises;

  return (
    <section className="revelar-entrada rounded-xl bg-accent px-6 py-4">
      <h1 className="text-sm font-semibold text-accent-foreground">{secao.titulo}</h1>
      <p className="mt-1 max-w-5xl text-sm leading-relaxed text-muted-foreground">
        {secao.descricao}
      </p>
    </section>
  );
}
