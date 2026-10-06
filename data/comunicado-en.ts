/**
 * English edition of the Climate Budget brief, translated from
 * `data/comunicado.ts` (the PT source of record). Feeds the same LaTeX
 * generator (`scripts/gerar-pdf-comunicado.ts`), which renders it to
 * `public/climate-budget-brief-en.pdf`.
 */
import type { Referencia, Secao } from "@/data/comunicado";

export const PDF_COMUNICADO_EN = "/climate-budget-brief-en.pdf";

export const COMUNICADO_EN = {
  titulo: "Climate Budget of the State of Acre",
  kicker: "Brief · 2026",
  ano: 2026,
  subtitulo:
    "State of Acre · State Secretariat for Planning · Department of Studies and Budget Planning (DEPPO)",
} as const;

export const SECOES_EN: Secao[] = [
  {
    numero: 1,
    titulo: "Public budgets in the face of climate change",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "The intensification of extreme climate events — experienced ever more often as prolonged droughts, severe floods and instability in rainfall regimes — has ceased to be a scientific projection and has consolidated into a structural reality that directly affects macroeconomic stability, food security and the social cohesion of territories (IPCC, 2023). In this scenario, traditional management tools have proven obsolete: historically conceived as a neutral instrument for the accounting allocation of revenue and expenditure, the conventional public budget became blind to these socio-environmental externalities by decoupling fiscal accounting from ecological risk management and territorial resilience (OECD, 2021).",
      },
      {
        tipo: "paragrafo",
        texto:
          "In response to this gap, the global and subnational landscape has witnessed a profound paradigm shift: the emergence of green and climate budgets. On the international plane, multilateral organizations and blocs such as the European Union lead climate mainstreaming movements, tying significant shares of their multiannual budgets to stringent decarbonization and adaptation targets (European Commission, 2020).",
      },
      {
        tipo: "paragrafo",
        texto:
          "In the same direction, high-impact cooperation networks such as C40 Cities have led a revolution in public governance by institutionalizing Climate Budgeting in global metropolises and strategic capitals (including Brazilian pioneers such as the municipality of Rio de Janeiro and other cities in the Southeast). This model turns the budget into a dynamic traceability system, linking decarbonization targets and risk management directly to multiannual and annual financial planning (C40 Cities, 2024; C40 Knowledge Hub, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "In Brazil, the debate has evolved from a federal focus to an urgent subnational agenda. As analyses of public policy networks and recent regulatory frameworks point out, states and municipalities are on the front line of socio-environmental disasters, bearing a disproportionate fiscal cost, highly concentrated on post-disaster recovery (Siqueira and Veiga, 2025; Cepal, 2023). Comsefaz and Ipea corroborate this, noting that subnational governments still face strong asymmetries, often acting in a predominantly reactive manner, which generates disproportionate fiscal costs from disasters and recovery, to the detriment of a structured preventive matrix (Comsefaz, 2026).",
      },
      {
        tipo: "paragrafo",
        texto:
          "The real dimension of this territorial vulnerability and its fiscal cost in Acre has empirical confirmation. According to recent surveys compiled in the study Panorama dos Desastres no Brasil – 2013 a 2025 [Overview of Disasters in Brazil – 2013 to 2025], conducted by the National Confederation of Municipalities (CNM, 2025), Acre accumulated 4,493,677 people affected by disasters between 2013 and 2025, recording a dramatic history of impacts caused by severe floods and extreme droughts within a single annual cycle. In the period, the state recorded 17 deaths, 46,635 people left homeless and 161,891 displaced, with accumulated economic and social losses exceeding R$ 3.72 billion — an amount that breaks down into R$ 1.63 billion in housing losses, R$ 1.39 billion in private damages (such as crop destruction and service interruptions) and R$ 692.5 million in direct damage to public infrastructure.",
      },
      {
        tipo: "paragrafo",
        texto:
          "It is against this scenario of challenges that Acre stands out as a pioneer on the climate agenda. The historical recognition of its socio-environmental vocation and of its robust climate and forest governance architecture rests on precursor milestones, such as the Payment for Environmental Services policy/SISA (Law 2,308/2010), which enabled the pioneering REDD+ Early Movers (REM Acre) program. More than a response to the current situation, it is precisely to staunch this recurring fiscal liability and to overcome the strictly reactive post-disaster logic that the State consolidates its vanguard by institutionalizing its Climate Budget through State Law No. 4,679/2025.",
      },
      {
        tipo: "paragrafo",
        texto:
          "This fiscal planning tool represents not merely an accounting exercise, but the consecration of the climate lens as the integrating axis between the public purse and the commitments to mitigation, adaptation and resilience. By aligning the budget cycle with the guidelines of the Brazilian Sustainable Taxonomy (TSB) and the Sustainable Development Goals (SDGs), the State of Acre demonstrates that fiscal responsibility and environmental sustainability are inseparable (Ministério da Fazenda, 2024).",
      },
      {
        tipo: "paragrafo",
        texto:
          "The State of Acre thus assumes the irrevocable commitment to overcome the invisibility of socio-environmental spending, ensuring that every public resource allocated effectively serves to protect sociobiodiversity and to shield Acre's future from the uncertainties of the climate.",
      },
    ],
  },
  {
    numero: 2,
    titulo: "Transparency and sustainability in budget management",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "The modernization of contemporary public administration demands overcoming traditional accountability models based strictly on formal legality. In Brazil, fiscal transparency advances by transcending the consolidated historical normative frameworks — such as the Fiscal Responsibility Law (Complementary Law No. 101/2000) and the Access to Information Law (Law No. 12,527/2011) — and begins to incorporate the socio-environmental and climate dimension as a structuring axis of the public purse (Transparência Internacional Brasil, 2023). In the context of the State of Acre, budgetary transparency ceases to be a mere bureaucratic requirement and becomes an active instrument of climate accountability and evidence-based governance (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "As recent diagnostics by organizations specialized in public integrity point out — such as the assessments on transparency and climate governance conducted by Transparência Internacional – Brasil — subnational governments have historically suffered from serious informational asymmetries, concentrating predominantly on insufficient levels of proactive disclosure of socio-environmental and budgetary data (Transparência Internacional Brasil, 2025; 2026). In this regard, the organization warns that “the absence of open, disaggregated databases and traceability dashboards creates a dangerous gap: the dissociation between the political discourse of sustainability and the actual financial execution in the territories.”",
      },
      {
        tipo: "paragrafo",
        texto:
          "It is precisely to break with this pattern that the openness and meticulous traceability of green public spending play a fundamental strategic role in the Climate Budget of Acre: the transparency of public spending through the climate lens. In an increasingly demanding global and subnational market regarding the integrity of climate policies, the detailed publication of budget lines tied to mitigation and adaptation targets subjects public management to a non-negotiable scrutiny, ensuring that every cent allocated finds direct support in budgetary practice (Climate Policy Initiative – CPI, 2024; OECD, 2022).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Moreover, this high-technical-rigor transparency acts as an attraction for international investments, concessional climate financing and results-based funding, as in partnerships with multilateral development banks and regulated carbon markets (World Bank, 2023). Institutional investors and global funds demand robust standards of monitoring, reporting and verification integrated into public accounts, ensuring that external capital is channeled with legal certainty and proven effectiveness.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Finally, by institutionalizing open data dashboards and accessible channels for monitoring the Climate Budget, the State of Acre meets the main recommendations of open governance and broadens the exercise of social control. Democratic oversight of the application of public resources gains real capillarity, overcoming the structural barriers to participation identified in the Legal Amazon and turning citizens into co-managers of the State's fiscal and climate sustainability (Transparência Internacional Brasil, 2026).",
      },
    ],
  },
  {
    numero: 3,
    titulo: "Budgetary traceability and the contribution to the global SDG targets",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "The effectiveness of public policies aimed at confronting the contemporary climate crisis depends intrinsically on the capacity to translate abstract international commitments into measurable, budget-auditable local targets. In this sense, the United Nations 2030 Agenda and its Sustainable Development Goals (SDGs) have ceased to be mere rhetorical guidelines for sustainability and have consolidated as the main global framework for monitoring public policies (UN, 2015). In Brazil, practical experiences of alignment between Multiyear Plans (PPA) and the SDGs have been adopted by state governments and capitals that use the 2030 Agenda to guide public investment in energy transition, sanitation and biome protection. Within the State of Acre, the consolidation of the Climate Budget establishes a direct methodological bridge between the fiscal planning cycle and the realization of these global targets — with emphasis on Climate Action (SDG 13), Life on Land (SDG 15) and the effective implementation of Partnerships for the Goals (SDG 17).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Budgetary traceability acts as the backbone of this integration. Historically, government financial execution systems operated in silos, making it difficult to identify precisely how much and where the public purse actually invested in ecosystem-based adaptation, forest conservation and emissions mitigation. As the Economic Commission for Latin America and the Caribbean points out in diagnostics on financing for development, the absence of structured tracking mechanisms in most countries and subnational governments limits transparency and hinders the measurement of the real impact of resources against global climate commitments (Cepal, 2024). By introducing specific budgetary markers and expenditure labeling methodologies linked to the Brazilian Sustainable Taxonomy, the Government of Acre breaks with this opacity (Ministério da Fazenda, 2024). Every program, action and target of the multiyear plan becomes subject to scrutiny from the standpoint of its real contribution to the territory's climate resilience.",
      },
      {
        tipo: "paragrafo",
        texto:
          "This granularity in the traceability of green public spending yields a double institutional dividend. First, it allows the State to render accounts in a transparent and timely manner to international and national climate forums, proving compliance with commitments made under global agreements — such as the reporting and tracking guidelines established by the UNFCCC for governments under the Paris Agreement and the decarbonization targets (UNFCCC, 2021). Second, it provides public managers and oversight bodies with an analytical tool of the highest precision for evidence-based decision-making, optimizing the allocation of scarce resources to priority bottlenecks of socio-environmental vulnerability.",
      },
      {
        tipo: "paragrafo",
        texto:
          "In this way, the Climate Budget of Acre elevates subnational fiscal management to a level of international excellence. By demonstrating, through auditable data, how the state budget directly finances the conservation of sociobiodiversity and the transition to a low-carbon economy, the State not only fulfills its federative role but acts as a living laboratory at the vanguard of building public policies capable of responding, with financial effectiveness and scientific rigor, to the urgent challenges we already face.",
      },
    ],
  },
  {
    numero: 4,
    titulo:
      "Identifying public spending focused on people, biodiversity and ecosystem services",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "The effectiveness of any subnational climate finance policy lies in the capacity to redirect the flow of public resources to its most essential destination: the protection of human life, the integrity of biodiversity and the preservation of ecosystem services. Historically, traditional public budgets operated under a fragmented sectoral logic, in which investments in environmental conservation and social protection figured as peripheral externalities or expenditures of a strictly compensatory nature. In the Climate Budget model institutionalized by the State of Acre, this logic is inverted, placing people, ecosystems and sociobiodiversity at the epicenter of fiscal planning (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Identifying and classifying green public spending requires sophisticated budgetary marking methodologies that make it possible to isolate and measure the direct impact of government actions on community resilience and climate stability. This fiscal maturity of Acre is supported by its track record of responsibility in managing partnerships and financing large-scale public programs with multilateral development banks, such as the Inter-American Development Bank (IDB), the World Bank (IBRD) and Fonplata. By attracting and managing these robust international investments, the State has improved transparency, accountability and efficiency in the application of resources in favor of sustainable development.",
      },
      {
        tipo: "paragrafo",
        texto:
          "As international guidelines on finance for sustainable development point out, ecosystem-based adaptation and the conservation of tropical forests are not merely isolated environmental expenditures, but structural investments in the territory's macroeconomy and in human security (IPCC, 2022; World Bank, 2023). In Acre, this approach translates into the identification of budget lines aimed at strengthening sustainable production chains, the territorial and environmental management of indigenous lands and conservation units, command and control, and the guarantee of well-founded socio-environmental safeguards (SEPLAN-AC, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "The focus on people implies recognizing that the impacts of climate change are not neutral, since they fall disproportionately on traditional populations, family farmers, indigenous peoples and vulnerable urban communities. By tracking and directing public spending toward reducing these vulnerabilities — through food security, access to drinking water, urban green infrastructure and the bioeconomy — the Climate Budget ensures that the climate transition is fair and inclusive (Cepal, 2024).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Simultaneously, the orientation toward biodiversity and ecosystem services — such as the regulation of rainfall regimes, carbon sequestration and storage, and the protection of watersheds — lends scientific grounding to resource allocation. Every budget program marked under this guideline is evaluated by its capacity to keep the forest standing and functional. Thus, by improving the marking of public spending, the Government also strengthens its credibility in applying the investments raised with the Multilateral Development Banks, demonstrating that public investment in sustainability is not a fiscal cost. On the contrary, it consolidates itself as the main asset guaranteeing prosperity, administrative efficiency and socioeconomic stability for its partners, funders and for present and future generations of Acre.",
      },
    ],
  },
  {
    numero: 5,
    titulo:
      "The climate lens as the benchmark for the methodology and the climate axes",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "Operationalizing a Climate Budget requires overcoming conventional accounting methods through methodological innovations capable of intervening directly in the architecture of public spending. The central concept enabling this transformation is the climate lens: a cross-cutting, systematic analytical filter applied over the budget cycle — from the conception of the Multiyear Plan (PPA) and the Budget Guidelines Law (LDO) to the execution of the Annual Budget Law (LOA) — making it possible to assess how each government action interacts with the territory's decarbonization and resilience targets (OECD, 2021; World Bank, 2023). In the State of Acre, under the technical coordination of the State Secretariat for Planning (SEPLAN) and its Department of Studies and Budget Planning (DEPPO), the application of this methodological lens turns fiscal planning into an instrument of strategic intelligence, ensuring that the budget is no longer myopic to socio-environmental variables (Acre, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "The adoption of the climate lens is methodologically structured around two sequential and integrated classification levels — Macro Allocation and Micro Classification — anchored in the seven climate axes defined by State Law No. 4,679, of November 10, 2025:",
      },
      {
        tipo: "lista",
        itens: [
          {
            nome: "Sustainable development and bioeconomy",
            texto:
              "focused on valuing natural resources and fostering production chains with a sustainable base, on the transition to a low-carbon economy and on strengthening sociobiodiversity assets.",
          },
          {
            nome: "Climate change mitigation",
            texto:
              "directed at actions aimed at the net reduction of greenhouse gas (GHG) emissions, control of and combat against deforestation and fires, energy transition and the increase of carbon stocks.",
          },
          {
            nome: "Climate adaptation",
            texto:
              "aimed at preparing the State, infrastructure and ecosystems to face the inevitable impacts of the climate, including resilient engineering works, macro-drainage and rural water security.",
          },
          {
            nome: "Climate justice and social inclusion",
            texto:
              "intended to protect populations, vulnerable territories, indigenous peoples and traditional, extractivist and riverside communities, in strict observance of the Socio-environmental Safeguards.",
          },
          {
            nome: "Environmental governance and transparency",
            texto:
              "focused on institutional integrity, accountability, the improvement of monitoring systems and the mechanisms of social and fiscal control.",
          },
          {
            nome: "Environmental education and innovation",
            texto:
              "directed at strengthening human capital, technical training, research, the development of clean technologies and the dissemination of sustainable practices.",
          },
          {
            nome: "Risk management and civil protection",
            texto:
              "directed at prevention, early warning, response and resilience in the face of extreme events such as droughts, floods and disasters.",
          },
        ],
      },
      {
        tipo: "paragrafo",
        texto:
          "To ensure scientific rigor, auditability and alignment with the best national practices, the methodological model proposed by DEPPO/SEPLAN-AC incorporates the eligibility criteria of the Brazilian Sustainable Taxonomy (TSB), structured in two levels of assessment:",
      },
      {
        tipo: "nivel",
        titulo: "Level 1 – Macro Allocation (Climate Relevance)",
        texto:
          "Performs an exhaustive scan of the LOA based on Budget Functions and Subfunctions, using the climate relevance established in the Brazilian Sustainable Taxonomy through the Sectoral Notebooks (associated with the corresponding CNAEs). Functions/Subfunctions are qualified as Direct Relevance (institutional functions of environment, sustainable agriculture and civil defense) and Potential Relevance (cross-cutting actions in infrastructure, education and transport). As a precept of fiscal rigor and to avoid inflated distortions, the Golden Rule of Allocation applies: expenditures on personnel, social charges and payroll management are expressly excluded from the Climate Budget accounting.",
      },
      {
        tipo: "nivel",
        titulo: "Level 2 – Micro Classification (Granularity and Substantial Contribution)",
        texto: "Descends to the level of Program, Project and Budget Action, applying the TSB's Substantial Contribution Criterion. Spending is divided into:",
        itens: [
          {
            nome: "Exclusive Spending (Direct – 100%)",
            texto:
              "actions whose purpose is entirely climatic (e.g., firefighting by CBMAC/SEMA, satellite monitoring by IMAC/SEMA, Payment for Environmental Services – PSA).",
          },
          {
            nome: "Non-exclusive Spending (Indirect/Cross-cutting)",
            texto:
              "actions by sectoral secretariats (infrastructure, housing, agriculture) that have multiple objectives but incorporate components or stages with proven climate gains. In these cases, strictly the financial value of the specific project is computed (e.g., the resettlement of families removed from areas at risk of flooding at the critical levels of the Acre River, classified under the Adaptation axis).",
          },
        ],
      },
      {
        tipo: "paragrafo",
        texto:
          "Operationalizing the methodology requires multilevel governance guided by shared responsibility and aligned with the regimental role of each body, with no overlapping of duties. Under the strategic coordination of SEPLAN and the financial support of SEFAZ, the architecture counts on the technical curation of SEMA and the IMC in framing the axes and environmental monitoring. The sectoral executing bodies are responsible for identifying actions and proving the causal link through technical documentation. This arrangement is articulated by the Climate Budget Governance Committee (CGOC), established by art. 7 of State Law No. 4,679/2025, a collegiate body responsible for validating the methodology, arbitrating divergences, approving the annual assessment reports and fostering social control.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Through this methodological categorization, the climate lens enables not only the marking and accounting traceability of expenditures, but the performance of critical analyses of public policy consistency. It identifies, for example, possible budgetary misalignments, subsidizing managers in the reallocation of resources toward a spending matrix fully consistent with the subnational and global climate commitments (Cepal, 2024). With this rigorous methodological architecture, the Government of Acre consolidates a standard of fiscal governance that unites science, planning and management excellence.",
      },
    ],
  },
  {
    numero: 6,
    titulo:
      "From the legacy of execution to the practice of marking: programs and actions with climate impact",
    blocos: [
      {
        tipo: "paragrafo",
        texto:
          "The consolidation of an innovative instrument for assessing spending through the climate lens does not arise in an institutional vacuum; it is the result of a historical legacy of public policies and budget executions aimed at sustainability. In the case of the State of Acre, the trajectory of vanguard in environmental governance — marked by the implementation of structuring sustainable development programs, respect for socio-environmental safeguards and large-scale international cooperation — provided the indispensable empirical basis for the transition toward high-precision climate fiscal accounting (Acre, 2025). The central challenge consists of migrating from a scenario of decentralized socio-environmental actions to an institutional routine of systematic marking of programs and budget actions (SEPLAN-AC, 2025).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Acre has a legacy of fiscal execution and fundraising, both national and international, that places the State at the vanguard of the global climate agenda. Highlights include the coordination and successful execution of structuring initiatives such as the Acre Sustainable Development Program Phases I and II (PDSA), financed by the Inter-American Development Bank (IDB); the pioneering REDD+ Early Movers program (REM Acre), managed through international financial cooperation with the German bank KfW Development Bank; projects supported by the Amazon Fund, which allocates non-reimbursable resources to support the state in initiatives to combat deforestation, territorial management and the strengthening of sustainable production chains; the PROSER program (Acre Environmental Sanitation and Socioeconomic Inclusion Program), focused on sustainable development, urban infrastructure, sanitation and social inclusion in isolated and vulnerable regions, financed by the World Bank/IBRD; PROFISCO (Acre Fiscal Management Modernization Program), aimed at modernizing public administration, with a main focus on adapting the state to the new rules of the tax reform and on digital transformation; and more recently PROISA (Acre Infrastructure and Sanitation Program), financed by FONPLATA, directed at structuring road interventions, infrastructure projects, urban mobility and sanitation in the state.",
      },
      {
        tipo: "paragrafo",
        texto:
          "The effectiveness of this governance and the recognition of the State's planning capacity translated into important national awards, such as first place in the 2023 Excellence in Competitiveness Award, promoted by the Center for Public Leadership (CLP), and a prominent position in the ENAP Public Sector Innovation Competition in the environmental innovation category. It is on this solid management foundation that the practice of budgetary marking becomes the definitive tool for translating between long-term strategic planning and the annual financial execution contained in the Annual Budget Law (LOA).",
      },
      {
        tipo: "paragrafo",
        texto:
          "Through advanced labeling methodologies, aligned with the guidelines of State Law No. 4,679, of November 10, 2025, each government program ceases to be evaluated only by its classic sectoral purpose and comes to be scrutinized for its exact coefficient of climate impact (OECD, 2021). This means that actions aimed at rural technical assistance, for example, are disaggregated to identify the precise fraction of the resource that finances the transition to low-carbon agricultural practices, distinguishing it from conventional expenditures.",
      },
      {
        tipo: "paragrafo",
        texto:
          "In addition, the State stands out in building vital participatory spaces at the national level, disseminating good practices and increasing the legitimacy of its policies. This integration between active social participation and rigorous fiscal planning yields notable gains for public management.",
      },
      {
        tipo: "paragrafo",
        texto:
          "The Climate Budget allows the State of Acre to demonstrate, based on auditable evidence and in conformity with the Brazilian Sustainable Taxonomy, which programs effectively deliver mitigating or adaptive results. This optimizes the allocation of budget credits, mitigates fiscal risks and greatly strengthens accountability before oversight bodies, courts of accounts and global funders (Cepal, 2024). In this way, the Climate Budget consolidates itself not as a bureaucratic appendix, but as the operational heart of the coherence between public accounts, fiscal transparency and sustainability in the State of Acre.",
      },
      {
        tipo: "paragrafo",
        texto:
          "The Climate Budget of the State of Acre is, in its essence, a pact for the future. It summons the Executive, the Legislature, the internal and external oversight bodies, international cooperation organizations, academia and civil society to walk together. More than a methodological innovation or a transparency dashboard, it is an ethical and intergenerational commitment to the protection of the forest, the safety of our cities and the dignity of the people of Acre.",
      },
      {
        tipo: "paragrafo",
        texto:
          "With the strength of this historical trajectory and the rigor of the tools now instituted, the State of Acre stands ready to lead by example, proving that fiscal responsibility and climate justice walk side by side in building a truly prosperous, inclusive and sustainable development.",
      },
    ],
  },
];

export const REFERENCIAS_EN: Referencia[] = [
  {
    corpo:
      "ACRE. State Law No. 4,679, of November 2025. Provides for the institutionalization of the Climate Budget within the State of Acre. Rio Branco, 2025.",
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
      "CEPAL (Economic Commission for Latin America and the Caribbean). Public spending linked to climate change in Latin America. Santiago: United Nations, 2024.",
    url: "https://repositorio.cepal.org/server/api/core/bitstreams/a32c7682-c00e-4492-9db0-e1014cb30e83/content",
  },
  {
    corpo:
      "CLIMATE POLICY INITIATIVE (CPI). Climate Finance in Brazil: Challenges of Traceability and Transparency in Public Budgets. Rio de Janeiro: CPI, 2024.",
    url: "https://www.climatepolicyinitiative.org/wp-content/uploads/2023/09/Panorama-de-Financiamento-Climatico-para-Uso-da-Terra-no-Brasil-11Set23.pdf",
  },
  {
    corpo:
      "COMSEFAZ (National Committee of State Secretaries of Finance, Revenue and Treasury). Study advocates “green budgets” to strengthen the response of states and municipalities to the climate crisis. Brasília, June 2026.",
    url: "https://comsefaz.org.br/novo/estudo-defende-orcamentos-verdes-para-fortalecer-resposta-de-estados-e-municipios-a-crise-climatica/",
  },
  {
    corpo: "EUROPEAN COMMISSION. The EU Green Deal Investment Plan. Brussels, 2020.",
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
      "MINISTRY OF FINANCE. Brazilian Sustainable Taxonomy: Guidelines and Criteria for the Classification of Activities. Brasília: MF, 2024.",
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
      "SEPLAN-AC (State Secretariat for Planning of Acre). Proposed Methodology for Marking and Identifying Climate Expenditures in the PPA. Rio Branco: SEPLAN, 2025.",
  },
  {
    corpo:
      "SIQUEIRA, CARLOS EDUARDO; VEIGA, EDIR. Climate Governance and the Amazonian State Executive. São Paulo, 2025.",
    url: "https://www.scielo.br/j/asoc/a/RqV8fvYTngqsPXS4bdRG5hH/?format=pdf&lang=pt",
  },
  {
    corpo:
      "TRANSPARÊNCIA INTERNACIONAL – BRASIL. Transparency and Governance Index: Climate Governance in Brazilian States. São Paulo: TI Brasil, 2025.",
    url: "https://docs.transparenciainternacional.org.br/biblioteca/retrospectiva-brasil-2025.pdf",
  },
  {
    corpo:
      "TRANSPARÊNCIA INTERNACIONAL – BRASIL. Environmental Democracy Index in the States of the Legal Amazon: Access to Information and Social Participation. São Paulo: TI Brasil, 2026.",
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
