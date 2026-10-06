import type { Dicionario } from "./pt";

export const en: Dicionario = {
  meta: {
    siteTitulo: "Climate Budget of the State of Acre",
    siteTemplate: "%s | Climate Budget of Acre",
    siteDescricao:
      "A first-of-its-kind tool for organizing and tracking public spending dedicated to environmental protection and to confronting climate change in the State of Acre.",
    painelTitulo: "Data dashboard",
    painelDescricao:
      "Interactive dashboard for the Climate Budget of the State of Acre: allocation by thematic axis, by agency and by Sustainable Development Goal.",
  },

  comum: {
    fechar: "Close",
    fecharX: (x) => `Close ${x}`,
    limpar: "Clear",
    paginaAnterior: "Previous page",
    proximaPagina: "Next page",
    idioma: "Choose language",
    temaClaro: "Switch to light theme",
    temaEscuro: "Switch to dark theme",
    marca: "Climate Budget",
    marcaSubtitulo: "State of Acre",
  },

  header: {
    sobre: "About",
    eixos: "Axes",
    acessarPainel: "Open the dashboard",
    abrirMenu: "Open menu",
    navegacao: "Navigation",
    altLogo: "SEPLAN — State Secretariat for Planning",
  },

  footer: {
    navegacao: "Navigation",
    institucional: "Institutional",
    itens: {
      sobre: "About",
      eixos: "Thematic axes",
      instrumentos: "Legal instruments",
      painel: "Data dashboard",
    },
    institucionalItens: {
      seplan: "SEPLAN",
      diario: "Official Gazette of Acre",
      legislacao: "State legislation",
      transparencia: "Transparency Portal",
    },
    altLogo: "Government of the State of Acre 2023-2026",
    copyright: (ano) =>
      `© ${ano} Government of the State of Acre · State Secretariat for Planning of Acre - Department of Studies and Budget Planning - DEPPO/SEPLAN`,
    endereco: "Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060",
    creditos:
      "Coordination: Denyscley Oliveira Bandeira (Department of Studies and Budget Planning); Technical Team: Ícaro Lebre Gundim (Economist), Luísa Nascimento Ribeiro (Economist), Roseneide Mendonça de Sena Caldera (Executive Specialist – Administration), Vinicius Carneiro de Farias (Economist).",
  },

  landing: {
    hero: {
      tituloA: "Climate Budget",
      tituloB: "of the State of Acre",
      paragrafo:
        "A first-of-its-kind tool for organizing and tracking public spending dedicated to environmental protection and to confronting climate change.",
      botao: "Open the interactive dashboard",
      credito: "Photo: Pedro Devani - SECOM/AC",
    },
    sobre: {
      titulo: "What is the Climate Budget?",
      p1a: "The Climate Budget is a first-of-its-kind tool in the State of Acre, created to organize and track public spending dedicated to environmental protection and to confronting climate change, as established by",
      lei: "State Law No. 4,679, of November 10, 2025",
      p2: "More than an accounting instrument, it is an innovative management model that makes it possible to identify, monitor and evaluate every government action that contributes to:",
      objetivos: [
        "Reducing the impacts of climate change (mitigation);",
        "Preparing the State to face those impacts (adaptation);",
        "Protecting vulnerable populations and territories;",
        "Valuing the natural and cultural resources of the Amazon.",
      ],
      p3: "With this tool, Acre seeks to measure precisely how much it invests in climate action, evaluate the effectiveness of its projects, attract national and international funding, and strengthen public policies aimed at sustainability.",
      cartaoTitulo: "In other words",
      cartaoA: "It is the answer to the question",
      cartaoForte: "“how much does the State of Acre actually invest in climate?”",
      cartaoB: "— separating what is exclusively climate expenditure from what contributes only in part, across every area of government.",
      credito: "Photo: Arison Jardim - SECOM/AC",
    },
    eixos: {
      titulo: "Thematic axes",
      subtitulo:
        "Applied in a cross-cutting, integrated way across all areas of government — such as health, education, infrastructure, agriculture, the environment and social assistance — the Climate Budget is organized into seven thematic axes:",
      doTotal: "of the total",
      credito: "Photo: Talita Oliveira - SECOM/AC",
    },
    cta: {
      titulo: "Explore the Climate Budget data",
      paragrafo:
        "Browse the allocation by thematic axis, by agency and by Sustainable Development Goal, with filters and export of the results.",
      botao: "Access the data",
      credito: "Photo: Agência de Notícias do Acre",
    },
    informativo: {
      titulo: "Learn more about the Climate Budget",
      paragrafo:
        "A compilation of information about the tool: the foundations, the climate lens methodology, the seven thematic axes, and the programs with climate impact in the state.",
      botao: "Download PDF",
    },
    notaAno: {
      texto: (ano) => `The values refer to the year ${ano}`,
    },
    rolagem: {
      aria: "Scroll to the next section",
      rotulo: "Scroll down",
    },
  },

  painel: {
    semOrgaos: "No agency matches the selected filters.",
    banner: {
      secoes: {
        analises: {
          titulo: "Overview",
          descricao: (exercicio, fonte) =>
            `An overview of the fiscal year ${exercicio} climate allocation, separating exclusive expenditure — whose purpose is entirely climatic — from non-exclusive, which contributes only in part. Source: ${fonte}.`,
        },
        acoes: {
          titulo: "Detailed Table",
          descricao:
            "Climate allocation by agency, with the option of expanding each thematic axis down to the planned action. Exportable in XLSX and PDF.",
        },
        instrumentos: {
          titulo: "Legal Instruments",
          descricao:
            "The normative framework of the Climate Budget of the State of Acre: laws, decrees, plans and technical documents that underpin the methodology.",
        },
        historico: {
          titulo: "History",
          descricao:
            "Acre's environmental and climate legislation since 1965, with the summary of and the link to the official text of each norm. The multiyear plans and budget guidelines laws show how many times each climate term appears in the text, and the annual budget laws show how much went to the environmental agencies in each fiscal year.",
        },
        ods: {
          titulo: "SDGs",
          descricao:
            "Alignment of the Climate Budget with the Sustainable Development Goals of the 2030 Agenda, with the thematic axis each indicator relates to.",
        },
      },
    },
    sidebar: {
      itens: {
        analises: "Overview",
        acoes: "Detailed Table",
        instrumentos: "Legal Instruments",
        historico: "History",
        ods: "SDGs",
      },
      voltar: "Back to the home page",
      expandir: "Expand side menu",
      recolher: "Collapse side menu",
      abrirMenu: "Open menu",
      secoes: "Dashboard sections",
      altBandeira: "Flag of Acre",
      tema: "Light / dark theme",
    },
    filtros: {
      titulo: "Filters",
      limpar: "Clear filters",
      ano: "Year",
      eixo: "Thematic axis",
      orgao: "Agency",
      classificacao: "Classification",
      pesquisar: "Search",
      placeholder: "Search agency...",
      todosEixos: "All thematic axes",
      todosOrgaos: "All agencies",
      todasClassificacoes: "All classifications",
      nenhum: "No agency matches the filters.",
      nOrgaos: (n, m) => `${n} of ${m} agencies in the current selection.`,
    },
    kpis: {
      atuantes: {
        titulo: "Active Agencies",
        subtitulo: "Identified",
      },
      exclusivoPlanejado: {
        titulo: "Planned Exclusive Climate Budget",
        doTotal: "of the total",
      },
      dotacaoExclusiva: {
        titulo: "Exclusive Allocation",
        rotuloValor: "Planned actions",
      },
      dotacaoNaoExclusiva: {
        titulo: "Non-exclusive Allocation",
        rotuloValor: "Planned actions",
      },
      notaValidacao: "Under validation",
      notaAria: (nota, titulo) => `${nota} — about ${titulo}`,
    },
    detalhamento: {
      titulo: "Detailed table",
      colunas: {
        nome: "Agency",
        total: "Total allocation",
        exclusivo: "Exclusive",
        naoExclusivo: "Non-exclusive",
        tipo: "Classification",
        eixos: "Axes",
      },
      visao: {
        tabela: "Table",
        detalhado: "Detailed",
      },
      gerando: "Generating…",
      ordenarPor: (rotulo) => `Sort by ${rotulo}`,
      rodape: {
        nenhum: "No agency",
        palavra: (n) => (n === 1 ? "agency" : "agencies"),
        mostrando: (inicio, fim, n, palavra) =>
          `Showing ${inicio}–${fim} of ${n} ${palavra} · total`,
      },
      filtroFonte: {
        botao: "Funding source",
        aria: "Filter by funding source",
        placeholder: "Search by code or name...",
        ariaBusca: "Search funding sources",
        selecionadas: (n) => `${n} ${n === 1 ? "selected" : "selected"}`,
        limpar: "Clear",
        vazio: "No funding source with that code or name.",
        maiores: "Largest",
        demais: "Others",
      },
      fichaFonte: {
        varias: (n) => `${n} funding sources selected`,
        uma: (codigo) => `Funding source ${codigo}`,
        doRecorte: "of the current selection",
        acoes: (n) => (n === 1 ? "action" : "actions"),
        rateioVaria:
          "Values prorated by the funding sources' share in the initial allocation of each action in the QDD.",
        rateioUma:
          "Values prorated by the funding source's share in the initial allocation of each action in the QDD.",
      },
    },
    accordion: {
      vazioUmaFonte: (fonte) =>
        `No agency has an action funded by source ${fonte} within the selected filters.`,
      vazioVariasFontes: (n) =>
        `No agency has an action funded by the ${n} selected sources within the selected filters.`,
      totalPorEixo: (romano) => `Total by Thematic Axis (Axis ${romano})`,
      totalOrcamentario: "Budget Total",
      exclusivo: "Exclusive Budget:",
      naoExclusivo: "Non-exclusive Budget:",
      eixoN: (n) => `Axis ${n}`,
    },
    historico: {
      indicadores: {
        normas: {
          titulo: "Mapped norms",
          subtitulo: "laws, decrees and plans with an environmental and climate scope",
        },
        periodo: {
          titulo: "Period covered",
          subtitulo: (anos) => `${anos} years of legislation`,
        },
        instrumentos: {
          titulo: "Planning instruments",
          subtitulo: "across PPAs, LDOs and LOAs",
        },
      },
      acervoTitulo: "Body of legislation",
      acervoTexto:
        "Choose a type of norm to browse the collection. The survey started from descriptors such as “climate change”, “carbon”, “indigenous peoples” and “bioeconomy” to find each norm.",
      buscar: "Search",
      placeholderBusca: "Summary, number, agency…",
      limparBusca: "Clear search",
      decada: "Decade",
      todasDecadas: (n) => `All decades (${n})`,
      ordenarPor: "Sort by",
      ordens: {
        recentes: "Most recent",
        antigas: "Oldest",
        numero: "Norm number",
      },
      limparFiltros: "Clear filters",
      rodape: {
        nenhuma: "No norms",
        palavra: (n) => (n === 1 ? "norm" : "norms"),
        mostrando: (inicio, fim, n, palavra) =>
          `Showing ${inicio}–${fim} of ${n} ${palavra}`,
        deTotal: (m) => ` (of ${m} in total)`,
      },
      notaFonteA: (origem) => `Source: ${origem}, on top of the `,
      notaFonteB: (n, data) => ` database. It comprises ${n} norms, updated on ${data}.`,
    },
    acervo: {
      vazio: "No norm matches this search.",
      detalhe: {
        publicacao: "Published in the DOE",
        texto: "Norm text",
        orgao: "Agency",
        tambem: "Also listed under",
        descritores: "Climate descriptors in the text",
        descritoresVazio: "No climate descriptors identified in the survey.",
        dotacao: "Environmental agencies' allocation",
        metas: "Targets and priorities",
      },
      valores: {
        rp: "Own resources",
        outras: "Other sources",
        total: "Total",
      },
      moedaEpoca:
        "Fiscal years before the real: values are in the currency of the time and are not included in the chart.",
      nOrgaos: (n) => `${n} ${n === 1 ? "agency" : "agencies"}`,
      exercicio: (n) => `Fiscal year ${n}`,
      quadrienio: (a, b) => `Four-year period ${a}–${b}`,
    },
    ods: {
      semEixoMapeado: "No axis mapped",
      eixoRotulo: (romano) => `Axis ${romano}`,
      verFicha: (codigo) => `View the factsheet for ${codigo} on the SDG Brazil portal`,
      nota: {
        titulo: "About the indicator links",
        p1: "Codes with a link lead to the indicator's factsheet on the SDG Brazil portal, by IBGE.",
        p2: "The remaining ones are under development, under review, or have no data produced by the Federal Government.",
        aria:
          "About the indicator links: codes with a link lead to the indicator's factsheet on the SDG Brazil portal, by IBGE; the remaining ones are under development, under review, or have no data produced by the Federal Government",
      },
      vazio: "No indicator of this SDG matches the active filters.",
      tiles: {
        mapeados: {
          titulo: "Mapped indicators",
          subtitulo: "Match the current filters",
        },
        contemplados: {
          titulo: "SDGs addressed",
          subtitulo: "With at least one indicator",
        },
        pendentes: {
          titulo: "Under development or without data",
          subtitulo: "Indicators not yet produced",
        },
      },
      eixo: "Axis:",
      todos: "All",
      eixoOpcao: (romano) => `Axis ${romano}`,
      situacao: "Status:",
      todas: "All",
      placeholder: "Search by SDG, code or indicator text...",
      ariaBusca: "Search SDG indicators",
      nSelecionados: (n) => `${n} SDGs selected`,
      fecharTodos: "Close all",
      dica: "Click the SDGs above to see their indicators — you can select more than one.",
    },
    graficos: {
      dica: {
        total: "Total",
        doRecorte: "of the current selection",
      },
      composicao: {
        titulo: "Climate Budget composition",
        descricao: "Exclusively climate allocation compared with the share that contributes only partially.",
        valor: "Value",
      },
      porEixo: {
        titulo: "Budget by Axis",
        descricao: "Climate allocation planned for each thematic axis.",
        dotacao: "Allocation",
      },
      porOrgao: {
        titulo: "Budget by Secretariat",
        descricao: (n) =>
          `${n} ${n === 1 ? "agency" : "agencies"} in the current selection, from largest to smallest.`,
        exclusivo: "Exclusive",
        naoExclusivo: "Non-exclusive",
      },
      exclusivoPorEixo: {
        titulo: "Exclusive × Non-exclusive by axis",
        descricao:
          "Estimated split within each axis — the source reports the classification at the agency level, prorated here by the axis share.",
        exclusivo: "Exclusive",
        naoExclusivo: "Non-exclusive",
      },
      serieLoa: {
        titulo: "The environmental agencies' allocation, fiscal year by fiscal year",
        descricao: (primeiro, ultimo) =>
          `Sum of the environmental agencies' allocations in each Annual Budget Law, from ${primeiro} to ${ultimo}. Click a bar to open the law for that fiscal year.`,
        rp: "Own resources",
        outrasFontes: "Other sources",
        pandemiaTitulo: (a, b) => `COVID-19 pandemic in the fiscal years ${a} to ${b}`,
        pandemiaTexto:
          "The emergency was declared in March 2020. Brazil ended it in May 2022 (Ordinance GM/MS No. 913/2022), and the WHO in May 2023. The span runs through 2024 because the budgetary effects outlast the end of the emergency.",
        notaCruzeiro: (a, b) =>
          `The fiscal years from ${a} to ${b} were budgeted in cruzeiros and are left out of the chart. Converting those values to reais at a fixed rate would produce a meaningless number, because inflation at the time eroded the currency month by month. Those laws are in the list below, with the value in the currency of the time.`,
        notaRecorte:
          "This series adds up what went to the environmental agencies and funds in each fiscal year. The rest of the dashboard uses a different selection, by thematic axis, which reaches climate allocations from any secretariat. That is why the two totals do not match.",
        dica: (exercicio, numero) => `Fiscal year ${exercicio}, Law No. ${numero}`,
      },
    },
  },

  dados: {
    status: {
      produzido: "Produced",
      construcao: "Under development",
      "sem-dados": "No data",
    },
    tipoDotacao: {
      Exclusivo: "Exclusive",
      "Não Exclusivo": "Non-exclusive",
    },
    tiposNorma: {
      "Lei Ordinária": {
        rotulo: "Ordinary Law",
        descricao:
          "Laws passed by the Legislative Assembly on the environment and climate. Those that create or reorganize agencies are listed under Administrative Structure.",
      },
      Decreto: {
        rotulo: "Decree",
        descricao:
          "Acts of the governor. They regulate environmental laws, create committees and plans, and declare states of emergency.",
      },
      "Estrutura Administrativa": {
        rotulo: "Administrative Structure",
        descricao:
          "Laws that create and reorganize the State's environmental agencies and the careers of their civil servants.",
      },
      PPA: {
        rotulo: "PPA",
        descricao:
          "Multiyear Plan. It defines the State's programs and targets for four years and is the basis of the LDO and the LOA.",
      },
      LDO: {
        rotulo: "LDO",
        descricao:
          "Budget Guidelines Law. Each year it sets the priorities that the following year's budget law must address.",
      },
      LOA: {
        rotulo: "LOA",
        descricao:
          "Annual Budget Law. It estimates revenue and sets each agency's expenditure for the fiscal year.",
      },
    },
    especieNorma: {
      Lei: "Law",
      "Lei Complementar": "Complementary Law",
      Decreto: "Decree",
      "Constituição Estadual": "State Constitution",
    },
    categoriaInstrumentos: {
      "Publicações Oficiais": "Official Publications",
      "Constituição Federal": "Federal Constitution",
      "Leis Estaduais": "State Laws",
      "Leis Federais": "Federal Laws",
    },
    fonteBanner: "SEPLAN/AC — Department of Studies and Planning (DEPLAN)",
    origemHistorico: "History of Climate Budget laws, a manual survey by SEPLAN",
    numeroLei: "No.",
  },

  export: {
    xlsx: {
      aba: "Microdata",
      colunas: {
        exercicio: "fiscal_year",
        codigoOrgao: "agency_code",
        orgao: "agency",
        orgaoCompleto: "agency_full",
        eixo: "axis",
        eixoNumero: "axis_number",
        aplicacao: "planned_action",
        classificacao: "classification",
        dotacao: "allocation",
      },
      arquivo: (data) => `climate_budget_microdata_${data}.xlsx`,
    },
    pdf: {
      titulo: "Climate Budget – Breakdown by Agency",
      subtitulo: "Department of Studies and Budget Planning – DEPPO/SEPLAN",
      exercicio: "Fiscal year:",
      exportadoEm: "Exported on:",
      pagina: "Page",
      rodape: "State Secretariat for Planning – SEPLAN | Government of the State of Acre",
      semAplicacoes: "No planned actions",
      colunas: ["Planned Action", "Classification", "Allocation (R$)"],
      exclusivo: "Exclusive:",
      naoExclusivo: "Non-exclusive:",
      total: "TOTAL:",
      totalGeral: "GRAND TOTAL",
      nOrgaos: (n) => `(${n} ${n === 1 ? "agency" : "agencies"})`,
      boxExclusivo: "Exclusive",
      boxNaoExclusivo: "Non-exclusive",
      boxTotal: "Total",
      creditos: [
        "Coordinator: Denyscley Oliveira Bandeira (Public Policy Manager) | Technical Team: Ícaro Lebre Gundim (Economist),",
        "Luísa Nascimento Ribeiro (Economist), Roseneide Sena (Executive Administrative Specialist), Vinícius Carneiro de Farias (Economist)",
      ],
      arquivo: (data) => `climate_budget_report_${data}.pdf`,
    },
  },
};
