# 06 — Atualização de dados: um lugar só

O kit é a **fonte única**. Nenhum dashboard é editado à mão: os dados nascem em
[`dados/`](dados/) e são distribuídos por um comando.

```
                    ┌─ dados/ (FONTE ÚNICA) ─┐
  planilha oficial ─┤  camadas 1, 2 e 3      ├─ node distribuir.mjs ─┬─→ SEPLAN Clima  [PUBLICADO]
                    └────────────────────────┘                       └─→ Orclima
```

Antes de escrever qualquer coisa, `distribuir.mjs` roda a verificação de
integridade e **aborta se a cascata estiver quebrada**. Dado inconsistente não
chega a nenhum painel.

---

## O ciclo

```bash
cd "…/Projeto Cŕedito de Carbono/kit-metodologia-orcamento-climatico"

# 1. Atualize os JSONs em dados/ a partir da nova planilha (ver "Ingestão" abaixo)

# 2. Confira sem escrever nada
node distribuir.mjs --conferir

# 3. Distribua
node distribuir.mjs
```

Só isso. Cada destino recebe o arquivo **no formato que ele espera** — o SEPLAN
Clima com chave de eixo por rótulo, o Orclima com chave numérica e campo `tipo`.
A conversão é do script, não sua.

## O site publicado é protegido

`https://seplan-clima.vercel.app/` é servido pelo `dashboard-credito-carbono`.
Em [`destinos.json`](destinos.json) ele está marcado `"publicado": true`, o que
significa: **`distribuir.mjs` nunca escreve nele**. Apenas relata se está em dia:

```
SEPLAN Clima [PUBLICADO]
  DIVERGENTE  src/data/orcamento_real.json  (protegido — não escrito, atualizar pendente)
```

Para propagar de fato, é preciso pedir explicitamente:

```bash
node distribuir.mjs --incluir-publicado
```

E aí o deploy ainda depende de você: commitar e dar push no repositório
`KVRA-K9/Projeto-SEPLAN-Clima`, de onde a Vercel publica. Duas barreiras
deliberadas entre uma edição de dado e o ar.

## Adicionar um terceiro dashboard

Acrescente uma entrada em [`destinos.json`](destinos.json):

```jsonc
{
  "nome": "Novo painel",
  "raiz": "../../Projeto_X",           // relativo a esta pasta
  "formato": "numero",                  // "rotulo" ou "numero"
  "publicado": false,
  "arquivos": {
    "data/aplicacoes.json": "aplicacoes",
    "data/resumo.json": "resumo"
  }
}
```

Artefatos disponíveis: `resumo` (camada 1), `alocacao` (camada 2), `aplicacoes`
(camada 3) e `eixos` (os 7 canônicos). Destino inexistente é pulado com aviso,
não quebra a distribuição dos demais.

Precisa de um formato novo? Adicione uma entrada em `artefatos` no
[`distribuir.mjs`](distribuir.mjs) — os de `formato: "rotulo"` são cópia byte a
byte dos arquivos do kit, os de `"numero"` passam pela transformação de chave.

## Idempotência

Arquivo já idêntico não é reescrito — aparece como `em dia`. Isso importa: os
artefatos em formato `rotulo` são copiados **byte a byte**, sem reserialização,
então um destino em dia continua idêntico ao último byte e **não polui o `git
status`** com diffs de formatação.

## Ingestão (o passo que falta automatizar)

Hoje `dados/` é atualizado a partir da planilha por fora do kit — não há
conversor de XLSX aqui. As fontes ficam em [`fonte/`](fonte/) para
rastreabilidade.

O caminho para fechar essa lacuna já existe: o `scripts/ingest.ts` do Orclima lê
CSV e reconhece coluna de ação (`acao`, `aplicacao`, `programa`). Adaptá-lo para
gravar as três camadas em `dados/` do kit — em vez de gravar direto no painel —
tornaria o ciclo inteiro um comando só. Enquanto isso não acontece, o
`verificar-integridade.mjs` é a rede de proteção: se a ingestão manual errar,
a cascata não fecha e a distribuição é abortada.

## Solução de problemas

| Sintoma | Causa provável |
|---|---|
| `A cascata de integridade falhou` | A soma das aplicações não bate com a camada 2 ou 1. Rode `node verificar-integridade.mjs` para ver a linha exata. |
| `Rótulo de eixo fora do canônico` | Rótulo digitado à mão, provavelmente com hífen `-` em vez de travessão `–`. Use [`dados/eixos-canonicos.json`](dados/eixos-canonicos.json). |
| `destino não encontrado — pulado` | O caminho em `destinos.json` mudou. São relativos à pasta do kit. |
| Mudei os dados e o site não mudou | Esperado: destino publicado é protegido. Veja a seção acima. |
