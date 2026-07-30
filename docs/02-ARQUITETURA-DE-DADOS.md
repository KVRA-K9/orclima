# 02 — Arquitetura de dados: as três camadas

Esta é a peça central do kit. A metodologia do documento anterior vira dado
através de **três camadas de granularidade crescente**, ligadas por uma cascata
de integridade. É esse desenho — não o código de nenhum framework — que faz
*todas* as dotações aparecerem e ficarem segmentadas por eixo.

| Camada | Grão | Arquivo-modelo | Responde a |
|---|---|---|---|
| **1 · Resumo** | Estado | [`dados/orcamento_real.json`](dados/orcamento_real.json) | KPIs, totais, proporção exclusivo/não exclusivo |
| **2 · Alocação** | Órgão × Eixo | [`dados/orcamento_por_orgao_eixo.json`](dados/orcamento_por_orgao_eixo.json) | filtro por eixo, subtotais, gráfico por eixo |
| **3 · Aplicação** | Órgão × Eixo × Ação | [`dados/aplicacoes_por_orgao_eixo.json`](dados/aplicacoes_por_orgao_eixo.json) | **cada dotação individual visível** |

A camada 3 é a que costuma faltar. Sem ela o painel mostra agregados e o cidadão
não consegue ver *no que* o dinheiro foi programado. Com ela, cada linha da
planilha oficial tem um lugar na tela.

---

## Camada 1 — Resumo

```jsonc
{
  "numero_orgaos_atuantes": 58,
  "acoes_exclusivas": 83,
  "acoes_nao_exclusivas": 117,
  "gasto_exclusivo": 200124164.91,
  "gasto_nao_exclusivo": 778655275.46,
  "total_orcamento_climatico": 978779440.37,

  "orcamento_por_secretaria": { "445/001 - SEGOV": 100000.0 },
  "distribuicao_por_orgao":   { "445/001 - SEGOV": { "Exclusivo": 0, "Não Exclusivo": 100000.0, "Total": 100000.0 } },
  "detalhes_por_secretaria":  [ { "sigla": "…", "valor_bruto": 0, "percentual": 0, "intensidade": "Exclusivo (0%) / Não Exclusivo (100%)", "tipo": "Não Exclusivo", "valor_climatico": 0 } ]
}
```

`acoes_exclusivas` e `acoes_nao_exclusivas` são **contagens de aplicações**, não
valores. É o que alimenta os cartões "Dotação Exclusiva: 83".

## Camada 2 — Alocação por órgão × eixo

```jsonc
{
  "452/001 - DEFESA CIVIL": {
    "eixos": {
      "Eixo III – Adaptação às Mudanças Climáticas": 1000.0,
      "Eixo VII – Resposta Climática Emergencial e Proteção Civil": 17753000.0
    },
    "total": 17754000.0
  }
}
```

O mapa `eixos` é o **N** da relação 1:N criada pela Regra de Ouro (§3 da
metodologia). É a chave de leitura de praticamente toda a UI: o filtro por eixo,
a coluna "Eixos Temáticos", os subtotais e o gráfico de barras.

## Camada 3 — Aplicações programadas

```jsonc
{
  "715/512 - CDSA": {
    "Eixo I – Desenvolvimento Sustentável e Bioeconomia": [
      { "aplicacao": "PROSPECÇÃO DE MERCADOS DA ECONOMIA VERDE NACIONAL E INTERNACIONAL.",
        "dotacao": 784910.8,
        "classificacao": "Exclusivo" },
      { "aplicacao": "INCENTIVO E REGULAÇÃO DE SERVIÇOS AMBIENTAIS - CDSA.",
        "dotacao": 20000.0,
        "classificacao": "Exclusivo" }
    ]
  }
}
```

Campos: `aplicacao` (texto da ação, como na fonte oficial), `dotacao` (valor
climático já convertido — se Não Exclusivo, **já com o percentual aplicado**) e
`classificacao` (`"Exclusivo"` | `"Não Exclusivo"`).

> **A `dotacao` é o valor climático, não o valor bruto da ação.** O percentual de
> conversão (25/50/75%) é aplicado *na ingestão*, não na renderização. Se você
> quiser exibir o valor bruto e o percentual lado a lado — o que o Roteiro
> recomenda para transparência (linha 444) — precisa carregar dois campos novos
> (`valor_bruto`, `percentual`) na camada 3. Hoje eles só existem, por órgão, em
> `detalhes_por_secretaria` da camada 1.

---

## A cascata de integridade

É a regra que garante que nenhuma dotação suma nem seja contada duas vezes:

```
Σ dotacao das aplicações de (órgão, eixo)   ==   camada2[órgão].eixos[eixo]
Σ camada2[órgão].eixos                       ==   camada2[órgão].total
Σ camada2[*].total                           ==   total_orcamento_climatico
gasto_exclusivo + gasto_nao_exclusivo        ==   total_orcamento_climatico
contagem de aplicações                       ==   acoes_exclusivas + acoes_nao_exclusivas
```

Tolerância: **R$ 0,01** (arredondamento de centavos). Qualquer desvio maior é
erro de ingestão, não de arredondamento.

O verificador está em [`verificar-integridade.mjs`](verificar-integridade.mjs):

```bash
node verificar-integridade.mjs
```

Resultado sobre os dados de 2026 (LOA, exercício piloto):

```
200 aplicações  ·  R$ 978.779.440,37  ·  0 divergências  ·  0 lacunas
83 exclusivas   ·  R$ 200.124.164,91
117 não exclusivas · R$ 778.655.275,46
```

Rode isso **toda vez que reingerir a planilha**. É a diferença entre um painel
auditável e um painel plausível.

---

## Nota sobre a chave de eixo

As três camadas aqui usam o **rótulo completo** como chave
(`"Eixo III – Adaptação às Mudanças Climáticas"`). É legível e auto-documentado,
mas frágil: depende de acento, caixa e do travessão `–`.

A alternativa é chavear pelo **número** (`"3"`), com o rótulo resolvido em tempo
de render a partir de [`dados/eixos-canonicos.json`](dados/eixos-canonicos.json).
Mais robusto, menos legível no arquivo cru. **O Projeto_Orclima já adota a chave
numérica** — a conversão está descrita em
[04-GUIA-PORTABILIDADE-ORCLIMA.md](04-GUIA-PORTABILIDADE-ORCLIMA.md).

Escolha um dos dois e seja consistente. O que não funciona é misturar.

---

Próximo: [03-PADROES-UI.md](03-PADROES-UI.md) — como essa estrutura vira tela.
