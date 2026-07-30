import type { CellHookData, RowInput } from "jspdf-autotable";

import { EIXOS } from "@/data/eixos";
import { ORCAMENTO } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import type { Aplicacao, Orgao } from "@/lib/types";

type AplicacoesDe = (orgao: string) => Record<string, Aplicacao[]>;
type Rgb = [number, number, number];

/**
 * Paleta do relatório, herdada do PDF do dashboard de crédito de carbono
 * (`ProjectsTable.jsx`, componente `ExportarDados`) — não são os tokens do
 * tema: o PDF é o mesmo documento nos dois temas da interface.
 */
const CORES = {
  verdeEscuro: [27, 77, 62] as Rgb,
  verdeClaro: [232, 245, 233] as Rgb,
  cinzaTexto: [55, 65, 81] as Rgb,
  cinzaClaro: [243, 244, 246] as Rgb,
  cinzaMedio: [156, 163, 175] as Rgb,
  azulExclusivo: [37, 99, 235] as Rgb,
  cinzaNaoExclusivo: [107, 114, 128] as Rgb,
  branco: [255, 255, 255] as Rgb,
};

/**
 * Versão branca da marca: o cabeçalho do relatório é uma faixa verde-escura, e
 * é sobre ela que a logo assenta direto — sem a placa branca que a versão verde
 * exigia.
 */
const LOGO = { src: "/seplan-horizontal-branco.png", proporcao: 3113 / 439 };

const dataArquivo = () => new Date().toISOString().slice(0, 10);
const dataBR = () => new Date().toLocaleDateString("pt-BR");

function baixar(conteudo: Blob, nome: string) {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Eixo pelo número que indexa `Orgao.eixos` (as chaves são strings). */
const eixoDe = (numero: number) => EIXOS.find((e) => e.numero === numero);

const numerosDeEixo = (orgao: Orgao) =>
  Object.keys(orgao.eixos)
    .map(Number)
    .sort((a, b) => a - b);

/**
 * Uma linha por órgão × eixo × aplicação — o formato de microdados do
 * relatório de referência. Eixos sem aplicação detalhada ainda geram uma
 * linha, com o valor agregado do eixo na coluna de dotação.
 */
export function linhasMicrodados(
  orgaos: Orgao[],
  aplicacoesDe: AplicacoesDe,
): (string | number)[][] {
  const linhas: (string | number)[][] = [];

  for (const orgao of orgaos) {
    const porEixo = aplicacoesDe(orgao.nome);

    for (const numero of numerosDeEixo(orgao)) {
      const eixo = eixoDe(numero);
      const aplicacoes = porEixo[String(numero)] ?? [];
      const detalhado = aplicacoes.length > 0;
      const itens: Aplicacao[] = detalhado
        ? aplicacoes
        : [
            {
              aplicacao: "",
              tipo: "Não Exclusivo",
              dotacao: orgao.eixos[String(numero)],
            },
          ];

      for (const item of itens) {
        linhas.push([
          ORCAMENTO.exercicio,
          orgao.codigo,
          orgao.sigla,
          orgao.nome,
          eixo?.rotulo ?? String(numero),
          eixo?.romano ?? String(numero),
          item.aplicacao,
          detalhado ? item.tipo : "",
          item.dotacao,
        ]);
      }
    }
  }

  return linhas;
}

export async function exportarXlsx(orgaos: Orgao[], aplicacoesDe: AplicacoesDe) {
  // O ExcelJS pesa bastante: só entra no bundle quando alguém exporta.
  const ExcelJS = await import("exceljs");

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Microdados");

  ws.columns = [
    { header: "exercicio", width: 10 },
    { header: "codigo_orgao", width: 14 },
    { header: "orgao", width: 40 },
    { header: "orgao_completo", width: 50 },
    { header: "eixo", width: 50 },
    { header: "eixo_numero", width: 12 },
    { header: "aplicacao_programada", width: 70 },
    { header: "classificacao", width: 16 },
    { header: "dotacao", width: 18 },
  ];
  ws.getRow(1).font = { bold: true };

  for (const linha of linhasMicrodados(orgaos, aplicacoesDe)) ws.addRow(linha);

  ws.getColumn(9).numFmt = "#,##0.00";
  // Cabeçalho congelado: a planilha tem uma linha por aplicação e fica longa.
  ws.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await wb.xlsx.writeBuffer();
  baixar(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `microdados_orcamento_climatico_${dataArquivo()}.xlsx`,
  );
}

/** Data URL da logo. `null` se falhar — o relatório sai sem a marca. */
async function carregarLogo(): Promise<string | null> {
  try {
    const resposta = await fetch(LOGO.src);
    const blob = await resposta.blob();
    return await new Promise((resolve) => {
      const leitor = new FileReader();
      leitor.onloadend = () => resolve(String(leitor.result));
      leitor.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportarPdf(orgaos: Orgao[], aplicacoesDe: AplicacoesDe) {
  // jsPDF pesa ~350 KB: só entra no bundle quando o usuário clica em exportar.
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();

  const MARGEM = 40;
  const TOPO = 100;
  const BASE = 50;

  const finalY = () =>
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  const logo = await carregarLogo();

  // Cabeçalho e rodapé são desenhados uma vez por página: o autoTable dispara
  // `didDrawPage` também em páginas já visitadas quando uma tabela reflui.
  const comCabecalho = new Set<number>();
  const comRodape = new Set<number>();

  const cabecalho = (pg: number) => {
    if (comCabecalho.has(pg)) return;
    comCabecalho.add(pg);

    doc.setFillColor(...CORES.verdeEscuro);
    doc.rect(0, 0, largura, 90, "F");

    doc.setTextColor(...CORES.branco);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Orçamento Climático – Detalhamento por Órgão", MARGEM, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "Departamento de Estudos e Planejamento Orçamentário – DEPPO/SEPLAN",
      MARGEM,
      52,
    );

    doc.setFontSize(9);
    doc.text(
      `Exercício: ${ORCAMENTO.exercicio}     Exportado em: ${dataBR()}     Página ${pg}`,
      MARGEM,
      68,
    );

    if (logo) {
      // Branca sobre transparente: assenta direto na faixa verde-escura.
      // Centrada na altura da faixa (90pt) em vez de presa ao topo.
      const h = 22;
      const w = h * LOGO.proporcao;
      doc.addImage(logo, "PNG", largura - w - MARGEM, (90 - h) / 2, w, h);
    }

    doc.setTextColor(0, 0, 0);
  };

  const rodape = (pg: number) => {
    if (comRodape.has(pg)) return;
    comRodape.add(pg);

    doc.setDrawColor(...CORES.cinzaMedio);
    doc.setLineWidth(0.5);
    doc.line(MARGEM, altura - 35, largura - MARGEM, altura - 35);

    doc.setTextColor(...CORES.cinzaMedio);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Secretaria de Estado de Planejamento – SEPLAN | Governo do Estado do Acre",
      largura / 2,
      altura - 22,
      { align: "center" },
    );

    doc.setTextColor(0, 0, 0);
  };

  let pagina = 1;
  let y = 105;

  const novaPagina = () => {
    rodape(pagina);
    doc.addPage();
    pagina++;
    y = TOPO;
    cabecalho(pagina);
  };

  const garantirEspaco = (necessario: number) => {
    if (y + necessario > altura - BASE) novaPagina();
  };

  const moldura = (d: CellHookData, cor: Rgb, fecharBloco: boolean) => {
    const { x, y: cy, width, height } = d.cell;
    doc.setDrawColor(...cor);
    doc.setLineWidth(0.5);
    doc.rect(x, cy, width, height, "S");
    // Contorno mais grosso em volta do bloco inteiro, desenhado a partir da
    // primeira célula porque só ali se conhece a origem da tabela.
    if (fecharBloco && d.row.index === 0 && d.column.index === 0) {
      const w = d.table.columns.reduce((s, c) => s + c.width, 0);
      const h = d.table.body.reduce((s, r) => s + r.height, 0);
      doc.setLineWidth(1);
      doc.rect(x, cy, w, h, "S");
    }
  };

  cabecalho(pagina);

  let totalExclusivo = 0;
  let totalNaoExclusivo = 0;

  for (const orgao of orgaos) {
    const porEixo = aplicacoesDe(orgao.nome);
    const numeros = numerosDeEixo(orgao);
    totalExclusivo += orgao.exclusivo;
    totalNaoExclusivo += orgao.naoExclusivo;

    const rotulosEixos = numeros
      .map((n) => eixoDe(n)?.rotulo ?? String(n))
      .join(" | ");

    const corpo: RowInput[] = [];
    if (numeros.length === 0) {
      corpo.push(["Sem aplicações programadas", "", ""]);
    } else {
      for (const numero of numeros) {
        const rotulo = eixoDe(numero)?.rotulo ?? String(numero);
        const aplicacoes = porEixo[String(numero)] ?? [];
        if (aplicacoes.length === 0) {
          corpo.push([`[${rotulo}]`, "", ""]);
        } else {
          for (const app of aplicacoes) {
            corpo.push([
              `${app.aplicacao} (${rotulo})`,
              {
                content: app.tipo,
                styles: {
                  textColor:
                    app.tipo === "Exclusivo"
                      ? CORES.azulExclusivo
                      : CORES.cinzaNaoExclusivo,
                },
              },
              formatBRL(app.dotacao),
            ]);
          }
        }
      }
    }

    garantirEspaco(95);

    // Faixa verde de identificação do órgão.
    autoTable(doc, {
      startY: y,
      margin: { left: MARGEM, right: MARGEM },
      tableWidth: largura - MARGEM * 2,
      body: [
        [
          {
            content: `${orgao.codigo}\n${orgao.sigla}`,
            styles: { fontSize: 11, fontStyle: "bold", textColor: CORES.branco },
          },
        ],
        [{ content: rotulosEixos, styles: { fontSize: 9, textColor: CORES.branco } }],
      ],
      theme: "plain",
      styles: {
        cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
        valign: "middle",
      },
      didParseCell: (d) => {
        d.cell.styles.fillColor = CORES.verdeEscuro;
      },
      didDrawCell: (d) => moldura(d, CORES.branco, true),
    });

    y = finalY() + 4;

    // Aplicações programadas do órgão.
    autoTable(doc, {
      startY: y,
      margin: { left: MARGEM, right: MARGEM, top: TOPO, bottom: BASE },
      tableWidth: largura - MARGEM * 2,
      head: [["Aplicação Programada", "Classificação", "Dotação (R$)"]],
      body: corpo,
      theme: "plain",
      headStyles: {
        fillColor: CORES.verdeClaro,
        textColor: CORES.verdeEscuro,
        fontSize: 9,
        fontStyle: "bold",
        cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
      },
      styles: {
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 100, halign: "left" },
        2: { cellWidth: 80, halign: "right" },
      },
      alternateRowStyles: { fillColor: CORES.cinzaClaro },
      didDrawCell: (d) => {
        const { x, y: cy, width, height } = d.cell;
        if (d.section === "head") {
          doc.setDrawColor(...CORES.verdeEscuro);
          doc.setLineWidth(0.5);
          doc.rect(x, cy, width, height, "S");
        } else {
          doc.setDrawColor(...CORES.cinzaMedio);
          doc.setLineWidth(0.3);
          doc.rect(x, cy, width, height, "S");
          if (d.row.index === d.table.body.length - 1) {
            doc.setLineWidth(0.8);
            doc.line(x, cy + height, x + width, cy + height);
          }
        }
      },
      didDrawPage: () => {
        // `getNumberOfPages` em vez de `getCurrentPageInfo` (fora dos tipos do
        // jsPDF): dentro do hook a página corrente é sempre a última criada.
        const pg = doc.getNumberOfPages();
        cabecalho(pg);
        rodape(pg);
      },
    });

    // A tabela de aplicações pode ter aberto páginas por conta própria.
    pagina = doc.getNumberOfPages();
    y = finalY() + 4;

    garantirEspaco(40);

    // Totais do órgão.
    autoTable(doc, {
      startY: y,
      margin: { left: MARGEM, right: MARGEM },
      tableWidth: largura - MARGEM * 2,
      body: [
        [
          {
            content: `Exclusivo: ${formatBRL(orgao.exclusivo)}`,
            styles: { fontStyle: "bold", textColor: CORES.azulExclusivo },
          },
          {
            content: `Não Exclusivo: ${formatBRL(orgao.naoExclusivo)}`,
            styles: { fontStyle: "bold", textColor: CORES.cinzaTexto },
          },
          {
            content: `TOTAL: ${formatBRL(orgao.total)}`,
            styles: {
              fontStyle: "bold",
              textColor: CORES.verdeEscuro,
              halign: "right",
            },
          },
        ],
      ],
      theme: "plain",
      styles: {
        fontSize: 9,
        cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
        valign: "middle",
      },
      didParseCell: (d) => {
        d.cell.styles.fillColor = CORES.verdeClaro;
      },
      didDrawCell: (d) => moldura(d, CORES.verdeEscuro, true),
    });

    y = finalY() + 16;
  }

  // ─── Caixa de total geral ────────────────────────────────────────────────
  const totalGeral = totalExclusivo + totalNaoExclusivo;
  const ESPACO_CREDITOS = 60;

  if (y + 110 + ESPACO_CREDITOS > altura - BASE) novaPagina();

  doc.setFillColor(...CORES.verdeEscuro);
  doc.roundedRect(MARGEM, y, largura - MARGEM * 2, 100, 4, 4, "F");

  doc.setTextColor(...CORES.branco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TOTAL GERAL", largura / 2, y + 25, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `(${orgaos.length} ${orgaos.length === 1 ? "órgão" : "órgãos"})`,
    largura / 2,
    y + 42,
    { align: "center" },
  );

  doc.setDrawColor(...CORES.branco);
  doc.setLineWidth(1);
  doc.line(60, y + 52, largura - 60, y + 52);

  doc.setFontSize(10);
  const coluna = (largura - 120) / 3;
  doc.text("Exclusivo", 60 + coluna * 0.5, y + 68, { align: "center" });
  doc.text("Não Exclusivo", 60 + coluna * 1.5, y + 68, { align: "center" });
  doc.text("Total", 60 + coluna * 2.5, y + 68, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(formatBRL(totalExclusivo), 60 + coluna * 0.5, y + 88, { align: "center" });
  doc.text(formatBRL(totalNaoExclusivo), 60 + coluna * 1.5, y + 88, {
    align: "center",
  });
  doc.text(formatBRL(totalGeral), 60 + coluna * 2.5, y + 88, { align: "center" });

  // Equipe técnica, logo acima do rodapé da última página.
  const yCreditos = altura - 55;
  doc.setTextColor(...CORES.cinzaTexto);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Coordenador: Denyscley Oliveira Bandeira (Gestor de Políticas Públicas) | Equipe Técnica: Ícaro Lebre Gundim (Economista),",
    largura / 2,
    yCreditos,
    { align: "center" },
  );
  doc.text(
    "Luísa Nascimento Ribeiro (Economista), Roseneide Sena (Especialista Executiva Administradora), Vinícius Carneiro de Farias (Economista)",
    largura / 2,
    yCreditos + 14,
    { align: "center" },
  );

  rodape(doc.getNumberOfPages());

  doc.save(`relatorio_orcamento_climatico_${dataArquivo()}.pdf`);
}
