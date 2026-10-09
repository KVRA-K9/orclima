import type { Dicionario } from "./pt";

export const en: Dicionario = {
  meta: {
    siteTitulo: "Climate Budget of the State of Acre",
    siteTemplate: "%s | Climate Budget of Acre",
    siteDescricao:
      "A pioneering tool for organizing and tracking public spending dedicated to environmental protection and tackling climate change in the State of Acre.",
    painelTitulo: "Data Dashboard",
    painelDescricao:
      "Interactive dashboard for the Climate Budget of the State of Acre: allocation by thematic axis, agency, and Sustainable Development Goal.",
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
    eixos: "Thematic Axes",
    acessarPainel: "Access Dashboard",
    abrirMenu: "Open menu",
    navegacao: "Navigation",
    altLogo: "SEPLAN — State Secretariat for Planning",
  },

  footer: {
    navegacao: "Navigation",
    institucional: "Institutional",
    itens: {
      sobre: "About",
      eixos: "Thematic Axes",
      instrumentos: "Legal Instruments",
      painel: "Data Dashboard",
    },
    institucionalItens: {
      seplan: "SEPLAN",
      diario: "Official Gazette of Acre",
      legislacao: "State Legislation",
      transparencia: "Transparency Portal",
    },
    altLogo: "Government of the State of Acre 2023-2026",
    copyright: (ano) =>
      `© ${ano} Government of the State of Acre · State Secretariat for Planning of Acre – Department of Studies and Budget Planning – DEPPO/SEPLAN`,
    endereco: "Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060",
    creditos:
      "Coordination: Denyscley Oliveira Bandeira (Department of Studies and Budget Planning); Technical Team: Ícaro Lebre Gundim (Economist), Luísa Nascimento Ribeiro (Economist), Roseneide Mendonça de Sena Caldera (Executive Specialist – Administration), Vinicius Carneiro de Farias (Economist).",
  },

  landing: {
    hero: {
      tituloA: "Climate Budget",
      tituloB: "of the State of Acre",
      paragrafo:
        "A pioneering tool for organizing and tracking public spending dedicated to environmental protection and tackling climate change.",
      botao: "Access the interactive dashboard",
      credito: "Photo: Pedro Devani - SECOM/AC",
    },
    sobre: {
      titulo: "What is the Climate Budget?",
      p1a: "The Climate Budget is a pioneering tool in the State of Acre, created to organize and track public spending dedicated to environmental protection and tackling climate change, as established by",
      lei: "State Law No. 4,679, of November 10, 2025",
      p2: "More than an accounting instrument, it is an innovative management model that makes it possible to identify, monitor and evaluate every government action that contributes to:",
      objetivos: [
        "Reducing the impacts of climate change (mitigation);",
        "Preparing the State to face those impacts (adaptation);",
        "Protecting vulnerable populations and territories;",
        "Valuing the natural and cultural wealth of the Amazon.",
      ],
      p3: "With this tool, Acre seeks to measure precisely how much it invests in climate action, evaluate the effectiveness of its projects, attract national and international funding, and strengthen public policies aimed at sustainability.",
      cartaoTitulo: "In other words",
      cartaoA: "It answers the question:",
      cartaoForte: "“How much does the State of Acre actually invest in climate action?”",
      cartaoB: "— distinguishing expenditure dedicated exclusively to climate from that which contributes only partially, across all areas of government.",
      credito: "Photo: Arison Jardim - SECOM/AC",
    },
    eixos: {
      titulo: "Thematic Axes",
      subtitulo:
        "Applied in a cross-cutting, integrated manner across all areas of government — such as health, education, infrastructure, agriculture, environment, and social assistance — the Climate Budget is organized into seven thematic axes:",
      doTotal: "of total",
      credito: "Photo: Talita Oliveira - SECOM/AC",
    },
    cta: {
      titulo: "Explore Climate Budget Data",
      paragrafo:
        "Browse allocations by thematic axis, agency, and Sustainable Development Goal, with filters and data export options.",
      botao: "Access the data",
      credito: "Photo: Agência de Notícias do Acre",
    },
    informativo: {
      titulo: "Learn More About the Climate Budget",
      paragrafo:
        "A comprehensive brief on the tool: legal foundations, climate lens methodology, seven thematic axes, and programs with climate impact across the state.",
      botao: "Download PDF",
    },
    notaAno: {
      texto: (ano) => `Values refer to the year ${ano}`,
    },
    rolagem: {
      aria: "Scroll to next section",
      rotulo: "Scroll down",
    },
  },

  painel: {
    semOrgaos: "No agencies match the selected filters.",
    banner: {
      secoes: {
        analises: {
          titulo: "Overview",
          descricao: (exercicio, fonte) =>
            `Summary of fiscal year ${exercicio} climate allocations, distinguishing exclusive expenditure — whose purpose is entirely climate-related — from non-exclusive, which contributes only partially. Source: ${fonte}.`,
        },
        acoes: {
          titulo: "Detailed Table",
          descricao:
            "Climate allocation by agency, with the option to expand each thematic axis down to planned actions. Exportable to XLSX and PDF.",
        },
        instrumentos: {
          titulo: "Legal Instruments",
          descricao:
            "Regulatory and legal framework of the Climate Budget of the State of Acre: laws, decrees, plans, and technical documents underpinning the methodology.",
        },
        historico: {
          titulo: "Legislative History",
          descricao:
            "Environmental and climate legislation in Acre since 1965, with summaries and links to the official text of each legal act. Multiyear plans (PPA) and budget guidelines laws (LDO) display keyword frequency for climate terms, while annual budget laws (LOA) show allocations to environmental agencies for each fiscal year.",
        },
        ods: {
          titulo: "SDGs",
          descricao:
            "Alignment of the Climate Budget with the Sustainable Development Goals (SDGs) of the 2030 Agenda, indicating the thematic axis to which each indicator relates.",
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
      voltar: "Back to Home",
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
      nenhum: "No agencies match the filters.",
      nOrgaos: (n, m) => `${n} of ${m} agencies in the current selection.`,
    },
    kpis: {
      atuantes: {
        titulo: "Active Agencies",
        subtitulo: "Identified",
      },
      exclusivoPlanejado: {
        titulo: "Planned Exclusive Climate Budget",
        doTotal: "of total",
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
      notaAria: (nota, titulo) => `${nota} — regarding ${titulo}`,
    },
    detalhamento: {
      titulo: "Detailed Table",
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
        nenhum: "No agencies",
        palavra: (n) => (n === 1 ? "agency" : "agencies"),
        mostrando: (inicio, fim, n, palavra) =>
          `Showing ${inicio}–${fim} of ${n} ${palavra} · total`,
      },
      filtroFonte: {
        botao: "Funding Source",
        aria: "Filter by funding source",
        placeholder: "Search by code or name...",
        ariaBusca: "Search funding sources",
        selecionadas: (n) => `${n} selected`,
        limpar: "Clear",
        vazio: "No funding source with that code or name.",
        maiores: "Major Sources",
        demais: "Other Sources",
      },
      fichaFonte: {
        varias: (n) => `${n} funding sources selected`,
        uma: (codigo) => `Funding source ${codigo}`,
        doRecorte: "of current selection",
        acoes: (n) => (n === 1 ? "action" : "actions"),
        rateioVaria:
          "Values prorated by funding sources' share in the initial allocation of each action in the QDD.",
        rateioUma:
          "Values prorated by funding source's share in the initial allocation of each action in the QDD.",
      },
    },
    accordion: {
      vazioUmaFonte: (fonte) =>
        `No agency has actions funded by source ${fonte} within the selected filters.`,
      vazioVariasFontes: (n) =>
        `No agency has actions funded by the ${n} selected sources within the selected filters.`,
      totalPorEixo: (romano) => `Total by Thematic Axis (Axis ${romano})`,
      totalOrcamentario: "Total Budget",
      exclusivo: "Exclusive Budget:",
      naoExclusivo: "Non-exclusive Budget:",
      eixoN: (n) => `Axis ${n}`,
    },
    historico: {
      indicadores: {
        normas: {
          titulo: "Mapped legal acts",
          subtitulo: "laws, decrees, and plans with an environmental and climate scope",
        },
        periodo: {
          titulo: "Period covered",
          subtitulo: (anos) => `${anos} years of legislation`,
        },
        instrumentos: {
          titulo: "Planning instruments",
          subtitulo: "across PPAs, LDOs, and LOAs",
        },
      },
      acervoTitulo: "Legislative Collection",
      acervoTexto:
        "Select a type of legal act to browse the collection. The survey used descriptors such as “climate change”, “carbon”, “indigenous peoples”, and “bioeconomy” to locate each act.",
      buscar: "Search",
      placeholderBusca: "Summary, number, agency…",
      limparBusca: "Clear search",
      decada: "Decade",
      todasDecadas: (n) => `All decades (${n})`,
      ordenarPor: "Sort by",
      ordens: {
        recentes: "Most recent",
        antigas: "Oldest",
        numero: "Act number",
      },
      limparFiltros: "Clear filters",
      rodape: {
        nenhuma: "No legal acts",
        palavra: (n) => (n === 1 ? "act" : "acts"),
        mostrando: (inicio, fim, n, palavra) =>
          `Showing ${inicio}–${fim} of ${n} ${palavra}`,
        deTotal: (m) => ` (of ${m} total)`,
      },
      notaFonteA: (origem) => `Source: ${origem}, based on the `,
      notaFonteB: (n, data) => ` database. It comprises ${n} legal acts, updated on ${data}.`,
    },
    acervo: {
      vazio: "No legal acts match this search.",
      detalhe: {
        publicacao: "Published in the DOE (Official Gazette)",
        texto: "Official text",
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
        "Fiscal years prior to the Real Plan: values remain in the currency of the period and are excluded from the chart.",
      nOrgaos: (n) => `${n} ${n === 1 ? "agency" : "agencies"}`,
      exercicio: (n) => `Fiscal year ${n}`,
      quadrienio: (a, b) => `Four-year period ${a}–${b}`,
    },
    ods: {
      semEixoMapeado: "No axis mapped",
      eixoRotulo: (romano) => `Axis ${romano}`,
      verFicha: (codigo) => `View factsheet for ${codigo} on the SDG Brazil portal`,
      nota: {
        titulo: "About indicator links",
        p1: "Codes with a link lead to the indicator's factsheet on the SDG Brazil portal, maintained by IBGE.",
        p2: "The remaining indicators are under development, under review, or do not yet have data produced by the Federal Government.",
        aria:
          "About indicator links: codes with a link lead to the indicator's factsheet on the SDG Brazil portal, maintained by IBGE; the remaining indicators are under development, under review, or do not yet have data produced by the Federal Government.",
      },
      vazio: "No indicators for this SDG match the active filters.",
      tiles: {
        mapeados: {
          titulo: "Mapped indicators",
          subtitulo: "Matching current filters",
        },
        contemplados: {
          titulo: "SDGs addressed",
          subtitulo: "With at least one indicator",
        },
        pendentes: {
          titulo: "Under development or no data",
          subtitulo: "Indicators not yet produced",
        },
      },
      eixo: "Axis:",
      todos: "All",
      eixoOpcao: (romano) => `Axis ${romano}`,
      situacao: "Status:",
      todas: "All",
      placeholder: "Search by SDG, code, or indicator text...",
      ariaBusca: "Search SDG indicators",
      nSelecionados: (n) => `${n} SDGs selected`,
      fecharTodos: "Close all",
      dica: "Click the SDGs above to see their indicators — you can select more than one.",
    },
    graficos: {
      dica: {
        total: "Total",
        doRecorte: "of current selection",
      },
      composicao: {
        titulo: "Climate Budget Composition",
        descricao: "Exclusively climate allocation compared with the share that contributes only partially.",
        valor: "Value",
      },
      porEixo: {
        titulo: "Budget by Thematic Axis",
        descricao: "Planned climate allocation for each thematic axis.",
        dotacao: "Allocation",
      },
      porOrgao: {
        titulo: "Budget by Agency",
        descricao: (n) =>
          `${n} ${n === 1 ? "agency" : "agencies"} in the current selection, ordered from largest to smallest.`,
        exclusivo: "Exclusive",
        naoExclusivo: "Non-exclusive",
      },
      exclusivoPorEixo: {
        titulo: "Exclusive × Non-exclusive by Axis",
        descricao:
          "Estimated breakdown within each axis — the source provides classification at the agency level, prorated here by the axis share.",
        exclusivo: "Exclusive",
        naoExclusivo: "Non-exclusive",
      },
      serieLoa: {
        titulo: "Environmental Agencies' Allocation by Fiscal Year",
        descricao: (primeiro, ultimo) =>
          `Sum of allocations to environmental agencies in each Annual Budget Law (LOA), from ${primeiro} to ${ultimo}. Click a bar to open the law for that fiscal year.`,
        rp: "Own resources",
        outrasFontes: "Other sources",
        pandemiaTitulo: (a, b) => `COVID-19 pandemic across fiscal years ${a} to ${b}`,
        pandemiaTexto:
          "The public health emergency was declared in March 2020. Brazil declared it ended in May 2022 (Ordinance GM/MS No. 913/2022), and the WHO in May 2023. The period extends through 2024 because budgetary effects outlasted the formal end of the emergency.",
        notaCruzeiro: (a, b) =>
          `Fiscal years from ${a} to ${b} were budgeted in cruzeiros and are excluded from the chart. Converting those values to reais at a fixed rate would produce misleading figures due to historical hyperinflation. Those laws are listed below with values in the original currency of the period.`,
        notaRecorte:
          "This series totals allocations to environmental agencies and funds in each fiscal year. The remainder of the dashboard uses a thematic axis methodology that encompasses climate allocations across all government secretariats. Consequently, the two totals do not match.",
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
          "Statutes enacted by the Legislative Assembly on environment and climate. Those establishing or restructuring agencies are listed under Administrative Structure.",
      },
      Decreto: {
        rotulo: "Decree",
        descricao:
          "Executive decrees issued by the Governor. They regulate environmental statutes, establish committees and plans, and declare states of emergency.",
      },
      "Estrutura Administrativa": {
        rotulo: "Administrative Structure",
        descricao:
          "Laws that establish and reorganize the State's environmental agencies and civil service career frameworks.",
      },
      PPA: {
        rotulo: "PPA",
        descricao:
          "Multiyear Plan. Sets out the State's programs and targets for a four-year period and serves as the foundation for the LDO and LOA.",
      },
      LDO: {
        rotulo: "LDO",
        descricao:
          "Budget Guidelines Law. Annually sets the priorities and directives to be addressed in the subsequent year's budget law.",
      },
      LOA: {
        rotulo: "LOA",
        descricao:
          "Annual Budget Law. Estimates revenue and fixes expenditures for each agency for the fiscal year.",
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
    origemHistorico: "Legislative history of the Climate Budget, surveyed by SEPLAN",
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
        "Luísa Nascimento Ribeiro (Economist), Roseneide Sena (Executive Administrative Specialist), Vinicius Carneiro de Farias (Economist)",
      ],
      arquivo: (data) => `climate_budget_report_${data}.pdf`,
    },
  },
};
