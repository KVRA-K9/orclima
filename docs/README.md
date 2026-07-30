# Kit Metodológico — Orçamento Climático do Acre

Tudo o que é preciso para reproduzir, em outro dashboard, a metodologia que faz
**cada dotação do Orçamento Climático aparecer e ficar segmentada por eixo
estruturante**.

Extraído do dashboard de Crédito de Carbono (SEPLAN/AC — DEPPO), exercício 2026.
Esta pasta é **autocontida**: copie-a inteira e ela funciona isolada — dados,
documentos e os dois scripts de validação não dependem de nada externo.

> Única exceção: os documentos 03 e 05 citam arquivos do projeto de origem
> (`../dashboard-credito-carbono/…`) como referência de implementação. Esses
> links só resolvem enquanto o kit estiver dentro do projeto original; são
> ilustrativos, e nada no kit depende deles.

---

## Ordem de leitura

| # | Documento | Para quê |
|---|---|---|
| 1 | [01-METODOLOGIA.md](01-METODOLOGIA.md) | As regras: 7 eixos, alocação macro/micro, marcador Exclusivo × Não Exclusivo, percentuais 25/50/75% |
| 2 | [02-ARQUITETURA-DE-DADOS.md](02-ARQUITETURA-DE-DADOS.md) | Como as regras viram estrutura: as três camadas e a cascata de integridade |
| 3 | [03-PADROES-UI.md](03-PADROES-UI.md) | Como a estrutura vira tela: accordion de 3 níveis, filtro por eixo, cores, exportação |
| 4 | [04-GUIA-PORTABILIDADE-ORCLIMA.md](04-GUIA-PORTABILIDADE-ORCLIMA.md) | Passo a passo para o Projeto_Orclima (Next + TS + shadcn) |
| 5 | [05-DIVERGENCIAS-CONHECIDAS.md](05-DIVERGENCIAS-CONHECIDAS.md) | O que **não** copiar do projeto de origem |
| 6 | [06-ATUALIZACAO-DE-DADOS.md](06-ATUALIZACAO-DE-DADOS.md) | **O dia a dia**: atualizar os dados num lugar só e distribuir |
| 7 | [07-CICLO-MENSAL.md](07-CICLO-MENSAL.md) | **O que é mensal**: cruzar o QDD e apurar a execução por eixo |

Quem só quer entender o desenho: leia 1 e 2. Quem vai implementar: leia 3 e 4.
**Quem só precisa atualizar os dados: leia o 6 e mais nada.**

## Conteúdo

```
kit-metodologia-orcamento-climatico/
├── 01-METODOLOGIA.md … 07-CICLO-MENSAL.md
├── distribuir.mjs                         # FONTE ÚNICA → todos os dashboards
├── destinos.json                          # quem consome os dados, e em que formato
├── verificar-integridade.mjs              # valida a cascata das 3 camadas
├── lib-xlsx.mjs                           # leitor de .xlsx sem dependências
├── correcoes-planilha.mjs                 # correções conhecidas sobre a planilha oficial
├── gerar-de-para.mjs                      # planilha -> de-para-classificacao.json
├── cruzar-qdd.mjs                         # de-para + QDD -> execução por eixo
├── corrigir-dupla-contagem.mjs            # planilha (corrigida) -> as 3 camadas
├── atualizar-orclima-orcamento.mjs        # sincroniza data/orcamento.json do Orclima
├── converter-aplicacoes-para-orclima.mjs  # rótulo de eixo → número (1..7)
├── dados/
│   ├── eixos-canonicos.json               # os 7 eixos: número ↔ romano ↔ rótulo
│   ├── orcamento_real.json                # camada 1 · resumo
│   ├── orcamento_por_orgao_eixo.json      # camada 2 · órgão × eixo
│   ├── aplicacoes_por_orgao_eixo.json     # camada 3 · cada dotação
│   ├── aplicacoes.orclima.json            # camada 3 no formato do Orclima (pronta)
│   └── de-para-classificacao.json         # classificação isolada, para o ciclo mensal
└── fonte/
    ├── Roteiro Operativo para Orçamento Climático.md
    ├── FUNÇÕES.xlsx
    ├── ORCAMENTOS - PROGRAMAS.xlsx
    └── Orçamento Climático_Dotações 2026_Atualizado.xlsx
```

> A planilha `ORCAMENTOS - PROGRAMAS.xlsx` em `fonte/` traz uma dupla contagem
> conhecida de R$ 3.117.789,13 em 8 aplicações lançadas em mais de um eixo —
> **já corrigida** nos JSONs de `dados/` (ver
> [05-DIVERGENCIAS-CONHECIDAS.md §1b](05-DIVERGENCIAS-CONHECIDAS.md)). A
> planilha em si não foi editada; rode `node corrigir-dupla-contagem.mjs` se
> precisar regenerar os JSONs a partir dela.

### O que é cada planilha em `fonte/`

Nenhuma é necessária para os dashboards rodarem — eles consomem os JSONs de
`dados/`. Estão aqui para rastreabilidade e para a reingestão.

| Planilha | Papel | Grão |
|---|---|---|
| **FUNÇÕES.xlsx** | O mapa Eixo → Função → Subfunção → Órgão: é o **Apêndice A do Roteiro** em planilha, a regra da Alocação Macro | 127 linhas |
| **ORCAMENTOS - PROGRAMAS.xlsx** | **Gerou a camada 3** — 200 aplicações + cabeçalho; tem aba "Resumo por Eixo" | 201 linhas |
| **Orçamento Climático_Dotações 2026_Atualizado.xlsx** | Quadro de Alocação e Classificação, com `Classificação do Gasto` e `Justificativa (ponderação…)` | por função/subfunção |
| **Roteiro Operativo…md** | A metodologia oficial completa | — |

**Fora do kit de propósito:** `QDD_Orclim.xlsx` (620 KB) é o Quadro de
Detalhamento da Despesa bruto do Estado inteiro — todas as despesas, não só as
climáticas. É insumo da SEPLAN para *produzir* as planilhas acima, não material
de repositório de painel. `Orçamento Climático_ODS.xlsx` só interessa a quem for
alimentar a aba de ODS.

> **Cuidado com re-exportações.** Duas cópias da planilha de Dotações circulavam
> com o mesmo nome e conteúdo equivalente, mas uma delas — gravada por
> ferramenta que não o Excel — havia **arredondado centavos em 3 células**
> (perdas de R$ 0,02, R$ 0,02 e R$ 0,36). A cópia aqui é a gravada pelo próprio
> Excel, com precisão integral. Ao substituir uma planilha de `fonte/`, prefira
> sempre o arquivo original da fonte, não um re-export.

## A ideia em um parágrafo

O dado é modelado em **três camadas de granularidade crescente** — resumo do
Estado, alocação por órgão × eixo, e aplicação individual — amarradas por uma
**cascata de integridade** que exige que a soma de cada camada feche com a de
cima, ao centavo. A camada 3 é a que costuma faltar e é justamente ela que torna
cada dotação visível. Na tela, essas três camadas viram um **accordion de três
níveis**: Órgão → Eixo (com subtotal) → Aplicação (com valor e classificação).

## Atualizar os dados

O kit é a **fonte única**. Nenhum dashboard é editado à mão:

```bash
# 1. atualize os JSONs em dados/    2. confira    3. distribua
node distribuir.mjs --conferir
node distribuir.mjs
```

O site publicado (`seplan-clima.vercel.app`) está marcado `"publicado": true` em
[`destinos.json`](destinos.json) e **nunca é escrito por padrão** — só relatado.
Para propagar até ele: `node distribuir.mjs --incluir-publicado`, e ainda assim o
deploy exige commit e push. Detalhes em
[06-ATUALIZACAO-DE-DADOS.md](06-ATUALIZACAO-DE-DADOS.md).

## Verificação

```bash
node verificar-integridade.mjs
```

Saída esperada sobre os dados de 2026:

```
Órgãos            : 58
Aplicações        : 200
  Exclusivas      : 83 · R$ 200.124.164,91
  Não exclusivas  : 117 · R$ 778.655.275,46
Soma camada 3     : R$ 978.779.440,37
Soma camada 2     : R$ 978.779.440,37
Total declarado   : R$ 978.779.440,37

Cascata íntegra — 0 divergências.
```

Rode isso **toda vez que reingerir a planilha oficial**. Sai com código 1 se
qualquer soma divergir mais de R$ 0,01.

## O que copiar para o Projeto_Orclima

Resumo — detalhes e passos em
[04-GUIA-PORTABILIDADE-ORCLIMA.md](04-GUIA-PORTABILIDADE-ORCLIMA.md).

| Copiar | Destino |
|---|---|
| `dados/aplicacoes.orclima.json` | `data/aplicacoes.json` ← **a camada que falta lá** |
| `dados/eixos-canonicos.json` | `data/eixos-canonicos.json` |
| `01`…`05` `.md` | `docs/` |
| `fonte/` | `docs/fonte/` |
| `verificar-integridade.mjs` | `scripts/` |

**Não copiar:** componentes `.jsx` da origem (stack incompatível: Vite/JSX contra
Next/TSX/Tailwind), `orcamento_real.json` e `orcamento_por_orgao_eixo.json` (o
Orclima já tem o equivalente em `data/orcamento.json`), `node_modules/`,
`dist/`, `.bak`.

Já verificado: os **58 nomes de órgão são idênticos** nos dois projetos, **todo
valor por eixo bate ao centavo**, e os **7 rótulos de eixo são byte a byte
iguais** aos de `data/eixos.ts` do Orclima. Não há reconciliação de dados a
fazer — só falta a camada 3 e a UI que a expõe.

## Fonte e responsabilidade

SEPLAN/AC — Departamento de Estudos, Pesquisas, Planejamento e Orçamento (DEPPO).
Base legal: Lei Estadual nº 11.287/2025 (7 eixos estruturantes) e Decreto
nº 12.705/2025 (Taxonomia Sustentável Brasileira).

Exercício 2026, classificação em caráter **piloto** — a validação setorial
prevista no Passo 3 da metodologia ainda não foi concluída.
