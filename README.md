# Orçamento Climático do Estado do Acre

Site institucional e painel interativo do Orçamento Climático do Acre
(SEPLAN/DEPLAN), instituído pela
[Lei nº 4.679/2025](https://legis.ac.gov.br/detalhar/6600).

- `/` — página institucional: o que é, sete eixos temáticos, base legal, relatórios
- `/painel` — painel de dados: filtros, indicadores, gráficos, tabela e exportação

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui sobre Radix (`radix-ui` + `class-variance-authority` + `clsx` +
`tailwind-merge`) · Recharts · lucide-react · next-themes ·
react-hook-form + zod · jsPDF.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
npm run typecheck
```

## Dados

`data/orcamento.json` é a **única fonte** do painel. Formato:

```jsonc
{
  "exercicio": 2026,
  "resumo": { "gastoExclusivo": 0, "gastoNaoExclusivo": 0, "total": 0 },
  "orgaos": [
    {
      "nome": "713/001 - SEPLAN",
      "codigo": "713/001",
      "sigla": "SEPLAN",
      "total": 0,
      "exclusivo": 0,
      "naoExclusivo": 0,
      "tipo": "Exclusivo",
      "intensidade": "Exclusivo (19%) / Não Exclusivo (81%)",
      "eixos": { "1": 0, "3": 0 }
    }
  ]
}
```

Em `eixos`, a chave é o número do eixo (1–7) e o valor é a dotação naquele eixo.

Para atualizar a partir da planilha oficial: coloque o CSV em `data/raw/` e rode

```bash
npm run ingest
```

As colunas aceitas estão documentadas em [`data/raw/LEIA-ME.md`](data/raw/LEIA-ME.md).

Catálogos editados à mão (o `ingest` não os regrava):
`data/eixos.ts`, `data/ods.ts`, `data/instrumentos-legais.ts`.

Toda agregação (totais por eixo, por órgão, composição) mora em `lib/data.ts` —
os componentes não recalculam nada.

## Tema

Os tokens em `app/globals.css` reproduzem a paleta do painel anterior
(`seplan-clima.vercel.app`): verde `#15803d` no claro, `#4ade80` no escuro,
fundo escuro `#052e16`. Claro/escuro via `next-themes` (classe `.dark`).

As sete cores de eixo (`--eixo-1` … `--eixo-7`) são **sete passos de uma rampa
sequencial**, de ordem fixa e com ancoragem própria em cada tema. Foram derivadas
em OKLab da paleta `#204b5e · #426b65 · #baab6a · #fbea80 · #fdfac7`, com a
luminosidade prescrita dentro da faixa que o fundo de cada tema permite: todos os
sete cruzam **3:1** de contraste contra o cartão (mínimo 3,06 no claro, 3,63 no
escuro).

A contrapartida está registrada: a paleta cobre ~110° de matiz, então o ΔE entre
passos adjacentes é **≈ 4,4 no claro e ≈ 6,0 no escuro** — muito abaixo dos ≈ 20
do conjunto arco-íris anterior, e igual em deuteranopia. **A cor sozinha não
separa eixos vizinhos com folga.** Ela nunca aparece desacompanhada: há o
algarismo romano no eixo X do gráfico, o nome na legenda, o rótulo no badge da
aba ODS e no chip das tabelas. Ao criar uma tela nova, não use a cor de eixo como
único canal de informação.

`--exclusivo` / `--nao-exclusivo` apontam para os **extremos** da rampa
(`--eixo-1` e `--eixo-7`), não para passos vizinhos: numa rosca de duas fatias o
par 1–2 daria ΔE 5,7, contra 30,8 dos extremos. **Não troque uma cor isolada** —
regenere a rampa inteira e revalide contraste e ΔE antes.

## Estado do painel

Filtros e aba ativa vivem na query string (`?ano=&eixo=&orgao=&tipo=&q=&aba=`),
então qualquer recorte é compartilhável por link e sobrevive ao recarregamento.
`components/painel/filtros-context.tsx` é o único lugar que escreve na URL.

## Limitação conhecida

Os contadores "83 / 117 aplicações programadas" vêm agregados da fonte publicada
e não respondem aos filtros — os cartões marcam isso com um ícone de informação.
Quando a planilha oficial trouxer uma linha por ação (coluna `acao`), o
`npm run ingest` passa a contá-los de verdade e a limitação desaparece.
