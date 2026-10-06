import type { TipoNorma } from "@/data/historico-leis";
import type { StatusOds } from "@/lib/ods";
import type { TipoDotacao } from "@/lib/types";

export const pt = {
  meta: {
    siteTitulo: "Orçamento Climático do Estado do Acre",
    siteTemplate: "%s | Orçamento Climático do Acre",
    siteDescricao:
      "Ferramenta inédita para organizar e acompanhar os gastos públicos destinados à proteção ambiental e ao enfrentamento das mudanças climáticas no Estado do Acre.",
    painelTitulo: "Painel de dados",
    painelDescricao:
      "Painel interativo do Orçamento Climático do Estado do Acre: dotação por eixo temático, por órgão e por Objetivo de Desenvolvimento Sustentável.",
  },

  comum: {
    fechar: "Fechar",
    fecharX: (x: string) => `Fechar ${x}`,
    limpar: "Limpar",
    paginaAnterior: "Página anterior",
    proximaPagina: "Próxima página",
    idioma: "Escolher idioma",
    temaClaro: "Ativar tema claro",
    temaEscuro: "Ativar tema escuro",
    marca: "Orçamento Climático",
    marcaSubtitulo: "Estado do Acre",
  },

  header: {
    sobre: "Sobre",
    eixos: "Eixos",
    acessarPainel: "Acessar painel",
    abrirMenu: "Abrir menu",
    navegacao: "Navegação",
    altLogo: "SEPLAN — Secretaria de Estado de Planejamento",
  },

  footer: {
    navegacao: "Navegação",
    institucional: "Institucional",
    itens: {
      sobre: "Sobre",
      eixos: "Eixos temáticos",
      instrumentos: "Instrumentos legais",
      painel: "Painel de dados",
    },
    institucionalItens: {
      seplan: "SEPLAN",
      diario: "Diário Oficial do Acre",
      legislacao: "Legislação estadual",
      transparencia: "Portal da Transparência",
    },
    altLogo: "Governo do Estado do Acre 2023-2026",
    copyright: (ano: number) =>
      `© ${ano} Governo do Estado do Acre · Secretaria de Estado de Planejamento do Acre - Departamento de Estudos e Planejamento Orçamentário - DEPPO/SEPLAN`,
    endereco: "Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060",
    creditos:
      "Coordenação: Denyscley Oliveira Bandeira (Departamento de Estudos e Planejamento Orçamentário); Equipe Técnica: Ícaro Lebre Gundim (Economista), Luísa Nascimento Ribeiro (Economista), Roseneide Mendonça de Sena Caldera (Especialista Executiva – Administração), Vinicius Carneiro de Farias (Economista).",
  },

  landing: {
    hero: {
      tituloA: "Orçamento Climático",
      tituloB: "do Estado do Acre",
      paragrafo:
        "Ferramenta inédita para organizar e acompanhar os gastos públicos destinados à proteção ambiental e ao enfrentamento das mudanças climáticas.",
      botao: "Acessar painel interativo",
      credito: "Fotografia: Pedro Devani - SECOM/AC",
    },
    sobre: {
      titulo: "O que é o Orçamento Climático?",
      p1a: "O Orçamento Climático é uma ferramenta inédita no Estado do Acre, criada para organizar e acompanhar os gastos públicos destinados à proteção ambiental e ao enfrentamento das mudanças climáticas, conforme estabelece a",
      lei: "Lei nº 4.679, de 10 de novembro de 2025",
      p2: "Mais do que um instrumento contábil, trata-se de um modelo inovador de gestão, que permite identificar, monitorar e avaliar todas as ações governamentais que contribuem para:",
      objetivos: [
        "Reduzir os impactos das mudanças climáticas (mitigação);",
        "Preparar o Estado para enfrentar esses impactos (adaptação);",
        "Proteger populações e territórios vulneráveis;",
        "Valorizar os recursos naturais e culturais da Amazônia.",
      ],
      p3: "Com essa ferramenta, o Acre busca mensurar com precisão quanto investe em ações climáticas, avaliar a efetividade dos projetos, atrair recursos nacionais e internacionais e fortalecer políticas públicas voltadas à sustentabilidade.",
      cartaoTitulo: "Em outras palavras",
      cartaoA: "É a resposta à pergunta",
      cartaoForte: "“quanto o Estado do Acre investe, de fato, em clima?”",
      cartaoB: "— separando o que é despesa exclusivamente climática do que contribui de forma parcial, em todas as áreas do governo.",
      credito: "Fotografia: Arison Jardim - SECOM/AC",
    },
    eixos: {
      titulo: "Eixos temáticos",
      subtitulo:
        "Aplicado de forma transversal e integrada a todas as áreas do governo — como saúde, educação, infraestrutura, agricultura, meio ambiente e assistência social — o Orçamento Climático estrutura-se em sete eixos temáticos:",
      doTotal: "do total",
      credito: "Fotografia: Talita Oliveira - SECOM/AC",
    },
    cta: {
      titulo: "Explore os dados do Orçamento Climático",
      paragrafo:
        "Consulte a dotação por eixo temático, por órgão e por Objetivo de Desenvolvimento Sustentável, com filtros e exportação dos resultados.",
      botao: "Acessar dados",
      credito: "Fotografia: Agência de Notícias do Acre",
    },
    informativo: {
      titulo: "Saiba mais sobre o Orçamento Climático",
      paragrafo:
        "Um compilado de informações sobre a ferramenta: os fundamentos, a metodologia da lente climática, os sete eixos temáticos e os programas com impacto climático no estado.",
      botao: "Baixar PDF",
    },
    notaAno: {
      texto: (ano: number) => `Os valores são referentes ao ano de ${ano}`,
    },
    rolagem: {
      aria: "Rolar para a próxima seção",
      rotulo: "Role para baixo",
    },
  },

  painel: {
    semOrgaos: "Nenhum órgão corresponde aos filtros selecionados.",
    banner: {
      secoes: {
        analises: {
          titulo: "Visão Geral",
          descricao: (exercicio: number, fonte: string) =>
            `Síntese da dotação climática do exercício ${exercicio}, separando a despesa exclusiva — de finalidade integralmente climática — da não exclusiva, que contribui apenas em parte. Fonte: ${fonte}.`,
        },
        acoes: {
          titulo: "Tabela Detalhada",
          descricao:
            "Dotação climática por órgão, com a opção de abrir cada eixo temático até a aplicação programada. Exportável em XLSX e PDF.",
        },
        instrumentos: {
          titulo: "Instrumentos Legais",
          descricao:
            "Base normativa do Orçamento Climático do Estado do Acre: leis, decretos, planos e documentos técnicos que sustentam a metodologia.",
        },
        historico: {
          titulo: "Histórico",
          descricao:
            "A legislação ambiental e climática do Acre desde 1965, com a ementa e o link para o texto oficial de cada norma. Os planos plurianuais e as leis de diretrizes trazem quantas vezes cada termo climático aparece no texto, e as leis orçamentárias mostram quanto coube aos órgãos ambientais em cada exercício.",
        },
        ods: {
          titulo: "ODS",
          descricao:
            "Alinhamento do Orçamento Climático aos Objetivos de Desenvolvimento Sustentável da Agenda 2030, com o eixo temático a que cada indicador se relaciona.",
        },
      },
    },
    sidebar: {
      itens: {
        analises: "Visão Geral",
        acoes: "Tabela Detalhada",
        instrumentos: "Instrumentos Legais",
        historico: "Histórico",
        ods: "ODS",
      },
      voltar: "Voltar à Página Inicial",
      expandir: "Expandir menu lateral",
      recolher: "Recolher menu lateral",
      abrirMenu: "Abrir menu",
      secoes: "Seções do painel",
      altBandeira: "Bandeira do Acre",
      tema: "Tema claro / escuro",
    },
    filtros: {
      titulo: "Filtros",
      limpar: "Limpar filtros",
      ano: "Ano",
      eixo: "Eixo temático",
      orgao: "Órgão",
      classificacao: "Classificação",
      pesquisar: "Pesquisar",
      placeholder: "Pesquisar órgão...",
      todosEixos: "Todos os eixos temáticos",
      todosOrgaos: "Todos os órgãos",
      todasClassificacoes: "Todas as classificações",
      nenhum: "Nenhum órgão corresponde aos filtros.",
      nOrgaos: (n: number, m: number) => `${n} de ${m} órgãos no recorte atual.`,
    },
    kpis: {
      atuantes: {
        titulo: "Órgãos Atuantes",
        subtitulo: "Identificados",
      },
      exclusivoPlanejado: {
        titulo: "Orçamento Climático Exclusivo Planejado",
        doTotal: "do total",
      },
      dotacaoExclusiva: {
        titulo: "Dotação Exclusiva",
        rotuloValor: "Aplicações programadas",
      },
      dotacaoNaoExclusiva: {
        titulo: "Dotação Não Exclusiva",
        rotuloValor: "Aplicações programadas",
      },
      notaValidacao: "Em fase de validação",
      notaAria: (nota: string, titulo: string) => `${nota} — sobre ${titulo}`,
    },
    detalhamento: {
      titulo: "Tabela detalhada",
      colunas: {
        nome: "Órgão",
        total: "Dotação total",
        exclusivo: "Exclusivo",
        naoExclusivo: "Não exclusivo",
        tipo: "Classificação",
        eixos: "Eixos",
      },
      visao: {
        tabela: "Tabela",
        detalhado: "Detalhado",
      },
      gerando: "Gerando…",
      ordenarPor: (rotulo: string) => `Ordenar por ${rotulo}`,
      rodape: {
        nenhum: "Nenhum órgão",
        palavra: (n: number): string => (n === 1 ? "órgão" : "órgãos"),
        mostrando: (inicio: number, fim: number, n: number, palavra: string) =>
          `Mostrando ${inicio}–${fim} de ${n} ${palavra} · total`,
      },
      filtroFonte: {
        botao: "Fonte",
        aria: "Filtrar por fonte de recursos",
        placeholder: "Buscar por código ou nome...",
        ariaBusca: "Buscar fonte de recursos",
        selecionadas: (n: number) => `${n} ${n === 1 ? "selecionada" : "selecionadas"}`,
        limpar: "Limpar",
        vazio: "Nenhuma fonte com esse código ou nome.",
        maiores: "Maiores",
        demais: "Demais",
      },
      fichaFonte: {
        varias: (n: number) => `${n} fontes selecionadas`,
        uma: (codigo: string) => `Fonte ${codigo}`,
        doRecorte: "do recorte",
        acoes: (n: number): string => (n === 1 ? "ação" : "ações"),
        rateioVaria:
          "Valores rateados pela participação das fontes na dotação inicial de cada ação no QDD.",
        rateioUma: "Valores rateados pela participação da fonte na dotação inicial de cada ação no QDD.",
      },
    },
    accordion: {
      vazioUmaFonte: (fonte: string) =>
        `Nenhum órgão tem ação na fonte ${fonte} dentro dos filtros selecionados.`,
      vazioVariasFontes: (n: number) =>
        `Nenhum órgão tem ação nas ${n} fontes selecionadas dentro dos filtros selecionados.`,
      totalPorEixo: (romano: string) => `Total por Eixo Temático (Eixo ${romano})`,
      totalOrcamentario: "Total Orçamentário",
      exclusivo: "Orçamento Exclusivo:",
      naoExclusivo: "Orçamento Não Exclusivo:",
      eixoN: (n: number) => `Eixo ${n}`,
    },
    historico: {
      indicadores: {
        normas: {
          titulo: "Normas mapeadas",
          subtitulo: "leis, decretos e planos com recorte ambiental e climático",
        },
        periodo: {
          titulo: "Período coberto",
          subtitulo: (anos: number) => `${anos} anos de legislação`,
        },
        instrumentos: {
          titulo: "Instrumentos de planejamento",
          subtitulo: "entre PPAs, LDOs e LOAs",
        },
      },
      acervoTitulo: "Acervo normativo",
      acervoTexto:
        "Escolha um tipo de norma para percorrer o acervo. O levantamento partiu de descritores como “mudanças climáticas”, “carbono”, “povos indígenas” e “bioeconomia” para achar cada norma.",
      buscar: "Buscar",
      placeholderBusca: "Ementa, número, órgão…",
      limparBusca: "Limpar busca",
      decada: "Década",
      todasDecadas: (n: number) => `Todas as décadas (${n})`,
      ordenarPor: "Ordenar por",
      ordens: {
        recentes: "Mais recentes",
        antigas: "Mais antigas",
        numero: "Número da norma",
      },
      limparFiltros: "Limpar filtros",
      rodape: {
        nenhuma: "Nenhuma norma",
        palavra: (n: number): string => (n === 1 ? "norma" : "normas"),
        mostrando: (inicio: number, fim: number, n: number, palavra: string) =>
          `Mostrando ${inicio}–${fim} de ${n} ${palavra}`,
        deTotal: (m: number) => ` (de ${m} no total)`,
      },
      notaFonteA: (origem: string) => `Fonte: ${origem} sobre a base do `,
      notaFonteB: (n: number, data: string) =>
        `. São ${n} normas, atualizadas em ${data}.`,
    },
    acervo: {
      vazio: "Nenhuma norma corresponde a esta busca.",
      detalhe: {
        publicacao: "Publicação no DOE",
        texto: "Texto da norma",
        orgao: "Órgão",
        tambem: "Também consta em",
        descritores: "Descritores climáticos no texto",
        descritoresVazio: "Descritores climáticos não identificados no levantamento.",
        dotacao: "Dotação dos órgãos ambientais",
        metas: "Metas e prioridades",
      },
      valores: {
        rp: "Recursos próprios",
        outras: "Outras fontes",
        total: "Total",
      },
      moedaEpoca:
        "Exercício anterior ao real: os valores ficam na moeda da época e não entram no gráfico.",
      nOrgaos: (n: number) => `${n} ${n === 1 ? "órgão" : "órgãos"}`,
      exercicio: (n: number) => `Exercício ${n}`,
      quadrienio: (a: number, b: number) => `Quadriênio ${a}–${b}`,
    },
    ods: {
      semEixoMapeado: "Sem eixo mapeado",
      eixoRotulo: (romano: string) => `Eixo ${romano}`,
      verFicha: (codigo: string) => `Ver a ficha de ${codigo} no portal ODS Brasil`,
      nota: {
        titulo: "Sobre os links dos indicadores",
        p1: "Os códigos com link levam à ficha do indicador no portal ODS Brasil, do IBGE.",
        p2: "Os demais estão em elaboração, em análise ou sem dados produzidos pelo Governo Federal.",
        aria:
          "Sobre os links dos indicadores: os códigos com link levam à ficha do indicador no portal ODS Brasil, do IBGE; os demais estão em elaboração, em análise ou sem dados produzidos pelo Governo Federal",
      },
      vazio: "Nenhum indicador deste ODS corresponde aos filtros ativos.",
      tiles: {
        mapeados: {
          titulo: "Indicadores mapeados",
          subtitulo: "Correspondem aos filtros",
        },
        contemplados: {
          titulo: "ODS contemplados",
          subtitulo: "Com ao menos um indicador",
        },
        pendentes: {
          titulo: "Em construção ou sem dados",
          subtitulo: "Indicadores ainda não produzidos",
        },
      },
      eixo: "Eixo:",
      todos: "Todos",
      eixoOpcao: (romano: string) => `Eixo ${romano}`,
      situacao: "Situação:",
      todas: "Todas",
      placeholder: "Buscar por ODS, código ou texto do indicador...",
      ariaBusca: "Buscar indicadores dos ODS",
      nSelecionados: (n: number) => `${n} ODS selecionados`,
      fecharTodos: "Fechar todos",
      dica: "Clique nos ODS acima para ver seus indicadores — pode escolher mais de um.",
    },
    graficos: {
      dica: {
        total: "Total",
        doRecorte: "do recorte atual",
      },
      composicao: {
        titulo: "Composição do Orçamento Climático",
        descricao: "Dotação exclusivamente climática frente à parcela que contribui de forma parcial.",
        valor: "Valor",
      },
      porEixo: {
        titulo: "Orçamento por Eixo",
        descricao: "Dotação climática planejada em cada eixo temático.",
        dotacao: "Dotação",
      },
      porOrgao: {
        titulo: "Orçamento por Secretaria",
        descricao: (n: number) =>
          `${n} ${n === 1 ? "órgão" : "órgãos"} no recorte atual, do maior para o menor.`,
        exclusivo: "Exclusivo",
        naoExclusivo: "Não exclusivo",
      },
      exclusivoPorEixo: {
        titulo: "Exclusivo × Não exclusivo por eixo",
        descricao:
          "Divisão estimada em cada eixo — a fonte informa a classificação no nível do órgão, rateada aqui pela fatia do eixo.",
        exclusivo: "Exclusivo",
        naoExclusivo: "Não exclusivo",
      },
      serieLoa: {
        titulo: "A dotação dos órgãos ambientais, exercício a exercício",
        descricao: (primeiro: number, ultimo: number) =>
          `Soma das dotações dos órgãos ambientais em cada Lei Orçamentária Anual, de ${primeiro} a ${ultimo}. Clique numa barra para abrir a lei daquele exercício.`,
        rp: "Recursos próprios",
        outrasFontes: "Outras fontes",
        pandemiaTitulo: (a: number, b: number) => `Pandemia de COVID-19 nos exercícios de ${a} a ${b}`,
        pandemiaTexto:
          "A emergência foi declarada em março de 2020. O Brasil a encerrou em maio de 2022 (Portaria GM/MS nº 913/2022) e a OMS, em maio de 2023. O recorte vai até 2024 porque os efeitos orçamentários sobrevivem ao fim da emergência.",
        notaCruzeiro: (a: number, b: number) =>
          `Os exercícios de ${a} a ${b} foram orçados em cruzeiro e ficaram de fora do gráfico. Converter aqueles valores para real por um fator fixo daria um número sem sentido, porque a inflação da época corroía o dinheiro mês a mês. Essas leis estão na lista abaixo, com o valor na moeda de então.`,
        notaRecorte:
          "Esta série soma o que coube aos órgãos e fundos da área ambiental em cada exercício. O restante do painel usa outro recorte, por eixo temático, que alcança dotações climáticas de qualquer secretaria. Por isso os dois totais não batem.",
        dica: (exercicio: number | string, numero: string) => `Exercício ${exercicio}, Lei nº ${numero}`,
      },
    },
  },

  dados: {
    status: {
      produzido: "Produzido",
      construcao: "Em construção",
      "sem-dados": "Sem dados",
    } as Record<StatusOds, string>,
    tipoDotacao: {
      Exclusivo: "Exclusivo",
      "Não Exclusivo": "Não Exclusivo",
    } as Record<TipoDotacao, string>,
    tiposNorma: {
      "Lei Ordinária": {
        rotulo: "Lei Ordinária",
        descricao:
          "Leis aprovadas pela Assembleia Legislativa sobre meio ambiente e clima. As que criam ou reorganizam órgãos ficam em Estrutura Administrativa.",
      },
      Decreto: {
        rotulo: "Decreto",
        descricao:
          "Atos do governador. Regulamentam as leis ambientais, criam comitês e planos, declaram situações de emergência.",
      },
      "Estrutura Administrativa": {
        rotulo: "Estrutura Administrativa",
        descricao: "Leis que criam e reorganizam os órgãos ambientais do Estado e as carreiras de seus servidores.",
      },
      PPA: {
        rotulo: "PPA",
        descricao:
          "Plano Plurianual. Define os programas e as metas do Estado para quatro anos, e é a base da LDO e da LOA.",
      },
      LDO: {
        rotulo: "LDO",
        descricao:
          "Lei de Diretrizes Orçamentárias. Fixa, a cada ano, as prioridades que a lei orçamentária do ano seguinte deve atender.",
      },
      LOA: {
        rotulo: "LOA",
        descricao: "Lei Orçamentária Anual. Estima a receita e fixa a despesa de cada órgão para o exercício.",
      },
    } as Record<TipoNorma, { rotulo: string; descricao: string }>,
    especieNorma: {
      Lei: "Lei",
      "Lei Complementar": "Lei Complementar",
      Decreto: "Decreto",
      "Constituição Estadual": "Constituição Estadual",
    } as Record<string, string>,
    categoriaInstrumentos: {
      "Publicações Oficiais": "Publicações Oficiais",
      "Constituição Federal": "Constituição Federal",
      "Leis Estaduais": "Leis Estaduais",
      "Leis Federais": "Leis Federais",
    } as Record<string, string>,
    fonteBanner: "SEPLAN/AC — Departamento de Estudos e Planejamento (DEPLAN)",
    origemHistorico: "Histórico de leis do Orçamento Climático, levantamento manual da SEPLAN",
    numeroLei: "nº",
  },

  export: {
    xlsx: {
      aba: "Microdados",
      colunas: {
        exercicio: "exercicio",
        codigoOrgao: "codigo_orgao",
        orgao: "orgao",
        orgaoCompleto: "orgao_completo",
        eixo: "eixo",
        eixoNumero: "eixo_numero",
        aplicacao: "aplicacao_programada",
        classificacao: "classificacao",
        dotacao: "dotacao",
      },
      arquivo: (data: string) => `microdados_orcamento_climatico_${data}.xlsx`,
    },
    pdf: {
      titulo: "Orçamento Climático – Detalhamento por Órgão",
      subtitulo: "Departamento de Estudos e Planejamento Orçamentário – DEPPO/SEPLAN",
      exercicio: "Exercício:",
      exportadoEm: "Exportado em:",
      pagina: "Página",
      rodape: "Secretaria de Estado de Planejamento – SEPLAN | Governo do Estado do Acre",
      semAplicacoes: "Sem aplicações programadas",
      colunas: ["Aplicação Programada", "Classificação", "Dotação (R$)"],
      exclusivo: "Exclusivo:",
      naoExclusivo: "Não Exclusivo:",
      total: "TOTAL:",
      totalGeral: "TOTAL GERAL",
      nOrgaos: (n: number) => `(${n} ${n === 1 ? "órgão" : "órgãos"})`,
      boxExclusivo: "Exclusivo",
      boxNaoExclusivo: "Não Exclusivo",
      boxTotal: "Total",
      creditos: [
        "Coordenador: Denyscley Oliveira Bandeira (Gestor de Políticas Públicas) | Equipe Técnica: Ícaro Lebre Gundim (Economista),",
        "Luísa Nascimento Ribeiro (Economista), Roseneide Sena (Especialista Executiva Administradora), Vinícius Carneiro de Farias (Economista)",
      ],
      arquivo: (data: string) => `relatorio_orcamento_climatico_${data}.pdf`,
    },
  },
};

export type Dicionario = typeof pt;
