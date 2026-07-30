# Planilha oficial

Duas fontes de ingestão são suportadas — escolha conforme o arquivo que você tem em mãos:

## Caminho preferido: `.xlsx` nativo

Se você tem o `.xlsx` oficial ("ORCAMENTOS - PROGRAMAS.xlsx", o mesmo formato de
`docs/fonte/`), rode:

```bash
npm run ingest:orcamentos-programas
```

Esse script (`scripts/ingest-orcamentos-programas.ts`) grava as **duas** camadas
que o painel consome — `data/orcamento.json` (resumo + órgão × eixo) **e**
`data/aplicacoes.json` (a lista de aplicações, camada 3) — e recusa gravar se a
soma das aplicações de cada órgão não bater com o total do órgão, ou se a soma
dos órgãos não bater com o total geral.

## Alternativa: CSV genérico

Coloque aqui a planilha exportada como **CSV UTF-8** e rode:

```bash
npm run ingest
```

O script (`scripts/ingest.ts`) regrava **apenas** `data/orcamento.json`. **Não
atualiza `data/aplicacoes.json`** — depois de rodar `npm run ingest`, a camada 3
exibida no painel (visão "Detalhado" da aba de detalhamento) fica desatualizada
em relação ao novo `data/orcamento.json`, sem aviso automático. Use este caminho
só quando não houver o `.xlsx` original disponível.

## Colunas esperadas

Uma linha por alocação (órgão × eixo; idealmente uma linha por ação). Os nomes de
coluna são comparados ignorando acentos, caixa e espaços — qualquer apelido da
lista serve.

| Campo | Obrigatório | Apelidos aceitos | Exemplo |
|---|---|---|---|
| órgão | sim | `orgao`, `unidade`, `unidade orçamentária`, `secretaria`, `sigla` | `713/001 - SEPLAN` |
| eixo | sim | `eixo`, `eixo temático`, `eixo numero` | `Eixo III – Adaptação…` ou `3` |
| valor | sim | `valor`, `valor climático`, `dotação`, `orçamento`, `montante` | `1.234.567,89` |
| tipo | sim | `tipo`, `classificação`, `intensidade`, `exclusividade` | `Exclusivo` / `Não Exclusivo` |
| ação | não | `acao`, `código ação`, `aplicação`, `programa` | `2.045` |
| exercício | não | `exercicio`, `ano` | `2026` |

Notas:

- O delimitador (`;` ou `,`) é detectado pela primeira linha.
- Números aceitam formato pt-BR (`1.234,56`) ou en-US (`1234.56`).
- O eixo pode vir como algarismo (`1`–`7`) ou com numeral romano no texto.
- A coluna de ação afeta apenas os contadores legados gravados no `resumo` de
  `data/orcamento.json` — os números "Aplicações programadas" exibidos nos
  cartões do painel vêm de `data/aplicacoes.json`, que este script não grava
  (ver seção "Caminho preferido" acima).

Para um arquivo fora desta pasta:

```bash
npm run ingest -- caminho/para/planilha.csv
```
