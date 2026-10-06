/**
 * Tradução em inglês dos títulos dos ODS e do texto dos indicadores,
 * chaveada pelo número do ODS e pelo código do indicador ("1.5.3", "C15.1.c").
 * O status continua derivado do texto em português em `data/ods.ts`; aqui os
 * marcadores "(UNDER DEVELOPMENT)" e "(NO DATA)" apenas ecoam aquele status.
 */
export const ODS_TITULOS_EN: Record<number, string> = {
  1: "No poverty",
  2: "Zero hunger and sustainable agriculture",
  3: "Good health and well-being",
  4: "Quality education",
  5: "Gender equality",
  6: "Clean water and sanitation",
  7: "Affordable and clean energy",
  8: "Decent work and economic growth",
  9: "Industry, innovation and infrastructure",
  10: "Reduced inequalities",
  11: "Sustainable cities and communities",
  12: "Responsible consumption and production",
  13: "Climate action",
  14: "Life below water",
  15: "Life on land",
  16: "Peace, justice and strong institutions",
  17: "Partnerships for the goals",
  18: "Ethnic-racial equality",
};

export const INDICADORES_ODS_EN: Record<string, string> = {
  // ODS 1
  "1.5.3":
    "Number of countries that have adopted and implemented national disaster risk reduction strategies in line with the Sendai Framework for Disaster Risk Reduction 2015–2030",
  "1.5.4":
    "Proportion of local governments that adopt and implement local disaster risk reduction strategies in line with national disaster risk reduction strategies",

  // ODS 2
  "2.4.1": "Proportion of agricultural area under productive and sustainable agriculture",

  // ODS 3
  "3.9.1": "Mortality rate attributed to ambient (outdoor and household) air pollution",
  "3.9.2":
    "Mortality rate attributed to unsafe water, unsafe sanitation and lack of hygiene",
  "3.9.3": "Mortality rate attributed to unintentional poisoning",

  // ODS 4
  "4.7.1":
    "Extent to which (i) global citizenship education and (ii) education for sustainable development are integrated in (a) national education policies; (b) curricula; (c) teacher education; and (d) student assessment (UNDER DEVELOPMENT)",
  "4.a.1":
    "Proportion of schools offering access to: (a) electricity; (b) the internet for pedagogical purposes; (c) computers for pedagogical purposes; (d) adapted infrastructure and materials for students with disabilities; (e) basic drinking water; (f) single-sex basic sanitation facilities; and (g) basic handwashing facilities (as per the WASH indicator definitions)",

  // ODS 5
  "5.a.2":
    "Proportion of countries where the legal framework (including customary law) guarantees women's equal rights to land ownership and/or control (NO DATA)",

  // ODS 6
  "6.1.1": "Proportion of population using safely managed drinking water services",
  "6.2.1":
    "Proportion of population using (a) safely managed sanitation services and (b) a handwashing facility with soap and water",
  "6.3.1": "Proportion of domestic and industrial wastewater flows safely treated",
  "6.3.2": "Proportion of bodies of water with good ambient water quality",
  "6.4.1": "Change in water-use efficiency over time",
  "6.4.2":
    "Level of water stress: freshwater withdrawal as a proportion of available freshwater resources",
  "6.5.1": "Degree of integrated water resources management implementation (0–100)",
  "6.5.2":
    "Proportion of transboundary basin area covered by an operational arrangement for water cooperation",
  "6.6.1": "Change in the extent of water-related ecosystems over time",
  "6.a.1":
    "Amount of water- and sanitation-related official development assistance that is part of a government-coordinated spending plan",
  "6.b.1": "Participation of local communities in water and sanitation management",

  // ODS 7
  "7.1.1": "Proportion of population with access to electricity",
  "7.1.2": "Proportion of population with primary access to clean fuels and technologies",
  "7.2.1": "Share of renewable energy in the internal energy supply",
  "7.a.1":
    "International financial flows to developing countries in support of clean energy research and development and renewable energy production, including in hybrid systems (NO DATA)",
  "7.b.1":
    "Installed renewable energy-generating capacity in developing countries (in watts per capita)",

  // ODS 8
  "8.9.1": "Tourism as a proportion of GDP and its growth rate (NO DATA)",
  "8.9.2": "People employed in the tourism sector (NO DATA)",

  // ODS 9
  "9.1.1":
    "Proportion of rural residents living within 2 km of an all-season passable road (NO DATA)",
  "9.4.1": "CO2 emissions relative to GDP",

  // ODS 10
  "10.1.1":
    "Growth rate of household expenditure or income per capita among the bottom 40% of the population and the total population",
  "10.2.1":
    "Proportion of people living below 50% of the median income, by sex, age and persons with disabilities",
  "10.3.1":
    "Proportion of the population reporting having personally felt discriminated against or harassed within the previous 12 months on grounds prohibited under international human rights law (NO DATA)",
  "10.4.1":
    "Proportion of remuneration in GDP, including wages and social protection transfers",

  // ODS 11
  "11.3.1": "Ratio of land consumption rate to population growth rate (NO DATA)",
  "11.4.1":
    "Total per capita expenditure (public and private) on the preservation, protection and conservation of all cultural and natural heritage, by type of heritage (cultural, natural, mixed and World Heritage Centre designation), level of government (national, regional and local), type of expenditure (operating/investment) and type of private funding (donations in kind, private non-profit and sponsorships)",
  "11.5.1":
    "Number of deaths, missing persons and persons directly affected by disasters per 100,000 population",
  "11.5.2":
    "Direct economic losses in relation to GDP, including damage caused by disasters to critical infrastructure and disruptions to basic services",
  "11.6.1":
    "Proportion of municipal solid waste collected and managed in controlled facilities out of total municipal waste generated, by cities",
  "11.6.2":
    "Annual mean level of inhalable particles (e.g. smaller than 2.5 µm and 10 µm in diameter) in cities (population-weighted)",
  "11.a.1":
    "Number of countries that have national urban policies or regional development plans that (a) respond to population dynamics; (b) ensure balanced territorial development; and (c) have fiscal responsibility",
  "11.b.1":
    "Number of countries that adopt and implement national disaster risk reduction strategies in line with the Sendai Framework for Disaster Risk Reduction 2015–2030",
  "11.b.2":
    "Proportion of local governments that adopt and implement local disaster risk reduction strategies in line with national disaster risk reduction strategies",

  // ODS 12
  "12.1.1":
    "Number of countries that incorporate sustainable consumption and production into national action plans or as a priority or target in national policies",
  "12.4.1":
    "Number of Parties to international multilateral environmental agreements on hazardous waste and other chemicals that meet their commitments and obligations in transmitting information as required by each relevant agreement",
  "12.4.2":
    "Hazardous waste generated per capita and proportion of hazardous waste treated, by type of treatment (NO DATA)",
  "12.5.1": "National recycling rate, in tons of material recycled",
  "12.6.1": "Number of companies publishing sustainability reports",
  "12.7.1":
    "Degree of implementation of policies and action plans on sustainable public procurement (UNDER DEVELOPMENT)",
  "12.8.1":
    "Extent to which (i) global citizenship education and (ii) education for sustainable development are integrated in (a) national education policies; (b) curricula; (c) teacher education; and (d) student assessment (NO DATA)",
  "12.a.1":
    "Installed renewable energy-generating capacity in developing countries (in watts per capita)",
  "12.b.1":
    "Application of standardized accounting tools to monitor the economic and environmental aspects of tourism sustainability (NO DATA)",
  "12.c.1": "Amount of fossil-fuel subsidies per unit of GDP (production and consumption) (NO DATA)",

  // ODS 13
  "13.1.1":
    "Number of deaths, missing persons and persons directly affected by disasters per 100,000 population",
  "13.1.2":
    "Number of countries that adopt and implement national disaster risk reduction strategies in line with the Sendai Framework for Disaster Risk Reduction 2015–2030",
  "13.1.3":
    "Proportion of local governments that adopt and implement local disaster risk reduction strategies in line with national disaster risk reduction strategies",
  "13.2.1":
    "Number of countries with Nationally Determined Contributions, long-term strategies, national adaptation plans, and strategies as reported in national communications and adaptation communications",
  "13.2.2": "Total greenhouse gas emissions per year",
  "13.3.1":
    "Extent to which (i) global citizenship education and (ii) education for sustainable development are integrated in (a) national education policies; (b) curricula; (c) teacher education; and (d) student assessment (NO DATA)",

  // ODS 14
  "14.7.1":
    "Sustainable fisheries as a proportion of GDP in small island developing states, least developed countries and all countries (NO DATA)",

  // ODS 15
  "15.1.1": "Forest area as a proportion of total land area",
  "15.1.2":
    "Proportion of important sites for terrestrial and freshwater biodiversity that are covered by protected areas, by ecosystem type",
  "C15.1.c": "Coverage of protected terrestrial areas in relation to total terrestrial area",
  "15.2.1": "Progress towards sustainable forest management",
  "15.3.1": "Proportion of the territory with degraded land",
  "15.4.1": "Coverage by protected areas of important sites for mountain biodiversity",
  "15.4.2":
    "(a) Vegetation cover index in mountain regions; and (b) Proportion of degraded land in mountain regions",
  "15.5.1": "Red List Index",
  "15.6.1":
    "Number of countries that have adopted legislative, administrative and policy frameworks to ensure the fair and equitable sharing of benefits",
  "15.7.1": "Proportion of traded wildlife that was poached or illicitly trafficked (NO DATA)",
  "15.8.1":
    "Proportion of countries adopting relevant national legislation and adequately resourcing the prevention or control of invasive alien species",
  "15.9.1":
    "(a) Number of countries that have established national targets in accordance with Aichi Biodiversity Target 2 of the Strategic Plan for Biodiversity 2011–2020 or similar targets in their national biodiversity strategies and action plans, and progress reported towards these targets; and (b) integration of biodiversity into national accounting and reporting systems, defined as implementation of the System of Environmental-Economic Accounting",
  "15.a.1":
    "(a) Official development assistance on conservation and sustainable use of biodiversity; and (b) revenue generated and finance mobilized from biodiversity-relevant economic instruments",
  "15.b.1":
    "(a) Official development assistance on conservation and sustainable use of biodiversity; and (b) revenue generated and finance mobilized from biodiversity-relevant economic instruments",
  "15.c.1": "Proportion of traded wildlife that was poached or illicitly trafficked (NO DATA)",

  // ODS 16
  "16.6.1":
    "Primary government expenditures as a proportion of the original approved budget, by sector (or by budget codes or similar)",

  // ODS 17
  "17.14.1":
    "Number of countries with mechanisms in place to enhance policy coherence for sustainable development (NO DATA)",
  "17.16.1":
    "Number of countries reporting progress on the effectiveness of multi-stakeholder monitoring frameworks that support the achievement of the Sustainable Development Goals (NO DATA)",
  "17.18.1":
    "Statistical capacity indicator for Sustainable Development Goal monitoring (UNDER DEVELOPMENT)",
  "17.19.3": "Socioeconomic performance index (UNDER DEVELOPMENT)",

  // ODS 18
  "18.5.1": "Indigenous or quilombola people living in regularized territories (UNDER DEVELOPMENT)",
  "18.5.3":
    "Indigenous schools where teaching is delivered in an indigenous language or in both an indigenous language and Portuguese, out of the total number of indigenous schools (%) (UNDER DEVELOPMENT)",
  "18.5.4":
    "Deforested and secondary vegetation area (ha) by land cover class for indigenous lands or quilombola territories (UNDER DEVELOPMENT)",
  "18.5.5": "Mining area (ha) in Indigenous Lands or quilombola territories (UNDER DEVELOPMENT)",
  "18.5.6": "Population in geological disaster risk areas by race/color (UNDER DEVELOPMENT)",
  "18.6.1":
    "Indigenous or quilombola residents in households with adequate water supply (UNDER DEVELOPMENT)",
  "18.6.2":
    "Households with at least one indigenous or quilombola person with inadequate sanitation (UNDER DEVELOPMENT)",
  "18.6.3":
    "Proportion of urban population living in slums, informal settlements or inadequate housing (UNDER DEVELOPMENT)",
  "18.7.3":
    "Percentage of the indigenous population covered by Multidisciplinary Indigenous Health Teams (EMSI) (UNDER DEVELOPMENT)",
  "18.8.1":
    "School attendance rate in basic education among 15-to-17-year-olds by race/color (including indigenous and quilombola people), by sex and federal unit (UNDER DEVELOPMENT)",
  "18.8.2":
    "Age-grade distortion rate by race/color (including indigenous and quilombola people) in basic education (broken down into elementary I, II and high school), by sex and federal unit (UNDER DEVELOPMENT)",
  "18.8.3":
    "Dropout rate by race/color (including indigenous and quilombola people) in basic education (broken down into elementary I, II and high school), by sex and federal unit (UNDER DEVELOPMENT)",
  "18.8.5":
    "SAEB score of students by race/color (including indigenous and quilombola people), by sex and federal unit (UNDER DEVELOPMENT)",
  "18.8.6":
    "School attendance rate in higher education by race/color (including indigenous and quilombola people, broken down by course and type of institution), by sex and federal unit (UNDER DEVELOPMENT)",
  "18.8.8":
    "Number and percentage of Black, mixed-race and indigenous people by sex holding master's and doctoral degrees (UNDER DEVELOPMENT)",
  "18.8.9":
    "Proportion of schools offering access to: (a) electricity; (b) the internet for pedagogical purposes; (c) computers for pedagogical purposes; (d) adapted infrastructure and materials for students with disabilities; (e) basic drinking water; (f) single-sex basic sanitation facilities; and (g) basic handwashing facilities (as per the WASH indicator definitions) (UNDER DEVELOPMENT)",
  "18.8.10":
    "Percentage of Black, mixed-race and indigenous researchers by sex and federal unit holding a research productivity grant (UNDER DEVELOPMENT)",
  "18.9.1":
    "Percentage of registrations with prior and informed consent from indigenous peoples and Afro-descendants out of the total registrations for access to associated traditional knowledge (UNDER DEVELOPMENT)",
};
