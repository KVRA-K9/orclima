# 05 — Divergências conhecidas

Registro do que **não** deve ser propagado ao copiar a metodologia. Nenhum destes
itens foi corrigido no projeto de origem — são anotações para quem for portar.

Os dados em [`dados/`](dados/) estão **íntegros**: 200 aplicações, cascata
fechando em **R$ 978.779.440,37**, zero divergências (valor corrigido em
27/07/2026 — ver §1b).

---

## 1. Nomenclatura e totais hardcoded no gráfico — CORRIGIDO em 27/07/2026

`EIXOS_DATA` em
[`ChartsSection.jsx`](../dashboard-credito-carbono/src/components/ChartsSection.jsx)
era um array literal com dois problemas, ambos corrigidos: os rótulos dos eixos
VI e VII não batiam com o resto do sistema, e o Eixo III trazia R$ 800 a mais
que o apurado (R$ 436.984.738,89 no código contra R$ 436.983.938,89 na fonte).

A correção substitui o array literal por uma derivação de
`orcamento_por_orgao_eixo.json` em tempo de render — os totais por eixo não
podem mais divergir da fonte, porque deixaram de ser digitados. Build
verificado: a soma dos 7 eixos derivados fecha em R$ 981.897.229,50, idêntica ao
`total_orcamento_climatico`.

> Esse R$ 981.897.229,50 é o total **anterior** à correção de dupla contagem
> (§1b, aplicada logo em seguida no mesmo dia). O total vigente é
> **R$ 978.779.440,37**. O valor acima fica registrado como estava no momento
> desta verificação — não é o número atual.

> **Ocorrência semelhante não corrigida:** `nomesEixos` em
> [`ODSModal.jsx:4-12`](../dashboard-credito-carbono/src/components/ODSModal.jsx#L4-L12)
> é um dicionário de rótulos **curtos** para a tooltip do modal ODS — inclui
> "Educação Ambiental e Inovação" (sem "Climática") e "Gestão de Riscos e
> Proteção Civil" (nome antigo), mas também abrevia o Eixo III para "Adaptação
> Climática". Parece um design deliberado de rótulos curtos para espaço de
> tooltip, não um esquecimento isolado — por isso não foi tocado junto com o
> gráfico. Decidir se esse dicionário deve virar canônico é uma escolha de
> copy/UI, não uma correção de dado.

## 1b. Dupla contagem em ações lançadas em mais de um eixo — CORRIGIDO em 27/07/2026

Achado ao cruzar `ORCAMENTOS - PROGRAMAS.xlsx` com o QDD (ver
[07-CICLO-MENSAL.md](07-CICLO-MENSAL.md)). O Roteiro (linha 349) manda que uma
subfunção em múltiplos eixos tenha seu impacto orçamentário **dividido e
compartilhado**. Na planilha oficial, 8 das 200 aplicações estavam lançadas com
o **valor integral duplicado** em cada eixo, não repartido — R$ 3.117.789,13
(0,32% do total) contados a mais.

Corrigido pelo usuário, explicitamente autorizado após ser informado do achado
e do impacto no total oficial. Critério aplicado, usando a `Dotação Inicial`
do QDD como valor-verdade de cada chave (órgão/unidade#código):

- **Split** — as duas entradas tinham valor idêntico e juntas duplicavam o
  valor do QDD (cópia mecânica): dividido igualmente entre os eixos.
- **Carve** — uma entrada já batia sozinha com o QDD (a "base"); a outra era um
  valor extra sem lastro no QDD (o "secundário", mantido como estava — é o
  julgamento do classificador sobre o que pertence àquele eixo): subtraído da
  base.

| Chave (órgão#código) | Eixos | Tratamento | Antes → Depois |
|---|---|---|---|
| `753/001#10790000` | I + III | carve | I: 59.446.200,00 → **56.346.200,00** |
| `720/001#11260000` | I + V | split | 11.000,00+11.000,00 → **5.500,00 cada** |
| `719/001#13470000` | II + III | carve | II: 1.198.684,01 → **1.195.904,88** |
| `753/001#10810000` | I + III | carve | I: 3.345.000,00 → **3.344.000,00** |
| `720/001#21630000` | II + III | carve | II: 1.832.764,37 → **1.831.764,37** |
| `720/605#11350000` | II + VI | split | 1.000,00+1.000,00 → **500,00 cada** |
| `744/001#13390000` | III + IV | carve | IV: 1.151.000,00 → **1.150.000,00** |
| `761/301#11560000` | III + VI | carve | VI: 60,00 → **50,00** |

Implementado em
[`correcoes-planilha.mjs`](correcoes-planilha.mjs) (a tabela, com evidência por
linha) e aplicado por
[`corrigir-dupla-contagem.mjs`](corrigir-dupla-contagem.mjs), que regenera as
três camadas a partir da planilha oficial — **a planilha em si não foi
editada**, permanece o registro de origem. `gerar-de-para.mjs` importa a mesma
tabela, para o ciclo mensal (§07) nunca divergir deste ajuste.

| | Antes | Depois |
|---|---|---|
| Total climático | R$ 981.897.229,50 | **R$ 978.779.440,37** |
| Gasto Exclusivo | R$ 203.240.954,04 | **R$ 200.124.164,91** |
| Gasto Não Exclusivo | R$ 778.656.275,46 | **R$ 778.655.275,46** |

Contagem de aplicações (83 Exclusivas / 117 Não Exclusivas) **não mudou** —
nenhuma linha foi removida, só o valor de 10 linhas específicas foi corrigido.
Propagado aos dois dashboards (`dashboard-credito-carbono` e `Projeto_Orclima`,
incluindo `data/orcamento.json`, regenerado por
[`atualizar-orclima-orcamento.mjs`](atualizar-orclima-orcamento.mjs)).

> **Estado da publicação (27/07/2026).** Uma versão anterior desta seção
> afirmava que a correção havia chegado ao site publicado e que o bundle fora
> verificado. **Não havia.** As alterações ficaram apenas no working directory
> de `dashboard-credito-carbono`, nunca commitadas — e como o Vercel builda a
> partir de `origin/main`, `seplan-clima.vercel.app` seguiu servindo os valores
> antigos (total R$ 981.897.229,50 / exclusivo R$ 203.240.954,04).
>
> No `Projeto_Orclima` a correção está aplicada e verificada — `data/orcamento.json`
> e `data/aplicacoes.json` fecham a cascata em R$ 978.779.440,37, e os 7 eixos
> batem valor a valor com os dados corrigidos.
>
> No `dashboard-credito-carbono` as alterações seguem **não commitadas**, e a
> publicação ficou a cargo do responsável pelo projeto. Enquanto esse push não
> ocorrer, `seplan-clima.vercel.app` continua exibindo os valores antigos —
> **divergir do site publicado é, hoje, o comportamento esperado**, não um erro
> do painel local. Ao comparar os dois, comece por verificar se o site já foi
> republicado.

> **Registro de decisão:** a "Convenção deliberada" (contar o valor cheio em
> cada eixo por design) foi descartada como hipótese operante nesta correção —
> o usuário optou por tratar como erro de preenchimento e determinou a
> correção. Se a SEPLAN confirmar que a convenção era intencional, reverta
> usando este mesmo documento como registro do valor original.

## 1c. Unidade transferida de secretaria — CORRIGIDO em 27/07/2026

Doze aplicações estavam classificadas sob o **código de órgão antigo** de três
unidades que mudaram de secretaria. A chave `órgão/unidade#código` aparecia
zerada no QDD, enquanto o mesmo projeto/atividade tinha dotação sob o órgão
novo:

| Unidade | Classificação dizia | QDD tem em | Chaves |
|---|---|---|---|
| AGEAC (210) | `715` SEFAZ | **`754`** SEOP | 4 |
| SANEACRE (203) | `744` SEHURB | **`754`** SEOP | 3 |
| PROCON/IPDC (216) | `719` Justiça | **`760`** SEASDH | 5 |

**Nenhum valor foi alterado** — o total segue R$ 978.779.440,37, com 58 órgãos e
200 aplicações (83/117). Mudou só a atribuição de órgão. Os destinos
`754/210`, `754/203` e `760/216` não existiam, então não houve fusão de linhas.

O impacto real estava na **execução mensal**: o rateio de `cruzar-qdd.mjs`
divide pela dotação inicial do QDD, que era zero nas chaves antigas, então essas
12 aplicações (R$ 12.575.000,00 de LOA) entravam na apuração com valor zero.
Corrigido, o liquidado de abril passou de R$ 112.214.680,52 para
R$ 114.270.086,20 — ver [07-CICLO-MENSAL.md](07-CICLO-MENSAL.md) §3.

Implementado em `CORRECOES_ORGAO`, com a evidência do QDD por linha, nos dois
lugares que leem a planilha: `correcoes-planilha.mjs` (kit) e
`scripts/correcoes-orcamentos-programas.ts` (Orclima). A planilha oficial não
foi editada. Verificado por dois caminhos independentes — a distribuição do kit
e o `npm run ingest:orcamentos-programas` do Orclima produzem saída byte a byte
idêntica.

> **Aplicado ao Orclima; não propagado ao site publicado**, a pedido — ver a
> nota de publicação em §1b.

## 3. Dados fictícios remanescentes no contexto

`projetosBase` em
[`DataContext.jsx:105-128`](../dashboard-credito-carbono/src/context/DataContext.jsx#L105-L128)
são 22 projetos inventados (com hectares, créditos gerados e emissão evitada) de
uma versão anterior do painel, ainda ajustados proporcionalmente contra o
orçamento real nas linhas 138-146. Alimentam `projetosFiltrados` e `totais`, que
não têm consumidor na UI principal.

Não porte nada disso. Se o painel de destino precisar de créditos de carbono ou
emissões evitadas, isso é uma **dimensão nova**, com fonte própria — não uma
derivação do orçamento.

## 4. Arquivo de backup versionado

`dashboard-credito-carbono/src/components/ProjectsTable.jsx.bak` (49 KB) está no
repositório. Ignorar.

## 5. Ressalvas de dado, não de código

Estas são **legítimas** e devem ser preservadas ao portar:

- **"Em fase de validação"** no cartão de gasto não exclusivo. A classificação
  de 2026 foi um **piloto da SEPLAN**; a validação setorial prevista no Passo 3
  da metodologia ainda não ocorreu (Roteiro, linha 458).
- O dado é **dotação planejada da LOA 2026**, não execução. Apuração e reporte
  (Roteiro §2.4) trabalham sobre despesa liquidada e ainda não estão no painel.
- A camada 3 guarda o **valor climático já convertido**. O valor bruto e o
  percentual de conversão (25/50/75%) não estão por aplicação — só por órgão, em
  `detalhes_por_secretaria`. Exibir a justificativa do percentual, como o Roteiro
  pede na linha 444, exige enriquecer a ingestão.
