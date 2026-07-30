# 03 — Padrões de interface

Descritos como **comportamento**, não como código, porque a stack de destino
raramente é a mesma. Cada padrão traz a referência ao original em
`dashboard-credito-carbono/` (React + Vite) para quem quiser conferir a
implementação.

O objetivo de todos eles é um só: **tornar cada dotação localizável em no máximo
três cliques, sem nunca esconder um valor**.

---

## 1. Cartões de indicador (KPIs)

Quatro cartões no topo:

| Cartão | Valor principal | Subtítulo |
|---|---|---|
| Órgãos Atuantes | `58` | "Identificados" |
| Orçamento Climático Exclusivo Planejado | `200,1 MI` | "20,4% do total" |
| **Dotação Exclusiva** | `83` | `200,1 MI` |
| **Dotação Não Exclusiva** | `117` | `778,7 MI` |

O acerto de desenho nos dois últimos: o número grande é a **contagem de
aplicações**, e o valor financeiro é o subtítulo. Isso responde "quantas coisas o
Estado programou?" antes de "quanto custou" — e é o gancho que motiva o clique
até a camada 3. Ao passar o mouse, revela-se o rótulo "Aplicações Programadas".

O cartão de gasto não exclusivo carrega um botão `i` com a nota **"Em fase de
validação"**, que reflete o estado piloto descrito na metodologia (§4, Passo 3).
Mantenha essa ressalva enquanto a validação setorial não estiver concluída — é
honestidade sobre o dado, não detalhe cosmético.

*Original: [`KPICards.jsx`](../dashboard-credito-carbono/src/components/KPICards.jsx)*

## 2. O accordion de três níveis

O padrão que faz a metodologia ficar visível. Espelha exatamente as três camadas
de dados:

```
▸ Órgão                                                    Eixos: I, III    2026
  └─ DETALHAMENTO DO ÓRGÃO
     └─ EIXOS ABRANGIDOS
        ▸ Eixo I – Desenvolvimento Sustentável…      R$ 804.910,80
          ├─ PROSPECÇÃO DE MERCADOS DA ECONOMIA VERDE…   ● R$ 784.910,80
          └─ INCENTIVO E REGULAÇÃO DE SERVIÇOS AMBIENTAIS ● R$ 20.000,00
        ▸ Eixo III – Adaptação às Mudanças Climáticas R$ 1.000,00
     └─ Orçamento Exclusivo: R$ 804.910,80   Orçamento Não Exclusivo: R$ 0,00
        Proporção Exclusiva: 100,0%          Proporção Não Exclusiva: 0,0%
        Total Orçamentário: R$ 804.910,80
```

Regras de estado — vale a pena replicar com cuidado, foram todas ajustes pedidos
em uso real:

- **Dois conjuntos independentes**: um para órgãos abertos, outro para eixos
  abertos com chave composta `${orgaoId}|${eixo}`. Chave composta, não só o nome
  do eixo, senão abrir "Eixo III" num órgão abre em todos.
- **Múltiplos abertos ao mesmo tempo**, tanto órgãos quanto eixos. Comparar dois
  órgãos lado a lado é o caso de uso real.
- **Fechar o pai fecha os filhos**: ao colapsar um órgão, remova todas as chaves
  de eixo com o prefixo `${orgaoId}|`. Sem isso, reabrir o órgão devolve um
  estado antigo que o usuário não pediu.
- A linha do órgão mostra só os **numerais romanos** dos eixos (`I, III`) — o
  rótulo completo cabe no nível de baixo.

*Original: [`ProjectsTable.jsx:1009-1146`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L1009-L1146),
estado em [`:866-899`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L866-L899)*

## 3. Codificação de classificação por cor

Um ponto colorido de 8px ao lado de cada valor, e nada mais:

| Classificação | Cor | Hex |
|---|---|---|
| Exclusivo | verde | `#4ade80` |
| Não Exclusivo | azul | `#60a5fa` |

Duas categorias, alto contraste entre si, legíveis em tema claro e escuro. A cor
**nunca é a única portadora da informação** — o rótulo "Exclusivo" / "Não
Exclusivo" aparece por extenso no bloco de totais e nas exportações, o que
mantém a leitura acessível a quem não distingue as duas matizes.

> Ao portar para uma stack com design system próprio (Tailwind/shadcn), mapeie
> para tokens semânticos do tema em vez de fixar o hex.

## 4. Filtro por eixo e o total contextual

O filtro de eixo é **multisseleção** e atravessa o painel inteiro. O detalhe que
faz diferença: quando há eixo filtrado, o bloco de totais **troca de rótulo**.

- Sem filtro → uma linha: `Total Orçamentário: R$ X`
- Com filtro → uma linha por eixo selecionado:
  `Total Orçamentário por Eixo Temático (Eixo III – …): R$ Y`

Sem essa troca o usuário lê um total filtrado achando que é o total do órgão.
A lista de eixos dentro do órgão também é filtrada, para não exibir eixos que o
usuário acabou de excluir da visão.

*Original: [`ProjectsTable.jsx:1199-1215`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L1199-L1215)*

## 5. Agrupamento de unidades orçamentárias

Órgãos vêm da fonte no formato `código/unidade - SIGLA`, e a mesma secretaria
aparece várias vezes (`715/001 - SEFAZ`, `715/199 - SEFAZ (Departamento do
Tesouro Estadual)`). A regra adotada:

- Sufixos entre parênteses são **removidos** por padrão (vira só a sigla);
- **exceto** quando começam com "Fundo" ou "Departamento do Tesouro Estadual",
  em que o nome completo é preservado — são entidades com autonomia orçamentária
  própria e agregá-las esconderia informação;
- unidades que colapsam no mesmo nome têm `exclusivo`, `naoExclusivo`, `total` e
  o mapa `valoresPorEixo` **somados**; a lista de eixos é rederivada das chaves
  do mapa resultante, nunca copiada de um dos originais.

*Original: `limparNomeOrgao` em [`ProjectsTable.jsx:47-59`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L47-L59)
e o agrupador em [`:901-931`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L901-L931)*

## 6. Exportação hierárquica

O ponto frequentemente esquecido: **a exportação deve percorrer a mesma
hierarquia da tela**, órgão → eixo → aplicação. Exportar só a tabela plana de
órgãos devolve ao usuário menos do que ele estava vendo.

- **XLSX** — formato de microdados: uma linha por aplicação, com colunas
  `orgao`, `eixo`, `aplicacao`, `classificacao`, `dotacao`. Plano e longo, para
  quem vai dar sequência à análise em planilha ou BI.
- **PDF** — formato de relatório: bloco por órgão, tabela por eixo, cores por
  classificação, cabeçalho institucional e totais no fim.

São públicos diferentes; não tente servir os dois com um arquivo só.

*Original: `ExportarDados` em [`ProjectsTable.jsx:354`](../dashboard-credito-carbono/src/components/ProjectsTable.jsx#L354)*

## 7. Gráfico por eixo

Barras **horizontais** ordenadas por valor decrescente. Horizontal porque os
rótulos dos eixos são longos ("Eixo VII – Resposta Climática Emergencial e
Proteção Civil") e não cabem legíveis num eixo X vertical.

> **Derive os valores da camada 2 em tempo de render.** No projeto original eles
> foram fixados num array literal e desde então divergem da fonte em R$ 800 —
> ver [05-DIVERGENCIAS-CONHECIDAS.md](05-DIVERGENCIAS-CONHECIDAS.md). Total
> hardcoded é dívida que vence sozinha.

---

Próximo: [04-GUIA-PORTABILIDADE-ORCLIMA.md](04-GUIA-PORTABILIDADE-ORCLIMA.md).
