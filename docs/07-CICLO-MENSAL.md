# 07 — Ciclo mensal: apuração da execução

## O que é mensal e o que não é

| Insumo | Frequência | Por quê |
|---|---|---|
| **QDD** (`QDD_Orclim.xlsx`) | **mensal** | É o *"Quadro de Detalhamento da Despesa Mensal"*, com parâmetro `Mês` e as colunas de execução |
| `ORCAMENTOS - PROGRAMAS.xlsx` | anual | É a LOA classificada — só muda se houver reclassificação |
| `FUNÇÕES.xlsx` | raro | Só muda se a metodologia mudar |
| `Orçamento Climático_Dotações…xlsx` | anual | Quadro de Alocação e Classificação |

Colunas de execução do QDD: `Dotação Inicial (A)` · `Suplementado` ·
`Ini+Sup+Cor-Red (B)` · `Empenhado (C)` · `Liquidado (D)` · `A Liquidar` ·
`Pago (E)` · `A Pagar` · `Disponível (A-C)`.

> **O painel hoje mostra só a dotação da LOA.** Se você reingerir todo mês sem
> mudar o modelo, quase nada muda — a dotação só se move quando há crédito
> adicional. O que muda de verdade mês a mês é a **execução**, e para ela ainda
> não há campo no painel. Este documento entrega a apuração; levá-la à tela é
> uma decisão à parte.

## A chave que torna isso barato

A classificação climática (eixo + Exclusivo/Não Exclusivo) é o **ativo durável**:
não muda de mês para mês. Isolá-la numa tabela própria evita reclassificar
qualquer coisa a cada apuração.

A chave de junção existe dos dois lados:

| `ORCAMENTOS - PROGRAMAS` | `QDD` |
|---|---|
| `Órgão` (col. D, `715/199 - SEFAZ…`) + `Código - Projeto/Atividade` (col. F) | `Órgão` (A) + `Unidade` (B) + `Projeto Atividade` (E) |

Formato normalizado: **`órgão/unidade#códigoProjetoAtividade`** — ex.: `720/001#11230000`.

> Junte pela chave **composta**. Só o código não basta: o mesmo projeto/atividade
> aparece em órgãos diferentes, e agregar por código infla os valores.

## O ciclo

```bash
cd "…/Projeto Cŕedito de Carbono/kit-metodologia-orcamento-climatico"

# 1. Uma vez por ano (ou quando houver reclassificação)
node gerar-de-para.mjs
#    -> dados/de-para-classificacao.json   (200 aplicações, 192 chaves)

# 2. Todo mês, com a extração nova do QDD
node cruzar-qdd.mjs caminho/para/QDD_<mes>.xlsx --escrever
#    -> dados/execucao-2026-NN.json
```

Sem `--escrever` o script só relata. O mês e o exercício são lidos do próprio
cabeçalho do QDD — não há o que configurar.

## Resultado sobre o QDD de abril/2026

Já sobre a dotação corrigida (§05, item 1b — dupla contagem removida):

```
Cobertura : 192/192 chaves do de-para (100,0%)
Premissa  : 71 de 76 chaves 100% exclusivas batem com a dotação inicial do QDD
            +5 explicadas por lançamento em elemento de despesa (não são erro)
            0 sem explicação

  dotação LOA (inicial) : R$   978.779.440,37
  dotação atualizada    : R$ 1.108.680.780,82
  empenhado             : R$   257.233.229,63   (23,2%)
  liquidado             : R$   114.270.086,20   (10,3%)
  pago                  : R$    91.346.569,11   ( 8,2%)
```

Por eixo, execução sobre a dotação atualizada:

| Eixo | Dotação atualizada | Liquidado | Execução |
|---|---|---|---|
| III – Adaptação | R$ 481.412.320,28 | R$ 54.335.705,64 | 11,3% |
| II – Mitigação | R$ 405.353.001,78 | R$ 20.991.874,43 | 5,2% |
| I – Desenv. Sustentável | R$ 140.390.616,34 | R$ 21.655.804,37 | 15,4% |
| IV – Justiça Climática | R$ 41.567.770,91 | R$ 13.067.254,36 | 31,4% |
| VII – Resposta Emergencial | R$ 30.530.676,51 | R$ 711.819,06 | 2,3% |
| VI – Educação e Inovação | R$ 8.653.895,00 | R$ 3.318.885,13 | 38,4% |
| V – Governança | R$ 772.500,00 | R$ 188.743,22 | 24,4% |

É exatamente o alerta que o Roteiro pede na linha 486: *"se um eixo estratégico
apresenta baixa execução financeira, o sistema deve apontar esse alerta"*. O Eixo
VII está em 2,3% em abril.

---

## Três ressalvas que precisam acompanhar qualquer publicação

**1. O rateio é uma estimativa, não uma regra da metodologia.**
O QDD traz a execução do projeto/atividade inteiro. Para gastos Não Exclusivos,
só parte é climática. O `cruzar-qdd.mjs` rateia pela razão
`dotação climática ÷ dotação inicial do QDD`, assumindo que o componente
climático executa no mesmo ritmo do resto da ação. **O Roteiro não define esse
critério** (§2.4 manda apurar a execução das dotações marcadas, sem dizer como
repartir uma ação de finalidade múltipla). Precisa de validação da SEPLAN antes
de virar número oficial.

**2. Use a dotação atualizada como denominador.**
Houve suplementação: a dotação climática subiu de R$ 978,8 mi (LOA) para
R$ 1,11 bi. Dividir a execução pela LOA produz percentuais falsos — na primeira
versão deste cruzamento o Eixo VI apareceu com **115,3%** de liquidação, o que é
impossível. O denominador correto é `Ini+Sup+Cor-Red (B)`.

**3. Duas correções já aplicadas; das 8 divergências restantes, só 3 são reais.**
Os 2 códigos de 7 dígitos (`759/001#1152000`, `744/203#1130000`) foram
corrigidos — dígito perdido na digitação, confirmado no QDD pelo mesmo
órgão/unidade e texto de aplicação (ver `correcoes-planilha.mjs`). Cobertura
subiu de 99,0% para 100%. As 8 chaves 100%-exclusivas que somavam valor
duplicado entre dois eixos também foram corrigidas (§05, item 1b) — 3 delas
eram justamente "100% exclusivas", então a premissa subiu de 65/75 para 68/76.

Restam **8 chaves 100%-exclusivas** que não batem com a dotação inicial do QDD.
**A maioria não é erro** — é a premissa do cruzamento que está errada, como o
teste abaixo demonstra.

### A premissa falsa

`cruzar-qdd.mjs` assume que, numa chave 100% exclusiva, o valor climático deve
igualar a dotação inicial do **projeto/atividade** no QDD. Mas a classificação
foi lançada, em vários casos, por **elemento de despesa** — grão mais fino. Uma
mesma chave `órgão/unidade#projetoAtividade` abre em várias linhas de elemento
no QDD (`3390-39`, `4490-51`, `4490-61`…), e o classificador marcou só algumas.

Teste feito: para cada uma das 8 chaves, buscar um subconjunto de linhas de
elemento do QDD que some **exatamente** o valor da camada 3. **5 das 8 têm
subconjunto exato:**

| Chave | Camada 3 | Linhas do QDD que somam esse valor |
|---|---|---|
| `754/001#10990000` Orlas (SEOP) | R$ 17.400.000,00 | 3 linhas `4490-51`: 4,8 mi + 3,6 mi + 9,0 mi |
| `744/001#10590000` Encostas | R$ 9.362.139,29 | `4490-51` 9.361.139,29 + `3340-41` 1.000,00 |
| `744/201#10990000` Orlas (DERACRE) | R$ 3.295.000,00 | 2 linhas `4490-51`: 295.000 + 3.000.000 |
| `744/001#10580000` Parques | R$ 1.000,00 | uma linha `3390-39` de R$ 1.000,00 |
| `759/001#11520000` Etnoturismo | R$ 1,00 | uma linha `3390-36` de R$ 1,00 |

Nos três primeiros o padrão é inequívoco: são as linhas de **investimento**
(`4490-51`, obras e instalações), que é o que de fato constitui a ação
climática — o custeio associado não foi marcado. Valores como R$ 9.361.139,29
não coincidem por acaso.

Nos dois últimos a correspondência é exata mas **ambígua**: há várias linhas de
R$ 1.000,00 (e de R$ 1,00) na mesma chave, então não dá para saber qual foi
marcada. O que o teste estabelece é mais modesto e ainda assim decisivo: esses
valores **existem como linha de elemento no QDD**. Em particular, a hipótese
anterior de que o R$ 1,00 do Etnoturismo seria "outro dígito perdido" está
**descartada** — R$ 1,00 é um valor de elemento legítimo naquela chave, não um
R$ 91.576,49 digitado errado.

**Conclusão: essas 5 não devem ser "corrigidas".** Alterá-las para a dotação do
projeto/atividade inteiro inflaria o Orçamento Climático em R$ 1,5 milhão,
incluindo custeio que o classificador deliberadamente deixou de fora.

### As outras 3 são unidade transferida de órgão — e o problema é maior

As 3 restantes têm dotação **zero** no QDD, em todas as linhas da chave. A causa
não é dinheiro faltando: é que a **unidade mudou de secretaria** e a
classificação ficou no código de órgão antigo. O mesmo projeto/atividade aparece
no QDD, com o valor certo, sob outro órgão.

Ao procurar esse padrão em **todas** as chaves — não só nas 100% exclusivas —
aparecem **12 chaves, somando R$ 12.575.000,00**, em três transferências:

| Unidade | Classificação diz | QDD tem em | Chaves |
|---|---|---|---|
| AGEAC (210) | `715` SEFAZ | **`754`** SEOP | 4 |
| SANEACRE (203) | `744` SEHURB | **`754`** SEOP | 3 |
| PROCON/IPDC (216) | `719` Justiça | **`760`** SEASDH | 5 |

Em 10 das 12 o valor bate **ao centavo** com a dotação sob o órgão novo. Nas 2
restantes (SANEACRE, abastecimento de água e esgoto) o valor climático é menor
que a dotação — esperado, são Não Exclusivas. A planilha
`Orçamento Climático_Dotações` corrobora: lá o órgão está escrito **"AGEAC
(SEOP)"**, e Eficiência Energética aparece sob SEOP.

**Por que isso importa mais que os R$ 12,6 mi sugerem.** O rateio divide pela
dotação inicial do QDD. Nessas chaves o denominador é **zero**, então as 12
aplicações entram na execução mensal com valor **zero** — some R$ 12,6 milhões
de Orçamento Climático da apuração, sem nenhum aviso. E a premissa antiga só
enxergava 3 delas, porque as outras 9 não são 100% exclusivas e nunca eram
testadas.

**A correção é o código de órgão na classificação, não o valor** — e foi
**aplicada em 27/07/2026**. As 12 linhas estão em `CORRECOES_ORGAO`
(`correcoes-planilha.mjs` no kit, `scripts/correcoes-orcamentos-programas.ts`
no Orclima), com a evidência do QDD linha a linha. A planilha oficial não foi
editada — as correções são aplicadas em memória na leitura, como as anteriores.

O que mudou e o que não mudou:

| | Antes | Depois |
|---|---|---|
| Total climático (LOA) | R$ 978.779.440,37 | **inalterado** |
| Órgãos · aplicações | 58 · 200 (83/117) | **inalterado** |
| Dotação atualizada | R$ 1.094.595.834,95 | R$ 1.108.680.780,82 |
| Empenhado | R$ 252.192.592,16 | R$ 257.233.229,63 |
| Liquidado | R$ 112.214.680,52 | R$ 114.270.086,20 |
| Pago | R$ 89.655.173,30 | R$ 91.346.569,11 |

O total da LOA não se move porque nada de valor foi alterado — só a atribuição
de órgão. O que cresce é a **execução**, que antes era perdida: com o
denominador deixando de ser zero, a execução dessas 12 aplicações passa a ser
contada. Os órgãos `754/210 - AGEAC`, `754/203 - SANEACRE` e `760/216 - PROCON`
não existiam antes, então não houve fusão e a contagem seguiu em 58.

Verificação feita: a cascata fecha em R$ 978.779.440,37 nas três camadas; o
`cruzar-qdd.mjs` reporta **71 batem + 5 por elemento = 76, zero sem
explicação**, sem nenhuma transferência pendente; e o ingest próprio do Orclima
(`npm run ingest:orcamentos-programas`) produz saída **byte a byte idêntica** à
distribuída pelo kit — dois caminhos independentes chegando ao mesmo resultado.

## Se for levar a execução ao painel

É **dimensão nova**, não reinterpretação dos campos atuais. A camada 3 ganharia:

```jsonc
{ "aplicacao": "…", "dotacao": 784910.8, "classificacao": "Exclusivo",
  "execucao": { "ateMes": 4, "dotacaoAtualizada": 0, "empenhado": 0, "liquidado": 0, "pago": 0 } }
```

E a UI ganharia uma barra de execução por eixo. Antes disso, resolva a ressalva
1 — publicar percentual de execução com critério de rateio não validado é o tipo
de número que volta como questionamento de órgão de controle.
