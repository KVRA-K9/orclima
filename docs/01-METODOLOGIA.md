# 01 — Metodologia do Orçamento Climático

Destilado operacional do [Roteiro Operativo](fonte/Roteiro%20Operativo%20para%20Or%C3%A7amento%20Clim%C3%A1tico.md).
Aqui está só o que se aplica ao classificar uma dotação e ao modelar os dados — o
texto institucional, os exemplos longos e os apêndices completos ficam na fonte.
Cada regra indica a linha de origem no Roteiro, para conferência.

Base legal: **Lei Estadual nº 11.287/2025** (institui os 7 eixos) e
**Decreto nº 12.705/2025** (Taxonomia Sustentável Brasileira, usada como
referência de objetividade na classificação — Roteiro, linha 424).

---

## 1. Os sete Eixos Estruturantes

Os eixos funcionam como **marcadores climáticos**: são eles que estruturam,
monitoram e avaliam onde os recursos estão sendo aplicados (Roteiro, linha 237).

| Nº | Romano | Rótulo canônico |
|---|---|---|
| 1 | I | Eixo I – Desenvolvimento Sustentável e Bioeconomia |
| 2 | II | Eixo II – Mitigação das Mudanças Climáticas |
| 3 | III | Eixo III – Adaptação às Mudanças Climáticas |
| 4 | IV | Eixo IV – Justiça Climática e Inclusão Social |
| 5 | V | Eixo V – Governança Ambiental e Transparência |
| 6 | VI | Eixo VI – Educação Ambiental e Inovação Climática |
| 7 | VII | Eixo VII – Resposta Climática Emergencial e Proteção Civil |

> **Atenção à grafia.** O separador é travessão **`–` (en dash, U+2013)**, não
> hífen. Os rótulos acima são a chave de junção entre as camadas de dados — um
> hífen comum quebra silenciosamente o join. A forma canônica está em
> [`dados/eixos-canonicos.json`](dados/eixos-canonicos.json); **use sempre esse
> arquivo, nunca redigite o rótulo**.
>
> Duas variações erradas circulam e devem ser rejeitadas: *"Eixo VI – Educação
> Ambiental e Inovação"* (falta "Climática") e *"Eixo VII – Gestão de Riscos e
> Proteção Civil"* (o correto é "Resposta Climática Emergencial e Proteção
> Civil"). Ver [05-DIVERGENCIAS-CONHECIDAS.md](05-DIVERGENCIAS-CONHECIDAS.md).

## 2. Definição

> Considera-se Orçamento Climático a soma de todos os gastos orçamentários
> destinados a programas que visam à implementação dos 7 Eixos Estruturantes.
> — Roteiro, linha 365

## 3. Etapa A — Alocação Macro (Roteiro, §2.2)

Trabalha na arquitetura da LOA, no nível de **Função e Subfunção**.

1. Selecionar as Funções/Subfunções elegíveis segundo o **Apêndice A** do
   Roteiro ("Quadro de Seleção das Funções e Subfunções por Eixo", linha 580).
2. Direcionar cada código orçamentário ao seu Eixo Estruturante (linha 341).
3. **Regra de Ouro** (linha 347): busca-se a melhor aderência temática, mas
   *uma mesma subfunção pode ser vinculada a múltiplos eixos simultaneamente*,
   desde que gere múltiplos benefícios. Exemplo do Roteiro: *Desenvolvimento
   Rural* pontua ao mesmo tempo no Eixo I e no Eixo II, compartilhando seu
   impacto orçamentário.
4. **Critério de exclusão** (linha 355): o que não apresenta relevância direta
   nem potencial **não é alocado a nenhum eixo**. Isso evita a diluição do
   conceito de gasto climático.

> Consequência para o modelo de dados: a relação órgão → eixo é **1:N**, não 1:1.
> É por isso que a camada 2 é um mapa `eixo → valor` e não um campo único.

## 4. Etapa B — Alocação Micro (Roteiro, §2.3)

Desce ao nível de **programa, projeto e/ou ação** — é aqui que nasce a dotação
individual que o dashboard exibe.

### Passo 1 — Análise estrutural (linha 412)

Não basta o nome da ação. Verifica-se:

- **Descrição e objetivos** — o que a ação entrega de fato?
- **Metas e indicadores** — como o sucesso é medido sob a ótica da sustentabilidade?

Esse escrutínio determina a **natureza** (mitigação, adaptação, governança…) e a
**intensidade** (grau de impacto) da contribuição.

### Passo 2 — Marcador de intensidade (linha 426)

**Gasto Exclusivo — 100%**
A finalidade principal e única é a contribuição climática. A ação **não teria
justificativa de existência sem a relevância climática** (ex.: reflorestamento,
fiscalização ambiental). 100% da despesa entra no Orçamento Climático.

**Gasto Não Exclusivo (Indireto) — percentual de conversão**
A ação tem múltiplos objetivos; a contribuição climática é clara e real, mas
concorre com finalidades sociais, econômicas ou de infraestrutura. Só a parcela
efetivamente vinculada à agenda climática é contabilizada, via **percentual de
conversão** em três níveis (linha 438):

| Intensidade | % | Critério de aplicação |
|---|---|---|
| **Acessória** | 25% | O componente climático é item complementar ou parte menor da ação global. |
| **Equilibrada** | 50% | Objetivos climáticos e finalidades gerais têm pesos semelhantes. |
| **Preponderante** | 75% | A maior parte do investimento foca resiliência ou descarbonização, mantendo benefício social/urbano amplo. |

O percentual converte o montante total da ação em **"Investimento Climático
Real"**, com base na proporção de insumos, dedicação de equipe ou volume de
atividades voltadas ao clima.

> **Obrigação de justificativa** (linha 444): ao registrar o percentual, é
> preciso descrever *qual insumo ou atividade serviu de base para o cálculo*.
> Essa rastreabilidade é o que dá segurança jurídica perante os órgãos de
> controle e o cidadão.

### Passo 3 — Validação setorial (linha 446)

O Quadro de Alocação e Classificação é submetido aos órgãos setoriais, que
identificam lacunas e incorporam a visão de sua especialidade. Para 2026 a
classificação foi feita em **piloto pela SEPLAN** (linha 458) — a validação
setorial completa ainda está pendente, o que explica o marcador "em fase de
validação" exibido sobre o gasto não exclusivo no dashboard.

## 5. Etapa C — Apuração e reporte (Roteiro, §2.4)

Ocorre **após o encerramento do exercício** e não faz parte do dado de
planejamento que o dashboard exibe hoje. Foco na **despesa liquidada** (linha
480), consolidação do desempenho por eixo (linha 488) e validação setorial final
(linha 500).

> Implicação para o modelo: o dado atual é **dotação planejada (LOA 2026)**, não
> execução. Qualquer painel que venha a mostrar execução precisa de uma dimensão
> nova (`empenhado` / `liquidado` / `pago`), não de uma reinterpretação destes
> campos.

## 6. Números do exercício 2026

Apurados dos dados em [`dados/`](dados/) e conferidos nas três camadas.
Já refletem a correção de dupla contagem de 27/07/2026
(ver [05-DIVERGENCIAS-CONHECIDAS.md §1b](05-DIVERGENCIAS-CONHECIDAS.md)):

| Indicador | Valor |
|---|---|
| Órgãos atuantes | 58 |
| Aplicações programadas | **200** (83 exclusivas + 117 não exclusivas) |
| Gasto exclusivo | R$ 200.124.164,91 (20,4%) |
| Gasto não exclusivo | R$ 778.655.275,46 (79,6%) |
| **Total do Orçamento Climático** | **R$ 978.779.440,37** |

Por eixo:

| Eixo | Valor | % |
|---|---|---|
| III – Adaptação | R$ 436.983.938,89 | 44,6% |
| II – Mitigação | R$ 373.168.394,57 | 38,1% |
| I – Desenv. Sustentável e Bioeconomia | R$ 123.623.514,39 | 12,6% |
| IV – Justiça Climática | R$ 23.110.335,52 | 2,4% |
| VII – Resposta Emergencial | R$ 18.346.667,00 | 1,9% |
| VI – Educação e Inovação | R$ 2.878.090,00 | 0,3% |
| V – Governança | R$ 668.500,00 | 0,1% |

---

Próximo: [02-ARQUITETURA-DE-DADOS.md](02-ARQUITETURA-DE-DADOS.md) — como essa
metodologia vira estrutura de dados.
