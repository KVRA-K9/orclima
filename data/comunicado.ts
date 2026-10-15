/**
 * Conteúdo do Comunicado do Orçamento Climático, transcrito do documento
 * "Textos para composição do release Orçamento Climático" (Release/), com
 * erratas pontuais de pontuação (acordadas) e URLs das referências limpas do
 * artefato `chrome-extension://…` do visualizador do Chrome.
 *
 * Fonte única de duas frentes:
 *   - `scripts/gerar-pdf-comunicado.ts` — gera o PDF institucional servido
 *     em `public/comunicado-orcamento-climatico.pdf` (regenerar com
 *     `npm run comunicado:pdf`);
 *   - o card de download na seção "Sobre" da landing (`sobre.tsx`).
 */

export const COMUNICADO = {
  titulo: "Orçamento Climático do Estado do Acre",
  kicker: "",
  ano: 2026,
  subtitulo:
    "Governo do Estado do Acre · Secretaria de Estado de Planejamento · Departamento de Estudos e Planejamento Orçamentário (DEPPO)",
} as const;

export const PDF_COMUNICADO = "/informativo-orcamento-climatico.pdf";

export type ItemLista = { nome: string; texto: string };

export type Bloco =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: ItemLista[] }
  | {
      tipo: "nivel";
      titulo: string;
      texto: string;
      itens?: ItemLista[];
    };

export type Secao = { numero: number; titulo: string; blocos: Bloco[] };

export type Referencia = { corpo: string; url?: string };

export const SECOES: Secao[] = [
  {
    numero: 1,
    titulo: "Orçamento público frente às mudanças climáticas",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A intensificação dos eventos climáticos extremos, vivenciados cada vez mais na recorrência de secas prolongadas, inundações severas e instabilidades nos regimes de chuvas, deixou de ser uma projeção científica para se consolidar como uma realidade estrutural que afeta diretamente a estabilidade macroeconômica, a segurança alimentar e a coesão social dos territórios (IPCC, 2023). Nesse cenário, as ferramentas tradicionais de gestão revelaram-se obsoletas: historicamente concebido como um instrumento neutro de alocação contábil de receitas e despesas, o orçamento público convencional tornou-se cego frente a essas externalidades socioambientais, por desvincular a contabilidade fiscal da gestão de riscos ecológicos e da resiliência territorial (OECD, 2021).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Em resposta a essa lacuna, o cenário global e subnacional tem testemunhado uma profunda mudança paradigmática: a emergência dos orçamentos verdes e climáticos. No plano internacional, organismos multilaterais e blocos como a União Europeia lideram movimentos de mainstreaming climático, vinculando fatias expressivas de seus orçamentos plurianuais a metas rígidas de descarbonização e adaptação (European Commission, 2020).",
      },
      {
        tipo: "paragrafo",
        texto:
          "No mesmo sentido, redes de cooperação de alto impacto como a C40 Cities têm liderado uma revolução na governança pública ao institucionalizar o Climate Budgeting em metrópoles globais e capitais estratégicas (incluindo pioneiras no Brasil, como o município do Rio de Janeiro e outras cidades do Sudeste). Esse modelo transforma o orçamento em um sistema dinâmico de rastreabilidade, vinculando metas de descarbonização e gestão de riscos diretamente ao planejamento financeiro plurianual e anual (C40 Cities, 2024; C40 Knowledge Hub, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "No Brasil, o debate evoluiu da centralidade federal para uma urgente agenda subnacional. Como apontam análises de redes de políticas públicas e marcos regulatórios recentes, estados e municípios estão na linha de frente dos desastres socioambientais, arcando com o custo fiscal desproporcional, altamente focado em recuperação pós-desastres (Siqueira e Veiga, 2025; Cepal, 2023). É o que corrobora o Comsefaz e o Ipea apontando que os entes subnacionais ainda enfrentam fortes assimetrias, atuando muitas vezes de maneira predominantemente reativa, o que gera custos fiscais desproporcionais de desastres e recuperação em detrimento de uma matriz preventiva estruturada (Comsefaz, 2026).",
      },
      {
        tipo: "paragrafo",
        texto:
          "A dimensão real desta vulnerabilidade territorial e o custo fiscal no Acre tem comprovação empírica. Segundo levantamentos recentes compilados no estudo Panorama dos Desastres no Brasil – 2013 a 2025, realizado pela Confederação Nacional de Municípios (CNM, 2025), o Acre acumulou 4.493.677 pessoas afetadas por desastres entre 2013 e 2025, registrando um histórico dramático de impactos provocados por enchentes severas e estiagens extremas em um mesmo ciclo anual. No período, o estado contabilizou 17 mortes, 46.635 desabrigados e 161.891 desalojados, com prejuízos econômicos e sociais acumulados que superam R$ 3,72 bilhões, montante que se desdobra em R$ 1,63 bilhão em perdas habitacionais, R$ 1,39 bilhão em prejuízos privados (como destruição de lavouras e paralisação de serviços) e R$ 692,5 milhões em danos diretos à infraestrutura pública.",
      },
      {
        tipo: "paragrafo",
        texto:
          "É sobre esse cenário de desafios que o Acre se destaca como pioneiro na agenda climática. O reconhecimento histórico de sua vocação socioambiental e de sua robusta arquitetura de governança climática e florestal apoia-se em marcos precursores, a exemplo da política de Pagamento por Serviços Ambientais/SISA (Lei 2.308/2010), que viabilizou o pioneiro REDD+ Early Movers (REM Acre). Mais do que uma resposta à conjuntura, é justamente para estancar esse passivo fiscal recorrente e superar a lógica estritamente reativa do pós-desastre que o Estado consolida sua vanguarda ao institucionalizar o seu Orçamento Climático, por meio da Lei Estadual nº 4.679/2025.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Esta ferramenta de planejamento fiscal não representa apenas um exercício contábil, mas a consagração da lente climática como o eixo integrador entre o erário público e os compromissos de mitigação, adaptação e resiliência. Ao alinhar o ciclo orçamentário às diretrizes da Taxonomia Sustentável Brasileira (TSB) e aos Objetivos de Desenvolvimento Sustentável (ODS), o Estado do Acre demonstra que responsabilidade fiscal e sustentabilidade ambiental são indissociáveis (Ministério da Fazenda, 2024).",
      },
      {
        tipo: "paragrafo",
        texto:
          "O Estado do Acre assume, assim, o compromisso irrevogável de superar a invisibilidade dos gastos socioambientais, assegurando que cada recurso público alocado sirva efetivamente para proteger a sociobiodiversidade e blindar o futuro acreano frente às incertezas do clima.",
      },
    ],
  },
  {
    numero: 2,
    titulo: "Transparência e sustentabilidade na gestão orçamentária",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A modernização da administração pública contemporânea exige a superação de modelos tradicionais de prestação de contas baseados estritamente na legalidade formal. No Brasil, a transparência fiscal avança ao transcender os marcos normativos históricos já consolidados, a exemplo da Lei de Responsabilidade Fiscal (Lei Complementar nº 101/2000) e da Lei de Acesso à Informação (Lei nº 12.527/2011), e passa a incorporar a vertente socioambiental e climática como eixo estruturante do erário (Transparência Internacional Brasil, 2023). No contexto do Estado do Acre, a transparência orçamentária deixa de ser mero cumprimento de exigência burocrática para se converter em um instrumento ativo de accountability climática e governança baseada em evidências (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Como apontam diagnósticos recentes de organismos especializados em integridade pública, a exemplo das avaliações sobre transparência e governança climática conduzidas pela Transparência Internacional – Brasil, os governos subnacionais historicamente padecem de graves assimetrias informacionais, concentrando-se predominantemente em faixas insuficientes de publicidade ativa de dados socioambientais e orçamentários (Transparência Internacional Brasil, 2025; 2026). Nesse sentido, a organização adverte que a “ausência de bases de dados abertas, desagregadas e de painéis de rastreabilidade gera uma lacuna perigosa: a dissociação entre o discurso político de sustentabilidade e a efetiva execução financeira nos territórios”.",
      },
      {
        tipo: "paragrafo",
        texto:
          "É exatamente para romper com esse padrão que a abertura e a rastreabilidade minuciosa dos gastos públicos verdes cumprem uma função estratégica fundamental na proposta do Orçamento Climático do Acre: a transparência dos gastos públicos sob a lente climática. Em um mercado global e subnacional cada vez mais rigoroso quanto à integridade das políticas climáticas, a publicação detalhada de rubricas orçamentárias vinculadas a metas de mitigação e adaptação submete a gestão pública a um crivo inegociável, garantindo que cada centavo alocado encontre respaldo direto na prática orçamentária (Climate Policy Initiative – CPI, 2024; OECD, 2022).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Ademais, essa transparência de alto rigor técnico atua como um atrativo de investimentos internacionais, financiamentos climáticos concessionais e recursos baseados em resultados, a exemplo de parcerias com bancos multilaterais de desenvolvimento e mercados de carbono regulados (World Bank, 2023). Investidores institucionais e fundos globais exigem padrões robustos de monitoramento, reporte e verificação integrados às contas públicas, assegurando que o capital externo seja canalizado com segurança jurídica e eficácia comprovada.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Por fim, ao institucionalizar painéis de dados abertos e canais acessíveis de acompanhamento do Orçamento Climático, o Estado do Acre atende às principais recomendações de governança aberta e amplia o exercício do controle social. A fiscalização democrática da aplicação dos recursos públicos ganha capilaridade real, superando as barreiras estruturais de participação apontadas na Amazônia Legal e transformando o cidadão em um co-gestor da sustentabilidade fiscal e climática do Estado (Transparência Internacional Brasil, 2026).",
      },
    ],
  },
  {
    numero: 3,
    titulo: "Rastreabilidade orçamentária e a contribuição às metas globais dos ODS",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A efetividade das políticas públicas voltadas ao enfrentamento da crise climática contemporânea depende intrinsecamente da capacidade de traduzir compromissos internacionais abstratos em metas locais mensuráveis e orçamentariamente auditáveis. Nesse sentido, a Agenda 2030 da Organização das Nações Unidas (ONU) e seus Objetivos de Desenvolvimento Sustentável (ODS) deixaram de ser meras diretrizes retóricas de sustentabilidade para se consolidarem como o principal arcabouço global de monitoramento de políticas públicas (UN, 2015). No Brasil, experiências práticas de alinhamento entre os Planos Plurianuais (PPA) e os ODS vêm sendo adotadas por governos estaduais e capitais que utilizam a Agenda 2030 para orientar investimentos públicos em transição energética, saneamento e proteção de biomas. No âmbito do Estado do Acre, a consolidação do Orçamento Climático estabelece uma ponte metodológica direta entre o ciclo de planejamento fiscal e a concretização dessas metas globais, com destaque para a Ação Contra a Mudança Global do Clima (ODS 13), a Vida Terrestre (ODS 15) e a efetivação de Parcerias e Meios de Implementação (ODS 17).",
      },
      {
        tipo: "paragrafo",
        texto:
          "A rastreabilidade orçamentária atua como a espinha dorsal dessa integração. Historicamente, os sistemas de execução financeira dos governos operam compartimentalizados, dificultando a identificação precisa de quanto e onde o erário público efetivamente investia em ações de adaptação baseada em ecossistemas, conservação florestal e mitigação de emissões. Conforme aponta a Comissão Econômica para a América Latina e o Caribe em diagnósticos sobre finanças para o desenvolvimento, a ausência de mecanismos estruturados de rastreio em grande parte dos países e entes subnacionais limita a transparência e dificulta a mensuração do impacto real dos recursos frente aos compromissos climáticos globais (Cepal, 2024). Ao introduzir marcadores orçamentários específicos e metodologias de etiquetagem de despesas vinculadas à Taxonomia Sustentável Brasileira, o Governo do Acre rompe com essa opacidade (Ministério da Fazenda, 2024). Cada programa, ação e meta do plano plurianual passa a ser escrutinado sob a ótica de sua contribuição real para a resiliência climática do território.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Essa granularidade na rastreabilidade dos gastos públicos verdes gera um duplo dividendo institucional. Em primeiro lugar, permite ao Estado prestar contas de forma transparente e tempestiva aos fóruns internacionais e nacionais de clima, comprovando o cumprimento de compromissos assumidos em acordos globais, a exemplo das diretrizes de reporte e rastreamento estabelecidas pela UNFCCC para governos no âmbito do Acordo de Paris e das metas de descarbonização (UNFCCC, 2021). Em segundo lugar, fornece aos gestores públicos e aos órgãos de controle uma ferramenta analítica de altíssima precisão para a tomada de decisões baseadas em evidências, otimizando a alocação de recursos escassos em gargalos prioritários de vulnerabilidade socioambiental.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Dessa forma, o Orçamento Climático do Acre eleva a gestão fiscal subnacional a um patamar de excelência internacional. Ao demonstrar, por meio de dados auditáveis, como o orçamento estadual financia diretamente a conservação da sociobiodiversidade e a transição para uma economia de baixo carbono, o Estado não apenas cumpre seu papel federativo, mas atua como um laboratório vivo de vanguarda na construção de políticas públicas capazes de responder, com eficácia financeira e rigor científico, aos desafios urgentes que já vivenciamos.",
      },
    ],
  },
  {
    numero: 4,
    titulo:
      "Identificação do gasto público com foco nas pessoas, na biodiversidade e nos serviços ecossistêmicos",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A efetividade de qualquer política de finanças climáticas subnacionais reside na capacidade de redirecionar o fluxo de recursos públicos para o seu destino mais essencial: a proteção da vida humana, a integridade da biodiversidade e a preservação dos serviços ecossistêmicos. Historicamente, os orçamentos públicos tradicionais operaram sob uma lógica setorial fragmentada, na qual os investimentos em conservação ambiental e proteção social figuravam como externalidades periféricas ou despesas de caráter estritamente compensatório. No modelo de Orçamento Climático institucionalizado pelo Estado do Acre, essa lógica é invertida, colocando as pessoas, os ecossistemas e a sociobiodiversidade no epicentro do planejamento fiscal (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "A identificação e a classificação do gasto público verde exigem metodologias sofisticadas de marcação orçamentária que permitam isolar e mensurar o impacto direto das ações governamentais sobre a resiliência das comunidades e a estabilidade climática. Essa maturidade fiscal do Acre apoia-se em seu histórico de responsabilidade na gestão de parcerias e financiamentos de programas públicos de grande envergadura junto a bancos multilaterais de desenvolvimento, a exemplo do Banco Interamericano de Desenvolvimento (BID), do Banco Mundial (BIRD) e do Fonplata. Ao atrair e gerenciar esses robustos investimentos internacionais, o Estado aprimorou a transparência, a prestação de contas e a eficiência na aplicação dos recursos em prol do desenvolvimento sustentável.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Como pontuam diretrizes internacionais de finanças para o desenvolvimento sustentável, a adaptação baseada em ecossistemas e a conservação de florestas tropicais não constituem apenas despesas ambientais isoladas, mas investimentos estruturais na macroeconomia do território e na segurança humana (IPCC, 2022; World Bank, 2023). No Acre, essa abordagem traduz-se na identificação de rubricas orçamentárias voltadas ao fortalecimento de cadeias produtivas sustentáveis, à gestão territorial e ambiental de terras indígenas e unidades de conservação, ao comando e controle, e à garantia de salvaguardas socioambientais fundamentadas (SEPLAN-AC, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "O foco nas pessoas implica reconhecer que os impactos das mudanças climáticas não são neutros, pois recaem desproporcionalmente sobre populações tradicionais, agricultores familiares, povos indígenas e comunidades urbanas vulneráveis. Ao rastrear e direcionar o gasto público para a redução dessas vulnerabilidades, por meio da promoção de segurança alimentar, acesso à água potável, a infraestrutura verde urbana e a bioeconomia, o Orçamento Climático assegura que a transição climática seja justa e inclusiva (Cepal, 2024).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Simultaneamente, a orientação na biodiversidade e nos serviços ecossistêmicos, a exemplo da regulação do regime de chuvas, do sequestro e estocagem de carbono e da proteção de bacias hidrográficas, confere embasamento científico à alocação de recursos. Cada programa orçamentário marcado sob essa diretriz passa a ser avaliado por sua capacidade de manter a floresta em pé e funcional. Dessa forma, ao aprimorar a marcação do gasto público, o Governo também reforça sua credibilidade na aplicação de investimentos captados junto aos Bancos Multilaterais de Desenvolvimento, demonstrando que o investimento público em sustentabilidade não é um custo fiscal. Ao contrário, consolida-se como o principal ativo de garantia de prosperidade, eficiência administrativa e estabilidade socioeconômica para os seus parceiros, financiadores e para as presentes e futuras gerações acreanas.",
      },
    ],
  },
  {
    numero: 5,
    titulo:
      "A lente climática como referencial para a metodologia e os eixos climáticos",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A operacionalização de um Orçamento Climático exige a superação de métodos contábeis convencionais por meio de inovações metodológicas capazes de intervir diretamente na arquitetura do gasto público. O conceito central que viabiliza essa transformação é a lente climática: um filtro analítico transversal e sistemático que incide sobre o ciclo orçamentário, desde a concepção do Plano Plurianual (PPA) e da Lei de Diretrizes Orçamentárias (LDO) até a execução da Lei Orçamentária Anual (LOA), permitindo avaliar como cada ação governamental interage com as metas de descarbonização e resiliência do território (OECD, 2021; World Bank, 2023). No Estado do Acre, sob a coordenação técnica da Secretaria de Estado de Planejamento (SEPLAN) e seu Departamento de Estudos e Planejamento Orçamentário (DEPPO), a aplicação dessa lente metodológica transforma o planejamento fiscal em um instrumento de inteligência estratégica, garantindo que o orçamento deixe de ser míope às variáveis socioambientais (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "A adoção da lente climática estrutura-se metodologicamente em torno de dois níveis sequenciais e integrados de classificação: Alocação Macro e Classificação Micro, ancorados nos sete eixos climáticos definidos pela Lei Estadual nº 4.679, de 10 de novembro de 2025:",
      },
      {
        tipo: "lista",
        itens: [
          {
            nome: "Desenvolvimento sustentável e bioeconomia",
            texto:
              "focado na valorização dos recursos naturais e no fomento a cadeias produtivas de base sustentável, na transição para uma economia de baixo carbono e no fortalecimento de ativos da sociobiodiversidade.",
          },
          {
            nome: "Mitigação das mudanças climáticas",
            texto:
              "direcionado às ações voltadas à redução líquida de emissões de gases de efeito estufa (GEE), controle e combate ao desmatamento e às queimadas, transição energética e aumento dos estoques de carbono.",
          },
          {
            nome: "Adaptação climática",
            texto:
              "voltado a preparar o Estado, a infraestrutura e os ecossistemas para enfrentar os impactos inevitáveis do clima, contemplando obras de engenharia resiliente, macrodrenagem e segurança hídrica rural.",
          },
          {
            nome: "Justiça climática e inclusão social",
            texto:
              "destinado a proteger populações, territórios vulneráveis, povos indígenas e comunidades tradicionais, extrativistas e ribeirinhos, em estrita observância às Salvaguardas Socioambientais.",
          },
          {
            nome: "Governança ambiental e transparência",
            texto:
              "focado na integridade institucional, na prestação de contas, no aprimoramento dos sistemas de monitoramento e nos mecanismos de controle social e fiscal.",
          },
          {
            nome: "Educação ambiental e inovação",
            texto:
              "voltado ao fortalecimento do capital humano, capacitação técnica, pesquisa, desenvolvimento de tecnologias limpas e disseminação de práticas sustentáveis.",
          },
          {
            nome: "Gestão de riscos e proteção civil",
            texto:
              "direcionado à prevenção, alertas, resposta e resiliência frente aos eventos extremos de secas, inundações e desastres.",
          },
        ],
      },
      {
        tipo: "paragrafo",
        texto:
          "Para assegurar rigor científico, auditabilidade e alinhamento às melhores práticas nacionais, o modelo metodológico proposto pelo DEPPO/SEPLAN-AC incorpora os critérios de elegibilidade da Taxonomia Sustentável Brasileira (TSB), estruturando-se em dois níveis de apuração:",
      },
      {
        tipo: "nivel",
        titulo: "Nível 1 – Alocação Macro (Relevância Climática)",
        texto:
          "Realiza a varredura exaustiva na LOA a partir das Funções e Subfunções Orçamentárias, utilizando a relevância climática estabelecida na Taxonomia Sustentável Brasileira, por meio dos Cadernos Setoriais (associados às CNAEs correlatos). As Funções/Subfunções são qualificadas em Relevância Direta (funções institucionais de meio ambiente, agricultura sustentável e defesa civil) e Relevância Potencial (ações transversais em infraestrutura, educação e transporte). Como preceito de rigor fiscal e para evitar distorções inflacionadas, aplica-se a Regra de Ouro da Alocação: despesas com pessoal, encargos sociais e gestão da folha de pagamento são expressamente excluídas da contabilidade do Orçamento Climático.",
      },
      {
        tipo: "nivel",
        titulo:
          "Nível 2 – Classificação Micro (Granularidade e Contribuição Substancial)",
        texto:
          "Desce ao nível de Programa, Projeto e Ação Orçamentária, aplicando o Critério de Contribuição Substancial da TSB. Os gastos dividem-se em:",
        itens: [
          {
            nome: "Gastos Exclusivos (Diretos – 100%)",
            texto:
              "ações cuja finalidade é integralmente climática (ex.: combate a incêndios pelo CBMAC/SEMA, monitoramento por satélite pelo IMAC/SEMA, Pagamento por Serviços Ambientais – PSA).",
          },
          {
            nome: "Gastos Não Exclusivos (Indiretos/Transversais)",
            texto:
              "ações de secretarias setoriais (infraestrutura, habitação, agricultura) que possuem múltiplos objetivos, mas incorporam componentes ou etapas com ganhos climáticos comprovados. Nestes casos, computa-se estritamente o valor financeiro do projeto específico (ex.: reassentamento de famílias retiradas de áreas de risco de alagamento nas cotas críticas do Rio Acre, classificado no eixo de Adaptação).",
          },
        ],
      },
      {
        tipo: "paragrafo",
        texto:
          "A operacionalização da metodologia exige uma governança multinível pautada pela responsabilidade compartilhada e alinhada ao papel regimental de cada órgão, sem sobreposição de atribuições. Sob a coordenação estratégica da SEPLAN e o suporte financeiro da SEFAZ, a arquitetura conta com a curadoria técnica da SEMA e do IMC no enquadramento dos eixos e monitoramento ambiental. Cabe aos órgãos setoriais executores a identificação das ações e a comprovação do nexo causal por meio de documentação técnica. Esse arranjo é articulado pelo Comitê de Governança do Orçamento Climático (CGOC), instituído pelo art. 7º da Lei Estadual nº 4.679/2025, instância colegiada responsável por validar a metodologia, arbitrar divergências, aprovar os relatórios anuais de apuração e fomentar o controle social.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Por meio dessa categorização metodológica, a lente climática permite não apenas a marcação e o rastreio contábil das despesas, mas a realização de análises críticas de consistência de políticas públicas. Ela identifica, por exemplo, eventuais desalinhamentos orçamentários, subsidiando os gestores na realocação de recursos rumo a uma matriz de gastos plenamente coerente com os compromissos climáticos subnacionais e globais (Cepal, 2024). Com essa rigorosa arquitetura metodológica, o Governo do Acre consolida um padrão de governança fiscal que une ciência, planejamento e gestão de excelência.",
      },
    ],
  },
  {
    numero: 6,
    titulo:
      "Do legado da execução à prática da marcação: os programas e as ações com impacto climático",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "A consolidação de um instrumento inovador para aferir o gasto com a lente climática não surge no vazio institucional, é resultado de um legado histórico de políticas públicas e execuções orçamentárias voltadas à sustentabilidade. No caso do Estado do Acre, a trajetória de vanguarda na governança ambiental, marcada pela implementação de programas estruturantes de desenvolvimento sustentável, respeito às salvaguardas socioambientais e cooperação internacional de grande envergadura, foi quem forneceu a base empírica indispensável para a transição em direção a uma contabilidade fiscal climática de alta precisão (Acre, 2025). O desafio central consiste em migrar de um cenário de ações socioambientais descentralizadas para uma rotina institucional de marcação sistemática de programas e ações orçamentárias (SEPLAN-AC, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "O Acre possui um legado de execução fiscal e captação de recursos nacionais e internacionais que posiciona o Estado na vanguarda da agenda climática global. Destacam-se a coordenação e a execução bem-sucedida de iniciativas estruturantes como o Programa de Desenvolvimento Sustentável do Acre Fases I e II (PDSA), financiado pelo Banco Interamericano de Desenvolvimento (BID); o pioneiro Programa REDD+ Early Movers (REM Acre), gerido por meio de cooperação financeira internacional com o banco alemão KfW Development Bank; projetos apoiados pelo Fundo Amazônia, que destina recursos não reembolsáveis para apoiar o estado em iniciativas de combate ao desmatamento, gestão territorial e fortalecimento de cadeias produtivas sustentáveis; o Programa PROSER (Programa de Saneamento Ambiental e Inclusão Socioeconômica do Acre) voltado para o desenvolvimento sustentável, infraestrutura urbana, saneamento e inclusão social em regiões isoladas e vulneráveis, financiado pelo Banco Mundial/BIRD; o PROFISCO (Programa de Modernização da Gestão Fiscal do Estado do Acre) voltado à modernização da administração pública, com foco principal na adaptação do estado às novas regras da reforma tributária e na transformação digital; e mais recentemente o PROISA (Programa de Infraestrutura e Saneamento do Estado do Acre), financiado pelo FONPLATA, direcionado para intervenções viárias estruturantes, projetos de infraestrutura, mobilidade urbana e saneamento no estado.",
      },
      {
        tipo: "paragrafo",
        texto:
          "A eficácia dessa governança e o reconhecimento da capacidade de planejamento do Estado traduziram-se em importantes premiações nacionais, como o primeiro lugar no Prêmio Excelência em Competitividade em 2023, promovido pelo Centro de Liderança Pública (CLP), e a posição de destaque no Concurso Inovação no Setor Público da ENAP na categoria de inovação ambiental. É sobre esse sólido alicerce de gestão que a prática da marcação orçamentária passa a atuar como a ferramenta definitiva de tradução entre o planejamento estratégico de longo prazo e a execução financeira anual contida na Lei Orçamentária Anual (LOA).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Por meio de metodologias avançadas de etiquetagem, alinhadas às diretrizes da Lei Estadual nº 4.679, de 10 de novembro de 2025, cada programa de governo deixa de ser avaliado apenas por sua finalidade setorial clássica e passa a ser escrutinado pelo seu coeficiente exato de impacto climático (OECD, 2021). Isso significa que ações voltadas à assistência técnica rural, por exemplo, são desagregadas para identificar a fração precisa do recurso que financia a transição para práticas agropecuárias de baixa emissão de carbono, diferenciando-a de despesas convencionais.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Além disso, o Estado se destaca na composição de espaços participativos vitais, em âmbito nacional, disseminando boas práticas e aumentando a legitimação de suas políticas. Essa integração entre participação social ativa e planejamento fiscal rigoroso gera ganhos notáveis para a gestão pública.",
      },
      {
        tipo: "paragrafo",
        texto:
          "O Orçamento Climático permite ao Estado do Acre demonstrar, com base em evidências auditáveis e em conformidade com a Taxonomia Sustentável Brasileira, quais programas efetivamente entregam resultados mitigadores ou adaptativos. Isso otimiza a alocação de créditos orçamentários, mitiga riscos fiscais e fortalece monumentalmente a prestação de contas perante organismos de controle, tribunais de contas e financiadores globais (Cepal, 2024). Desse modo, o Orçamento Climático consolida-se não como um apêndice burocrático, mas como o coração operacional da coerência entre as contas públicas, a transparência fiscal e a sustentabilidade no Estado do Acre.",
      },
      {
        tipo: "paragrafo",
        texto:
          "O Orçamento Climático do Estado do Acre é, em sua essência, um pacto de futuro. Ele convoca o Poder Executivo, o Poder Legislativo, os órgãos de controle interno e externo, os organismos de cooperação internacional, a academia e a sociedade civil a caminharem juntos. Mais do que uma inovação metodológica ou um painel de transparência, trata-se de um compromisso ético e intergeracional com a proteção da floresta, a segurança das nossas cidades e a dignidade do povo acreano.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Com a força dessa trajetória histórica e o rigor das ferramentas ora instituídas, o Estado do Acre coloca-se pronto para liderar pelo exemplo, provando que a responsabilidade fiscal e a justiça climática caminham lado a lado na construção de um desenvolvimento verdadeiramente próspero, inclusivo e sustentável.",
      },
    ],
  },
];

export const REFERENCIAS: Referencia[] = [
  {
    corpo:
      "ACRE. Lei Estadual nº 4.679, de novembro de 2025. Dispõe sobre a institucionalização do Orçamento Climático no âmbito do Estado do Acre. Rio Branco, 2025.",
    url: "https://legis.ac.gov.br/detalhar/6600",
  },
  {
    corpo:
      "C40 CITIES. Climate Budgeting Pilot and Global Programme Case Studies. London: C40 Cities Climate Leadership Group, 2024.",
    url: "https://www.c40.org/case-studies/climate-budgeting-pilot/",
  },
  {
    corpo:
      "C40 KNOWLEDGE HUB. Climate budgeting: A step-by-step guide for cities and subnational governments.",
    url: "https://www.c40knowledgehub.org/s/article/Climate-budgeting-A-step-by-step-guide-for-cities?language=en_US",
  },
  {
    corpo:
      "CEPAL (Comissão Econômica para a América Latina e o Caribe). El gasto público vinculado con el cambio climático en América Latina. Santiago: Naciones Unidas, 2024.",
    url: "https://repositorio.cepal.org/server/api/core/bitstreams/a32c7682-c00e-4492-9db0-e1014cb30e83/content",
  },
  {
    corpo:
      "CLIMATE POLICY INITIATIVE (CPI). Finanças Climáticas no Brasil: Desafios de Rastreabilidade e Transparência nos Orçamentos Públicos. Rio de Janeiro: CPI, 2024.",
    url: "https://www.climatepolicyinitiative.org/wp-content/uploads/2023/09/Panorama-de-Financiamento-Climatico-para-Uso-da-Terra-no-Brasil-11Set23.pdf",
  },
  {
    corpo:
      "COMSEFAZ (Comitê Nacional de Secretários de Fazenda, Finanças, Receita e Tributos dos Estados e do Distrito Federal). Estudo defende “orçamentos verdes” para fortalecer resposta de estados e municípios à crise climática. Brasília, junho de 2026.",
    url: "https://comsefaz.org.br/novo/estudo-defende-orcamentos-verdes-para-fortalecer-resposta-de-estados-e-municipios-a-crise-climatica/",
  },
  {
    corpo: "EUROPEAN COMMISSION. The EU Green Deal Investment Plan. Bruxelas, 2020.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:52020DC0021",
  },
  {
    corpo:
      "IPCC (Intergovernmental Panel on Climate Change). Climate Change 2022: Impacts, Adaptation and Vulnerability. Cambridge: Cambridge University Press, 2022.",
    url: "https://www.ipcc.ch/report/ar6/wg2/",
  },
  {
    corpo:
      "IPCC (Intergovernmental Panel on Climate Change). Climate Change 2023: Synthesis Report. Geneva: IPCC, 2023.",
    url: "https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_LongerReport.pdf",
  },
  {
    corpo:
      "MINISTÉRIO DA FAZENDA. Taxonomia Sustentável Brasileira: Diretrizes e Critérios para Classificação de Atividades. Brasília: MF, 2024.",
    url: "https://www.gov.br/fazenda/pt-br/orgaos/spe/taxonomia-sustentavel-brasileira/taxonomia-sustentavel-brasileira.pdf",
  },
  {
    corpo:
      "OECD (Organisation for Economic Co-operation and Development). Green Budgeting and Policy Coherence: Towards a Sustainable Fiscal Framework. Paris: OECD Publishing, 2021.",
    url: "https://www.oecd.org/en/publications/green-budgeting-in-oecd-countries_acf5d047-en/full-report.html",
  },
  {
    corpo:
      "OECD (Organisation for Economic Co-operation and Development). Green Budgeting: Framing Guidelines and Methodological Tools for Policy Makers. Paris: OECD Publishing, 2021.",
    url: "https://infrastructure-toolkit.oecd.org/wp-content/uploads/France_GreenBudgeting.pdf",
  },
  {
    corpo:
      "OECD (Organisation for Economic Co-operation and Development). Anti-Corruption and Integrity in Climate Initiatives: A Framework for Public Accountability. Paris: OECD Publishing, 2026.",
    url: "https://www.oecd.org/en/publications/anti-corruption-and-integrity-outlook-2026_16708b78-en/full-report/component-14.html",
  },
  {
    corpo:
      "SEPLAN-AC (Secretaria de Estado de Planejamento do Acre). Proposta de Metodologia de Marcação e Identificação de Gastos Climáticos no PPA. Rio Branco: SEPLAN, 2025.",
  },
  {
    corpo:
      "SIQUEIRA, CARLOS EDUARDO; VEIGA, EDIR. Governança Climática e o Executivo Estadual Amazônico. São Paulo, 2025.",
    url: "https://www.scielo.br/j/asoc/a/RqV8fvYTngqsPXS4bdRG5hH/?format=pdf&lang=pt",
  },
  {
    corpo:
      "TRANSPARÊNCIA INTERNACIONAL – BRASIL. Índice de Transparência e Governança Pública: Governança Climática nos Estados Brasileiros. São Paulo: TI Brasil, 2025.",
    url: "https://docs.transparenciainternacional.org.br/biblioteca/retrospectiva-brasil-2025.pdf",
  },
  {
    corpo:
      "TRANSPARÊNCIA INTERNACIONAL – BRASIL. Índice de Democracia Ambiental nos Estados da Amazônia Legal: Acesso à Informação e Participação Social. São Paulo: TI Brasil, 2026.",
    url: "https://docs.transparenciainternacional.org.br/biblioteca/nota-tecnica-indice-de-democracia-ambiental-2026.pdf",
  },
  {
    corpo:
      "UN (United Nations). Transforming our world: the 2030 Agenda for Sustainable Development. Resolution adopted by the General Assembly on 25 September 2015. A/RES/70/1. New York: UN, 2015.",
    url: "https://docs.un.org/en/A/RES/70/1",
  },
  {
    corpo:
      "UNFCCC (United Nations Framework Convention on Climate Change). Subnational and Local Governments Climate Action: Reporting, Tracking, and Global Goal on Adaptation. Bonn: UNFCCC Secretariat, 2021.",
    url: "https://treaties.un.org/pages/ViewDetailsIII.aspx?src=TREATY&mtdsg_no=XXVII-7&chapter=27&Temp=mtdsg3&clang=_en",
  },
  {
    corpo:
      "WORLD BANK. Annual Report & Technical Notes on Public Finance and Ecosystem Services. Washington, D.C.: World Bank, 2023.",
    url: "https://thedocs.worldbank.org/en/doc/3d1885e1e767f84aa7a5ceecec95e8ab-0060072025/original/Financial-Management-Annual-Report-2023-Public-Version.pdf",
  },
];
