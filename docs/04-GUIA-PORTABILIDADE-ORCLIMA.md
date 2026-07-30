# 04 — Guia de portabilidade para o Projeto_Orclima

Destino: `c:\Users\vinicius.farias\Desktop\Projeto_Orclima`
Stack: **Next.js 16 + TypeScript + Tailwind + shadcn/ui** (aqui a origem é
React 19 + Vite + JSX com estilo inline — são incompatíveis no nível de código).

## O diagnóstico em uma frase

O Orclima **já tem as camadas 1 e 2** e **não tem a camada 3**. Falta a lista de
aplicações programadas — as dotações individuais — e é só isso que impede o
painel de mostrar cada dotação.

| | Orclima hoje | Origem |
|---|---|---|
| Camada 1 · resumo | ✅ `data/orcamento.json → resumo` | ✅ |
| Camada 2 · órgão × eixo | ✅ `data/orcamento.json → orgaos[].eixos` | ✅ |
| **Camada 3 · aplicações** | ❌ **ausente** | ✅ 200 aplicações |
| Metodologia documentada | ❌ ausente | parcial (Roteiro) |
| Filtro por eixo | ✅ `filtros-context.tsx` | ✅ |
| Gráficos por eixo | ✅ `components/painel/graficos/` | ✅ |
| Detalhamento | ⚠️ tabela **plana** de órgãos | ✅ accordion 3 níveis |
| Exportação | ⚠️ CSV/PDF só de órgãos | ✅ hierárquica |

**Compatibilidade já verificada** (via `converter-aplicacoes-para-orclima.mjs`):
os 58 nomes de órgão são idênticos nos dois projetos, e **todo valor por eixo
bate ao centavo**. Os 7 rótulos de eixo do kit são byte a byte iguais aos
`rotulo` de `data/eixos.ts`. Não há trabalho de reconciliação de dados.

---

## Passo 1 — Copiar (nada a adaptar)

| Do kit | Para o Orclima |
|---|---|
| `dados/aplicacoes.orclima.json` | `data/aplicacoes.json` |
| `dados/eixos-canonicos.json` | `data/eixos-canonicos.json` |
| `01-METODOLOGIA.md`, `02-ARQUITETURA-DE-DADOS.md`, `03-PADROES-UI.md`, `05-DIVERGENCIAS-CONHECIDAS.md` | `docs/` *(criar a pasta)* |
| `fonte/` inteira | `docs/fonte/` |
| `verificar-integridade.mjs` | `scripts/verificar-integridade.mjs` |

`dados/aplicacoes.orclima.json` **já está gerado e conferido** — chave de eixo
numérica (`"3"`), campo `tipo` em vez de `classificacao`, no padrão do
`lib/types.ts` de lá:

```jsonc
{ "715/512 - CDSA": { "1": [ { "aplicacao": "PROSPECÇÃO DE MERCADOS…", "dotacao": 784910.8, "tipo": "Exclusivo" } ] } }
```

Para regerar depois de uma nova ingestão: `node converter-aplicacoes-para-orclima.mjs`.

### Não copiar

- `src/components/*.jsx` e `src/context/*.jsx` da origem — stack incompatível.
- `dados/orcamento_real.json` e `dados/orcamento_por_orgao_eixo.json` — o
  Orclima já tem o equivalente consolidado em `data/orcamento.json`. Servem só
  de referência de schema.
- `node_modules/`, `dist/`, `ProjectsTable.jsx.bak`.

## Passo 2 — Tipar a nova camada

Em `lib/types.ts`, ao lado do `Orgao` existente:

```ts
/** Uma ação orçamentária com marcador climático. */
export type Aplicacao = {
  aplicacao: string;
  /** Valor climático — já com o percentual de conversão aplicado. */
  dotacao: number;
  tipo: TipoDotacao;
};

/** órgão → número do eixo ("1".."7") → aplicações. */
export type Aplicacoes = Record<string, Record<string, Aplicacao[]>>;
```

`TipoDotacao` já existe lá e é exatamente `"Exclusivo" | "Não Exclusivo"` — nada
a criar.

## Passo 3 — Expor no contexto de filtros

`components/painel/filtros-context.tsx` já entrega `orgaosFiltrados`, `filtros` e
`resumo`. Acrescente um seletor que devolve as aplicações de um órgão já
respeitando o filtro de eixo ativo:

```ts
const aplicacoesDe = useCallback(
  (orgao: string) => {
    const porEixo = aplicacoes[orgao] ?? {};
    if (filtros.eixo == null) return porEixo;
    const chave = String(filtros.eixo);
    return porEixo[chave] ? { [chave]: porEixo[chave] } : {};
  },
  [filtros.eixo],
);
```

Note que `Filtros.eixo` no Orclima é `number | null` — **seleção única**, enquanto
a origem usa multisseleção. Se quiser multisseleção, mude para `number[]` e
ajuste os consumidores; não é pré-requisito para a camada 3.

## Passo 4 — Reescrever o detalhamento como accordion

Alvo: `components/painel/aba-detalhamento.tsx`, que hoje é uma `Table` plana
ordenável. **`components/ui/accordion.tsx` do shadcn já existe** — não precisa
instalar nada.

Estrutura: `Accordion type="multiple"` externo (órgãos) com um
`Accordion type="multiple"` interno (eixos) dentro de cada `AccordionContent`, e
a lista de aplicações no conteúdo do interno.

O `type="multiple"` do Radix já entrega os requisitos de "múltiplos abertos" e
"fechar o pai fecha os filhos" (o interno desmonta junto), o que dispensa a
gestão manual de `Set` descrita em [03-PADROES-UI.md](03-PADROES-UI.md) §2 — foi
uma solução para um accordion feito à mão.

Preserve da origem: subtotal por eixo no cabeçalho do item, ponto colorido por
classificação, e a troca de "Total Orçamentário" por "Total por Eixo Temático
(Eixo N)" quando há filtro ativo.

Sugestão de decisão a tomar antes de codar: **manter ou não a ordenação por
coluna** que existe hoje na tabela plana. Ordenar e agrupar hierarquicamente
competem entre si. O caminho mais simples é manter a tabela plana como está e
adicionar o accordion como uma segunda visão ("Por órgão" / "Detalhado"), em vez
de substituir.

### Cores

Não fixe `#4ade80` / `#60a5fa`. O Orclima já tem tokens `--eixo-1..7` em
`app/globals.css`; crie dois tokens irmãos (ex.: `--exclusivo`,
`--nao-exclusivo`) e use as classes do Tailwind, para o tema escuro funcionar.

## Passo 5 — Agrupar unidades orçamentárias

Portar `limparNomeOrgao` (regra em [03-PADROES-UI.md](03-PADROES-UI.md) §5) para
`lib/data.ts`. Preserva o nome completo quando o sufixo entre parênteses começa
com "Fundo" ou "Departamento do Tesouro Estadual"; caso contrário reduz à sigla,
somando `exclusivo`, `naoExclusivo`, `total` e o mapa de eixos.

**Opcional.** Sem isso o painel lista as 58 unidades separadamente, o que é
correto — só mais longo.

## Passo 6 — Exportação hierárquica

`lib/export.ts` hoje exporta a tabela plana. Estenda para percorrer
órgão → eixo → aplicação, conforme [03-PADROES-UI.md](03-PADROES-UI.md) §6: CSV
de microdados (uma linha por aplicação) e PDF por blocos.

## Passo 7 — Reingestão futura

`scripts/ingest.ts` do Orclima já lê CSV com coluna de ação (`acao`,
`codigoacao`, `aplicacao`, `programa`) e o `data/raw/LEIA-ME.md` até antecipa
que, com essa coluna presente, os contadores 83/117 passam a responder aos
filtros. Ou seja: **o caminho de ingestão da camada 3 já estava previsto** — só
falta o script gravar `data/aplicacoes.json` além de `data/orcamento.json`.

Quando fizer isso, rode `node scripts/verificar-integridade.mjs` no fim da
ingestão e falhe o build se a cascata quebrar.

---

## Verificação de ponta a ponta

```bash
cd "…/Projeto Cŕedito de Carbono/kit-metodologia-orcamento-climatico"
node verificar-integridade.mjs            # 200 aplicações, 0 divergências
node converter-aplicacoes-para-orclima.mjs # confere contra o Orclima

cd ../../Projeto_Orclima
npm run dev
```

No painel: abrir um órgão → ver os eixos com subtotal → abrir um eixo → ver as
aplicações. Somar as aplicações de um órgão à mão e conferir com o total
exibido. Filtrar por eixo e confirmar que o rótulo do total muda.

Caso de teste bom: **452/001 - DEFESA CIVIL** — dois eixos (III com R$ 1.000,00
e VII com R$ 17.753.000,00), então erro de agregação salta à vista.
