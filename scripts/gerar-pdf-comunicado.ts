/**
 * Gera os PDFs institucionais do Informativo (PT) e do Brief (EN) via LaTeX
 * (pdflatex/MiKTeX)
 *   -> public/informativo-orcamento-climatico.pdf
 *   -> public/climate-budget-brief-en.pdf
 *
 *   npm run comunicado:pdf
 *
 * O conteudo vem de `data/comunicado.ts` (PT) e `data/comunicado-en.ts` (EN) e
 * as fotografias de `scripts/assets` (derivadas das fotos da landing, com os
 * creditos que o site exibe). O .tex e compilado em pasta temporaria por
 * idioma (auxiliares fora do repositorio) e o PDF final e copiado para
 * public/. Requer pdflatex no PATH (MiKTeX); pacotes que faltarem sao
 * instalados automaticamente (--enable-installer).
 */
import { execSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  COMUNICADO,
  REFERENCIAS,
  SECOES,
  type Bloco,
  type Referencia,
  type Secao,
} from "../data/comunicado.ts";
import { COMUNICADO_EN, REFERENCIAS_EN, SECOES_EN } from "../data/comunicado-en.ts";

const RAIZ = resolve(import.meta.dirname, "..");
const BUILD = join(tmpdir(), "orclima-comunicado");

const ativo = (arquivo: string) =>
  join(RAIZ, "scripts", "assets", arquivo).replaceAll("\\", "/");

const FOTO_CAPA = { arquivo: "capa-seringueira.jpg" };

const FOTOS_SECAO: Record<number, { arquivo: string; credito: string }> = {
  4: { arquivo: "secao-arara.jpg", credito: "Talita Oliveira - SECOM/AC" },
  6: { arquivo: "secao-jabuti.jpg", credito: "Arison Jardim - SECOM/AC" },
};

type Variante = {
  lang: "pt" | "en";
  babel: string;
  comunicado: { titulo: string; kicker: string; ano: number; subtitulo: string };
  secoes: Secao[];
  referencias: Referencia[];
  cabecalho: string;
  rodapeEsq: string;
  rodapeDir: string;
  capa: string;
  fotografia: string;
  referenciasTitulo: string;
  disponivelEm: string;
  creditosFotos: string;
  copyright: string;
  endereco: string;
  creditosEquipe: string;
  pdfTitulo: string;
  pdfAutor: string;
  saida: string;
};

const VARIANTES: Variante[] = [
  {
    lang: "pt",
    babel: "brazilian",
    comunicado: COMUNICADO,
    secoes: SECOES,
    referencias: REFERENCIAS,
    cabecalho: "ORÇAMENTO CLIMÁTICO DO ESTADO DO ACRE",
    rodapeEsq: "Governo do Estado do Acre · SEPLAN · DEPPO",
    rodapeDir: String.raw`Página \thepage\ de \pageref{LastPage}`,
    capa: "Rio Branco, Acre · 2026",
    fotografia: "Fotografia: ",
    referenciasTitulo: "Referências Consultadas",
    disponivelEm: "Disponível em: ",
    creditosFotos:
      "Fotografias: Agência de Notícias do Acre · Talita Oliveira (SECOM/AC) · Arison Jardim (SECOM/AC)",
    copyright:
      "© 2026 Governo do Estado do Acre · Secretaria de Estado de Planejamento do Acre - Departamento de Estudos e Planejamento Orçamentário - DEPPO/SEPLAN",
    endereco: "Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060",
    creditosEquipe:
      "Coordenação: Denyscley Oliveira Bandeira (Departamento de Estudos e Planejamento Orçamentário) · Equipe Técnica: Ícaro Lebre Gundim (Economista), Luísa Nascimento Ribeiro (Economista), Roseneide Mendonça de Sena Caldera (Especialista Executiva – Administração), Vinicius Carneiro de Farias (Economista).",
    pdfTitulo: "Orçamento Climático do Estado do Acre",
    pdfAutor: "SEPLAN/AC · DEPPO",
    saida: "informativo-orcamento-climatico.pdf",
  },
  {
    lang: "en",
    babel: "english",
    comunicado: COMUNICADO_EN,
    secoes: SECOES_EN,
    referencias: REFERENCIAS_EN,
    cabecalho: "CLIMATE BUDGET OF THE STATE OF ACRE",
    rodapeEsq: "Government of the State of Acre · SEPLAN · DEPPO",
    rodapeDir: String.raw`Page \thepage\ de \pageref{LastPage}`,
    capa: "Rio Branco, Acre · 2026",
    fotografia: "Photo: ",
    referenciasTitulo: "References Consulted",
    disponivelEm: "Available at: ",
    creditosFotos:
      "Photos: Agência de Notícias do Acre · Talita Oliveira (SECOM/AC) · Arison Jardim (SECOM/AC)",
    copyright:
      "© 2026 Government of the State of Acre · State Secretariat for Planning of Acre – Department of Studies and Budget Planning – DEPPO/SEPLAN",
    endereco: "Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060",
    creditosEquipe:
      "Coordination: Denyscley Oliveira Bandeira (Department of Studies and Budget Planning) · Technical Team: Ícaro Lebre Gundim (Economist), Luísa Nascimento Ribeiro (Economist), Roseneide Mendonça de Sena Caldera (Executive Specialist – Administration), Vinicius Carneiro de Farias (Economist).",
    pdfTitulo: "Climate Budget of the State of Acre",
    pdfAutor: "SEPLAN/AC · DEPPO",
    saida: "climate-budget-brief-en.pdf",
  },
];

/** Escapa os especiais do TeX; URLs nao passam aqui (entram em \url cruas). */
const escapar = (texto: string) =>
  texto
    .replace(/([\\&%$#_{}])/g, (caractere) => "\\" + caractere)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");

const blocoTex = (bloco: Bloco): string => {
  switch (bloco.tipo) {
    case "paragrafo":
      return escapar(bloco.texto);
    case "lista":
      return [
        "\\begin{enumerate}[leftmargin=1.4em,itemsep=5pt,topsep=2pt]",
        ...bloco.itens.map(
          (item) =>
            `  \\item \\textbf{\\color{verdeescuro}${escapar(item.nome)}:} ${escapar(item.texto)}`,
        ),
        "\\end{enumerate}",
      ].join("\n");
    case "nivel": {
      const linhas = [
        "\\begin{shaded}",
        `  \\textbf{\\color{verdeescuro}${escapar(bloco.titulo)}}`,
        "",
        `  ${escapar(bloco.texto)}`,
      ];
      if (bloco.itens?.length) {
        linhas.push(
          "  \\begin{itemize}[leftmargin=1.3em,itemsep=4pt,topsep=4pt]",
          ...bloco.itens.map(
            (item) =>
              `    \\item \\textbf{\\color{verdeescuro}${escapar(item.nome)}:} ${escapar(item.texto)}`,
          ),
          "  \\end{itemize}",
        );
      }
      linhas.push("\\end{shaded}");
      return linhas.join("\n");
    }
  }
};

const fotoTex = (arquivo: string, credito: string, rotulo: string) =>
  `\\begin{center}
  \\includegraphics[width=0.68\\textwidth]{${ativo(arquivo)}}

  \\vspace{2pt}
  {\\footnotesize\\color{cinzamedio}${rotulo}${escapar(credito)}}
\\end{center}`;

const preambuloTex = (v: Variante) => String.raw`\documentclass[11pt,a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[${v.babel}]{babel}
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
\usepackage[a4paper,top=2.8cm,bottom=2.6cm,left=2.4cm,right=2.4cm]{geometry}
\usepackage{xcolor}
\usepackage{graphicx}
\usepackage{parskip}
\setlength{\emergencystretch}{1.5em}
\usepackage{microtype}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{framed}
\usepackage{fancyhdr}
\usepackage{lastpage}
\usepackage{eso-pic}

% URLs quebram apos hifens alem dos pontos padrao (/ ? & etc.); o
% "break-anywhere" do xurl deixava pedacos como "//repositorio..." e
% "r/detalhar" no inicio de linha.
\PassOptionsToPackage{hyphens}{url}

\definecolor{verdeescuro}{HTML}{1B4D3E}
\definecolor{verde}{HTML}{15803D}
\definecolor{verdeclaro}{HTML}{E8F5E9}
\definecolor{cinzatexto}{HTML}{374151}
\definecolor{cinzamedio}{HTML}{6B7280}
\definecolor{cinzaclaro}{HTML}{E2E8F0}

\colorlet{shadecolor}{verdeclaro}
\setlength{\fboxsep}{9pt}

\titleformat{\section}{\normalfont\fontsize{13}{16}\selectfont\bfseries\color{verdeescuro}}{\thesection.}{0.6em}{}[{\color{verde}\vspace{2pt}\titlerule[1pt]}]
\titlespacing*{\section}{0pt}{20pt}{10pt}

\pagestyle{fancy}
\fancyhf{}
\setlength{\headheight}{18pt}
\setlength{\headsep}{12pt}
\fancyhead[L]{\includegraphics[height=11pt]{${ativo("seplan-800.png")}}}
\fancyhead[R]{\footnotesize\bfseries\color{verde}${v.cabecalho}}
\renewcommand{\headrule}{{\color{verdeescuro}\hrule height 1.2pt width\headwidth}}
\fancyfoot[L]{\footnotesize\color{cinzamedio}${v.rodapeEsq}}
\fancyfoot[R]{\footnotesize\color{cinzamedio}${v.rodapeDir}}
\renewcommand{\footrule}{{\color{cinzaclaro}\hrule height 0.6pt width\headwidth}}

\fancypagestyle{ultima}{
  \fancyhf{}
  \setlength{\headheight}{18pt}
  \setlength{\headsep}{12pt}
  \fancyhead[L]{\includegraphics[height=11pt]{${ativo("seplan-800.png")}}}
  \fancyhead[R]{\footnotesize\bfseries\color{verde}${v.cabecalho}}
  \renewcommand{\headrule}{{\color{verdeescuro}\hrule height 1.2pt width\headwidth}}
  \renewcommand{\footrule}{}
  \fancyfoot[L]{%
    \parbox[t]{\headwidth}{%
      \vspace*{-54pt}%
      {\footnotesize\color{cinzamedio}${v.rodapeEsq}\hfill ${v.rodapeDir}}\par
      \vspace{4pt}%
      \noindent{\color{cinzaclaro}\rule{\headwidth}{0.6pt}}\par
      \vspace{4pt}%
      {\footnotesize\color{cinzamedio}${escapar(v.creditosEquipe)}\par}%
      \vspace{4pt}%
      \noindent{\color{cinzaclaro}\rule{\headwidth}{0.6pt}}\par
      \vspace{4pt}%
      {\footnotesize\color{cinzamedio}${escapar(v.creditosFotos)}\par}%
    }%
  }
  \fancyfoot[R]{}
}

\usepackage{xurl}
\usepackage[colorlinks=true,urlcolor=verde,linkcolor=verde,pdftitle={${v.pdfTitulo}},pdfauthor={${v.pdfAutor}}]{hyperref}

% O pdftex re-encoda os subsets das fontes Type1 com codigos proprios; sem
% ToUnicode o texto copiado/extraido sai ilegivel. Isto embute o mapa e deixa
% o PDF pesquisavel.
\input glyphtounicode
\pdfgentounicode=1
`;

const capaTex = (v: Variante) => {
  const kicker = v.comunicado.kicker
    ? `{\\color{verde}\\bfseries ${escapar(v.comunicado.kicker)}\\par}\n\n    \\vspace{8pt}\n    `
    : "";

  return String.raw`\begin{titlepage}
  \thispagestyle{empty}
  \noindent\includegraphics[height=26pt]{${ativo("seplan-800.png")}}\hfill\includegraphics[height=52pt]{${ativo("governo-500.png")}}

  \vspace{2.4cm}
  \begin{center}
    ${kicker}{\color{verdeescuro}\bfseries\fontsize{26}{31}\selectfont ${escapar(v.comunicado.titulo)}\par}

    \vspace{14pt}
    {\color{verde}\rule{60pt}{2pt}}

    \vspace{14pt}
    {\color{cinzatexto}${escapar(v.comunicado.subtitulo)}\par}

    \vspace{6pt}
    {\color{cinzamedio}\small ${escapar(v.capa)}\par}
  \end{center}

  \vfill
  \AddToShipoutPictureBG*{\AtPageLowerLeft{%
    \includegraphics[width=\paperwidth,trim=0 0 0 40,clip]{${ativo(FOTO_CAPA.arquivo)}}%
  }}
\end{titlepage}
`;
};

const secoesTex = (v: Variante) =>
  v.secoes
    .map((secao) => {
      const conteudo = secao.blocos.map(blocoTex).join("\n\n");
      const foto = FOTOS_SECAO[secao.numero];
      const partes = [`\\section{${escapar(secao.titulo)}}`, conteudo];
      if (foto) partes.push(fotoTex(foto.arquivo, foto.credito, v.fotografia));
      return partes.join("\n\n");
    })
    .join("\n\n");

const referenciasTex = (v: Variante) =>
  [
    `\\section*{${escapar(v.referenciasTitulo)}}`,
    "",
    ...v.referencias.map((referencia) => {
      const ponto = referencia.corpo.indexOf(". ");
      const [entidade, resto] =
        ponto > 0
          ? [referencia.corpo.slice(0, ponto + 1), referencia.corpo.slice(ponto + 2)]
          : [referencia.corpo, ""];
      const corpo =
        `\\textbf{\\color{verdeescuro}${escapar(entidade)}} ${escapar(resto)}`.trim();
      const url = referencia.url
        ? `\\par\\nopagebreak\\vspace{2.5pt}\\noindent{\\footnotesize\\color{cinzamedio}${v.disponivelEm}\\url{${referencia.url}}}`
        : "";
      return String.raw`\noindent\begin{minipage}{\textwidth}
  \small\emergencystretch=1.5em
  \noindent ${corpo}${url}
\end{minipage}`;
    }),
  ].join("\n\n\\vspace{7pt}\n\n");

const creditosTex = (_v: Variante) => String.raw`\thispagestyle{ultima}`;

for (const variante of VARIANTES) {
  const build = join(BUILD, variante.lang);
  const tex = [
    preambuloTex(variante),
    String.raw`\begin{document}`,
    "",
    capaTex(variante),
    secoesTex(variante),
    referenciasTex(variante),
    creditosTex(variante),
    String.raw`\end{document}`,
  ].join("\n");

  mkdirSync(build, { recursive: true });
  writeFileSync(join(build, "comunicado.tex"), tex, "utf8");

  try {
    // O nome do arquivo entra relativo ao cwd: o caminho de tmpdir() vem na
    // forma curta do Windows ("VINICI~1") e o TeX quebra o nome no "~".
    for (let passada = 0; passada < 2; passada++) {
      execSync(
        "pdflatex --interaction=nonstopmode --halt-on-error --enable-installer comunicado.tex",
        { cwd: build, stdio: "pipe", timeout: 240000 },
      );
    }
  } catch (erro) {
    const caminhoLog = join(build, "comunicado.log");
    if (existsSync(caminhoLog)) {
      const log = readFileSync(caminhoLog, "utf8");
      console.error(`Falha na compilacao LaTeX (${variante.lang}). Final do log:`);
      console.error(log.split(/\r?\n/).slice(-40).join("\n"));
    } else {
      const falha = erro as { stderr?: Buffer; stdout?: Buffer; message?: string };
      console.error("Falha ao executar o pdflatex:");
      console.error(
        (falha.stderr?.toString() || falha.stdout?.toString() || falha.message || "")
          .split(/\r?\n/)
          .slice(0, 40)
          .join("\n"),
      );
    }
    throw erro;
  }

  const log = readFileSync(join(build, "comunicado.log"), "utf8");
  const resumo = /Output written on .*\((\d+) pages?, (\d+) bytes\)/.exec(log);
  const saida = join(RAIZ, "public", variante.saida);
  copyFileSync(join(build, "comunicado.pdf"), saida);
  console.log(
    `Informativo em PDF (LaTeX, ${variante.lang}): ${resumo?.[1] ?? "?"} paginas, ${Math.round(
      Number(resumo?.[2] ?? 0) / 1024,
    )} KB -> ${saida}`,
  );
}
