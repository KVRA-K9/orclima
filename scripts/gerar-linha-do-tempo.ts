/**
 * Gera a planilha "Linha do Tempo — Orçamento Climático.xlsx" na raiz do projeto.
 *
 *   node scripts/gerar-linha-do-tempo.ts
 *
 * Três abas: tudo em ordem cronológica, só o processo institucional, só a
 * construção do painel. O texto é escrito para quem não conhece o projeto —
 * sem jargão técnico.
 *
 * Para acrescentar um marco novo: some uma entrada em EVENTOS e rode de novo.
 */
import { resolve } from "node:path";

import ExcelJS from "exceljs";

type Frente = "Institucional" | "Painel";
type Situacao = "Concluído" | "Em andamento" | "Próximo passo";

type Evento = {
  /** Usada para ordenar; formato ISO (AAAA-MM-DD). Aproximada quando o dia é desconhecido. */
  ordem: string;
  /** Como a data aparece na planilha — pode ser um período ("2025"). */
  data: string;
  frente: Frente;
  etapa: string;
  oQueFoiFeito: string;
  entrega: string;
  situacao: Situacao;
  ondeConferir: string;
};

const EVENTOS: Evento[] = [
  {
    ordem: "2009-12-29",
    data: "29/12/2009",
    frente: "Institucional",
    etapa: "Base anterior",
    oQueFoiFeito:
      "O Brasil criou a Política Nacional sobre Mudança do Clima, que fixa metas de redução de emissões e define o papel dos estados nas ações climáticas.",
    entrega: "Lei federal nº 12.187/2009 (PNMC)",
    situacao: "Concluído",
    ondeConferir: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12187.htm",
  },
  {
    ordem: "2010-10-22",
    data: "22/10/2010",
    frente: "Institucional",
    etapa: "Base anterior",
    oQueFoiFeito:
      "O Acre criou o SISA, sistema que remunera quem presta serviços ambientais. É o alicerce da política climática do estado.",
    entrega: "Lei estadual nº 2.308/2010 (SISA/AC)",
    situacao: "Concluído",
    ondeConferir: "https://legis.ac.gov.br/detalhar/475",
  },
  {
    ordem: "2021-12-17",
    data: "17/12/2021",
    frente: "Institucional",
    etapa: "Base anterior",
    oQueFoiFeito:
      "O SISA foi atualizado e passou a incluir o programa ISA Clima, voltado a mitigação e adaptação às mudanças do clima.",
    entrega: "Lei estadual nº 3.880/2021",
    situacao: "Concluído",
    ondeConferir: "https://legis.ac.gov.br/detalhar/4977",
  },
  {
    ordem: "2023-11-28",
    data: "28/11/2023",
    frente: "Institucional",
    etapa: "Base anterior",
    oQueFoiFeito:
      "O estado organizou sua Rede de Governança Ambiental, definindo quem faz o quê na agenda ambiental e climática.",
    entrega: "Decreto estadual nº 11.374/2023",
    situacao: "Concluído",
    ondeConferir: "https://legis.ac.gov.br/detalhar/5814",
  },
  {
    ordem: "2025-10-31",
    data: "31/10/2025",
    frente: "Institucional",
    etapa: "Referência de classificação",
    oQueFoiFeito:
      "O governo federal publicou a Taxonomia Sustentável Brasileira: uma régua oficial para dizer o que conta como gasto sustentável. Ela é usada como referência ao classificar as dotações do Acre.",
    entrega: "Decreto federal nº 12.705/2025",
    situacao: "Concluído",
    ondeConferir: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12705.htm",
  },
  {
    ordem: "2025-11-10",
    data: "10/11/2025",
    frente: "Institucional",
    etapa: "Marco legal",
    oQueFoiFeito:
      "Foi criado o Orçamento Climático do Estado do Acre: a lei manda identificar, dentro do orçamento do estado, todo o dinheiro destinado a ações de clima, organizado em 7 eixos estruturantes.",
    entrega: "Lei estadual nº 4.679, de 10/11/2025",
    situacao: "Concluído",
    ondeConferir: "https://legis.ac.gov.br/detalhar/6600",
  },
  {
    ordem: "2025-11-15",
    data: "Nov/2025",
    frente: "Institucional",
    etapa: "Publicação oficial",
    oQueFoiFeito:
      "A SEPLAN publicou o documento oficial do Orçamento Climático, apresentando diretrizes, metas e ações de mitigação e adaptação.",
    entrega: "Publicação “Orçamento Climático” (SEPLAN)",
    situacao: "Concluído",
    ondeConferir: "https://seplan.ac.gov.br/wp-content/uploads/2025/11/ORCAMENTO-CLIMATICO.pdf",
  },
  {
    ordem: "2025-11-20",
    data: "2025",
    frente: "Institucional",
    etapa: "Metodologia",
    oQueFoiFeito:
      "Foi escrito o Roteiro Operativo, o manual que explica como classificar cada despesa: primeiro pelo tipo de gasto (função e subfunção), depois olhando ação por ação, e marcando se o gasto é 100% climático (Exclusivo) ou só em parte (Não Exclusivo, com 25%, 50% ou 75%).",
    entrega: "Roteiro Operativo para Orçamento Climático",
    situacao: "Concluído",
    ondeConferir: "docs/fonte/Roteiro Operativo para Orçamento Climático.md",
  },
  {
    ordem: "2025-11-21",
    data: "2025",
    frente: "Institucional",
    etapa: "Metodologia",
    oQueFoiFeito:
      "Ficaram definidos os 7 eixos estruturantes que organizam todo o Orçamento Climático: Bioeconomia, Mitigação, Adaptação, Justiça Climática, Governança, Educação e Inovação, e Resposta Emergencial.",
    entrega: "Lista oficial dos 7 eixos, com a grafia padronizada",
    situacao: "Concluído",
    ondeConferir: "docs/01-METODOLOGIA.md · data/eixos-canonicos.json",
  },
  {
    ordem: "2025-12-01",
    data: "Fim de 2025",
    frente: "Institucional",
    etapa: "Dados oficiais",
    oQueFoiFeito:
      "As equipes montaram as planilhas que alimentam tudo: o quadro de dotações de 2026 já classificado por eixo, a lista de programas do orçamento, o quadro de funções e a relação com os ODS da ONU.",
    entrega:
      "Dotações 2026 · ORÇAMENTOS-PROGRAMAS · FUNÇÕES · Orçamento Climático_ODS",
    situacao: "Concluído",
    ondeConferir: "docs/fonte/",
  },
  {
    ordem: "2026-01-01",
    data: "2026",
    frente: "Institucional",
    etapa: "Orçamento do ano",
    oQueFoiFeito:
      "Entrou em vigor o orçamento de 2026 com a marcação climática aplicada: cada dotação já nasce ligada a um ou mais eixos.",
    entrega: "Orçamento Climático 2026 classificado por eixo e por órgão",
    situacao: "Concluído",
    ondeConferir: "data/orcamento.json",
  },
  {
    ordem: "2026-04-30",
    data: "Abr/2026",
    frente: "Institucional",
    etapa: "Primeira apuração de execução",
    oQueFoiFeito:
      "Foi feito o primeiro cruzamento entre a classificação climática e o relatório mensal de despesas (QDD), para ver quanto do dinheiro previsto já saiu do papel. Todas as 192 chaves foram encontradas — cobertura de 100%.",
    entrega:
      "Dotação atualizada R$ 1,109 bi · empenhado R$ 257,2 mi (23,2%) · liquidado R$ 114,3 mi (10,3%) · pago R$ 91,3 mi (8,2%)",
    situacao: "Concluído",
    ondeConferir: "docs/07-CICLO-MENSAL.md",
  },
  {
    ordem: "2026-07-27",
    data: "27/07/2026",
    frente: "Painel",
    etapa: "Início do projeto",
    oQueFoiFeito:
      "Foi aberto o projeto do site e do painel na internet, com a estrutura básica pronta para receber o conteúdo.",
    entrega: "Projeto criado (site em Next.js)",
    situacao: "Concluído",
    ondeConferir: "Repositório Projeto_Orclima",
  },
  {
    ordem: "2026-07-30a",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Preparação dos dados",
    oQueFoiFeito:
      "As planilhas oficiais foram lidas e transformadas nos dados que o painel usa, em três níveis: o total geral, o quanto cada órgão tem em cada eixo, e a lista de cada dotação uma a uma. Erros conhecidos da planilha (como uma dupla contagem) foram corrigidos no caminho.",
    entrega:
      "Base de dados do painel: resumo, órgão × eixo e 200 dotações detalhadas",
    situacao: "Concluído",
    ondeConferir: "data/orcamento.json · data/aplicacoes.json",
  },
  {
    ordem: "2026-07-30b",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Site institucional",
    oQueFoiFeito:
      "Ficou pronta a página de apresentação: o que é o Orçamento Climático, os 7 eixos explicados, a base legal e os relatórios para download.",
    entrega: "Página inicial do site",
    situacao: "Concluído",
    ondeConferir: "Página “/” do site",
  },
  {
    ordem: "2026-07-30c",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Painel de dados",
    oQueFoiFeito:
      "Ficou pronto o painel interativo: filtros por eixo e por órgão, cartões com os números principais, quatro gráficos (por eixo, por órgão, composição e gasto exclusivo por eixo) e uma tabela que abre em três níveis até chegar em cada dotação.",
    entrega: "Página “/painel” completa",
    situacao: "Concluído",
    ondeConferir: "Página “/painel” do site",
  },
  {
    ordem: "2026-07-30d",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Painel — abas complementares",
    oQueFoiFeito:
      "Foram acrescentadas a aba dos ODS, que liga cada eixo aos Objetivos de Desenvolvimento Sustentável da ONU, e a aba de instrumentos legais, com as leis e decretos que sustentam a política.",
    entrega: "Abas “ODS” e “Instrumentos legais”",
    situacao: "Concluído",
    ondeConferir: "data/ods.ts · data/instrumentos-legais.ts",
  },
  {
    ordem: "2026-07-30e",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Exportação",
    oQueFoiFeito:
      "O painel passou a gerar relatórios para baixar, em PDF e em Excel, respeitando os filtros que a pessoa escolheu na tela.",
    entrega: "Botões de exportar relatório (PDF e Excel)",
    situacao: "Concluído",
    ondeConferir: "lib/export.ts",
  },
  {
    ordem: "2026-07-30f",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Identidade visual",
    oQueFoiFeito:
      "O site ganhou a identidade do Governo do Acre, com tema claro e escuro e sete cores para os eixos escolhidas para serem legíveis nos dois temas.",
    entrega: "Paleta e tema claro/escuro",
    situacao: "Concluído",
    ondeConferir: "app/globals.css",
  },
  {
    ordem: "2026-07-30g",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Documentação",
    oQueFoiFeito:
      "Foram escritos sete documentos explicando a metodologia, como os dados são organizados, os padrões da tela, como atualizar os números e o que fazer todo mês.",
    entrega: "Pasta de documentação com 7 guias",
    situacao: "Concluído",
    ondeConferir: "docs/",
  },
  {
    ordem: "2026-07-30h",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Ajuste visual",
    oQueFoiFeito:
      "Cada instrumento legal passou a ter fundo próprio na tela, ficando mais fácil de distinguir um do outro.",
    entrega: "Melhoria na aba de instrumentos legais",
    situacao: "Concluído",
    ondeConferir: "components/painel/aba-instrumentos.tsx",
  },
  {
    ordem: "2026-07-30i",
    data: "30/07/2026",
    frente: "Painel",
    etapa: "Ajuste visual",
    oQueFoiFeito:
      "Os blocos passaram a aparecer suavemente conforme a pessoa rola a página, e o indicador de gasto “não exclusivo” ganhou uma nota explicando o que ele significa.",
    entrega: "Animação de entrada e nota explicativa",
    situacao: "Concluído",
    ondeConferir: "components/painel/kpi-cards.tsx",
  },
  {
    ordem: "2026-07-31",
    data: "31/07/2026",
    frente: "Painel",
    etapa: "Ajuste visual",
    oQueFoiFeito:
      "A animação de entrada foi unificada num mecanismo só e passou a valer também para os blocos que surgem depois, como os resultados de um filtro.",
    entrega: "Animação de entrada estável em toda a página",
    situacao: "Concluído",
    ondeConferir: "components/revelar-ao-rolar.tsx",
  },
  {
    ordem: "2026-08-19a",
    data: "Em aberto",
    frente: "Painel",
    etapa: "Próximo passo",
    oQueFoiFeito:
      "Hoje o painel mostra apenas o valor previsto no orçamento. Falta mostrar a execução: quanto já foi empenhado, liquidado e pago em cada eixo, mês a mês. A apuração já existe fora do painel; falta levá-la à tela.",
    entrega: "A definir",
    situacao: "Próximo passo",
    ondeConferir: "docs/07-CICLO-MENSAL.md",
  },
  {
    ordem: "2026-08-19b",
    data: "Em aberto",
    frente: "Institucional",
    etapa: "Próximo passo",
    oQueFoiFeito:
      "Rotina mensal: a cada nova extração do relatório de despesas (QDD), refazer o cruzamento e atualizar os números de execução por eixo.",
    entrega: "Apuração mensal de execução",
    situacao: "Em andamento",
    ondeConferir: "docs/07-CICLO-MENSAL.md",
  },
];

const NOTAS = [
  "As datas de 27 a 31 de julho de 2026 vêm do histórico de versões salvas do projeto (Git). Datas escritas como “2025” ou “Fim de 2025” são períodos aproximados, porque o dia exato não está registrado nos documentos.",
  "Divergência registrada: os documentos citam dois números diferentes para a lei do Orçamento Climático — nº 4.679/2025 e nº 11.287/2025. Esta planilha usa nº 4.679, de 10 de novembro de 2025, que é a que consta no legis.ac.gov.br e no site do painel.",
  "Para acrescentar novos marcos: edite a lista no arquivo scripts/gerar-linha-do-tempo.ts e rode “node scripts/gerar-linha-do-tempo.ts” de novo.",
];

const COLUNAS = [
  { header: "Data", key: "data", width: 14 },
  { header: "Frente", key: "frente", width: 15 },
  { header: "Etapa", key: "etapa", width: 26 },
  { header: "O que foi feito", key: "oQueFoiFeito", width: 68 },
  { header: "Resultado / Entrega", key: "entrega", width: 40 },
  { header: "Situação", key: "situacao", width: 16 },
  { header: "Onde conferir", key: "ondeConferir", width: 42 },
];

const VERDE = "FF15803D";
const VERDE_CLARO = "FFF0FDF4";
const CINZA_BORDA = "FFD1D5DB";

const CORES_SITUACAO: Record<Situacao, { fundo: string; texto: string }> = {
  "Concluído": { fundo: "FFDCFCE7", texto: "FF166534" },
  "Em andamento": { fundo: "FFFEF3C7", texto: "FF92400E" },
  "Próximo passo": { fundo: "FFE0E7FF", texto: "FF3730A3" },
};

function montarAba(
  planilha: ExcelJS.Workbook,
  nome: string,
  subtitulo: string,
  eventos: Evento[],
) {
  const aba = planilha.addWorksheet(nome, {
    views: [{ state: "frozen", ySplit: 3 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  aba.columns = COLUNAS.map(({ key, width }) => ({ key, width }));

  // Faixa de título, sobre as 7 colunas.
  aba.mergeCells(1, 1, 1, COLUNAS.length);
  const titulo = aba.getCell(1, 1);
  titulo.value = "Orçamento Climático do Estado do Acre — Linha do Tempo";
  titulo.font = { name: "Calibri", size: 15, bold: true, color: { argb: "FFFFFFFF" } };
  titulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };
  titulo.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  aba.getRow(1).height = 30;

  aba.mergeCells(2, 1, 2, COLUNAS.length);
  const sub = aba.getCell(2, 1);
  sub.value = subtitulo;
  sub.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF166534" } };
  sub.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE_CLARO } };
  sub.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  aba.getRow(2).height = 20;

  const linhaCabecalho = aba.getRow(3);
  COLUNAS.forEach((coluna, i) => {
    const celula = linhaCabecalho.getCell(i + 1);
    celula.value = coluna.header;
    celula.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: VERDE } };
    celula.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 };
  });
  linhaCabecalho.height = 24;

  eventos.forEach((evento, i) => {
    const linha = aba.addRow({
      data: evento.data,
      frente: evento.frente,
      etapa: evento.etapa,
      oQueFoiFeito: evento.oQueFoiFeito,
      entrega: evento.entrega,
      situacao: evento.situacao,
      ondeConferir: evento.ondeConferir,
    });

    const zebra = i % 2 === 1;
    linha.eachCell({ includeEmpty: true }, (celula) => {
      celula.font = { name: "Calibri", size: 10 };
      celula.alignment = { vertical: "top", wrapText: true, indent: 1 };
      celula.border = {
        top: { style: "hair", color: { argb: CINZA_BORDA } },
        bottom: { style: "hair", color: { argb: CINZA_BORDA } },
      };
      if (zebra) {
        celula.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
      }
    });

    linha.getCell("data").font = { name: "Calibri", size: 10, bold: true };
    linha.getCell("ondeConferir").font = {
      name: "Calibri",
      size: 9,
      color: { argb: "FF6B7280" },
    };

    const cor = CORES_SITUACAO[evento.situacao];
    const celulaSituacao = linha.getCell("situacao");
    celulaSituacao.fill = { type: "pattern", pattern: "solid", fgColor: { argb: cor.fundo } };
    celulaSituacao.font = { name: "Calibri", size: 10, bold: true, color: { argb: cor.texto } };
    celulaSituacao.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });

  aba.autoFilter = {
    from: { row: 3, column: 1 },
    to: { row: 3 + eventos.length, column: COLUNAS.length },
  };

  return aba;
}

function acrescentarNotas(aba: ExcelJS.Worksheet) {
  aba.addRow([]);
  NOTAS.forEach((texto, i) => {
    const linha = aba.addRow([`Nota ${i + 1}. ${texto}`]);
    aba.mergeCells(linha.number, 1, linha.number, COLUNAS.length);
    const celula = linha.getCell(1);
    celula.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF6B7280" } };
    celula.alignment = { vertical: "top", wrapText: true, indent: 1 };
    linha.height = 28;
  });
}

async function main() {
  const eventos = [...EVENTOS].sort((a, b) => a.ordem.localeCompare(b.ordem));

  const planilha = new ExcelJS.Workbook();
  planilha.creator = "SEPLAN/AC — Orçamento Climático";
  planilha.created = new Date();

  const abaTudo = montarAba(
    planilha,
    "1. Linha do Tempo",
    "Tudo o que foi realizado até aqui, em ordem cronológica — da lei que criou o Orçamento Climático ao painel publicado.",
    eventos,
  );
  acrescentarNotas(abaTudo);

  montarAba(
    planilha,
    "2. Base Legal e Processo",
    "As leis, a metodologia e os dados oficiais que sustentam o Orçamento Climático.",
    eventos.filter((e) => e.frente === "Institucional"),
  );

  montarAba(
    planilha,
    "3. Construção do Painel",
    "As entregas do site e do painel de dados do Orçamento Climático.",
    eventos.filter((e) => e.frente === "Painel"),
  );

  const saida = resolve(
    import.meta.dirname,
    "..",
    "Linha do Tempo — Orçamento Climático.xlsx",
  );
  await planilha.xlsx.writeFile(saida);

  console.log(`Planilha gerada: ${saida}`);
  console.log(
    `${eventos.length} marcos · ${eventos.filter((e) => e.frente === "Institucional").length} institucionais · ${eventos.filter((e) => e.frente === "Painel").length} do painel`,
  );
}

main();
