import {
  BookMarked,
  FileText,
  Landmark,
  Scale,
  type LucideIcon,
} from "lucide-react";

export type InstrumentoLegal = {
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  url?: string;
};

export type GrupoInstrumentos = {
  categoria: string;
  icone: LucideIcon;
  itens: InstrumentoLegal[];
};

export const INSTRUMENTOS_LEGAIS: GrupoInstrumentos[] = [
  {
    categoria: "Publicações Oficiais",
    icone: FileText,
    itens: [
      { titulo: "Orçamento Climático do Estado do Acre", descricao: "Documento oficial da Secretaria de Estado de Planejamento apresentando o orçamento climático do estado, com diretrizes, metas e ações para mitigação e adaptação às mudanças climáticas.", url: "https://seplan.ac.gov.br/wp-content/uploads/2025/11/ORCAMENTO-CLIMATICO.pdf" },
      { titulo: "Agenda Acre 10 anos", descricao: "Principal instrumento de planejamento estratégico de longo prazo do Governo do Estado do Acre, voltado ao desenvolvimento socioeconômico sustentável.", url: "https://seplan.ac.gov.br/desenvolvimento-regional/agenda-acre-10-anos/" },
      { titulo: "Decreto Nº 11.374, de 28 de novembro de 2023", descricao: "Dispõe sobre a Rede de Governança Ambiental do Acre e dá outras providências.", url: "https://legis.ac.gov.br/detalhar/5814" },
      { titulo: "PPCDQ – Fase 3", descricao: "Plano Estadual de Prevenção e Controle do Desmatamento e Queimada no Acre – PPCDQ-AC, em concordância com as diretrizes do Plano de Ação para Prevenção e Controle do Desmatamento na Amazônia Legal – PPCDAm.", url: "https://sema.ac.gov.br/wp-content/uploads/2024/06/PPCDQ-AC-DIGITAL-13-MAIO_FINAL.pdf" },
      { titulo: "Plano Emergencial de Enfrentamento às Enchentes", descricao: "Ferramenta de articulação de ações efetivas de curto, médio e longo prazo entre o poder público e a sociedade civil para combater as causas do problema, recuperar a infraestrutura urbana e rural atingida, reduzir o impacto socioeconômico das enchentes e adaptar as cidades e comunidades rurais à nova realidade climática.", url: "https://seplan.ac.gov.br/wp-content/uploads/2024/05/Plano-Emergencial-Enchentes-Acre-2024.pdf" },
    ],
  },
  {
    categoria: "Constituição Federal",
    icone: Scale,
    itens: [
      { titulo: "CF/88 - Art. 225", descricao: "Direito ao meio ambiente ecologicamente equilibrado, impondo ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo para as presentes e futuras gerações.", url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art225" },
      { titulo: "CF/88 - Art. 23, VI e VII", descricao: "Competência comum da União, dos Estados, do Distrito Federal e dos Municípios: \nVI - proteger o meio ambiente e combater a poluição em qualquer de suas formas;\nVII - preservar as florestas, a fauna e a flora.", url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art23" },
    ],
  },
  {
    categoria: "Leis Estaduais",
    icone: Landmark,
    itens: [
      { titulo: "Lei nº 4.679, de 10 de novembro de 2025", descricao: "Dispõe sobre o Orçamento Climático do Estado do Acre.", url: "https://legis.ac.gov.br/detalhar/6600" },
      { titulo: "Lei nº 3.880, de 17 de dezembro de 2021", subtitulo: "Altera a Lei nº 2.308, de 22 de outubro de 2010", url: "https://legis.ac.gov.br/detalhar/4977" },
      { titulo: "Lei nº 2.308/10 - SISA/AC", descricao: "Sistema de Incentivo a Serviços Ambientais do Estado do Acre.", url: "https://legis.ac.gov.br/detalhar/475" },
    ],
  },
  {
    categoria: "Leis Federais",
    icone: BookMarked,
    itens: [
      { titulo: "Lei nº 12.187/2009 (PNMC)", descricao: "Política Nacional sobre Mudança do Clima, estabelecendo a meta de redução de emissões e o papel dos estados na implementação de ações climáticas.", url: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12187.htm" },
      { titulo: "Plano Nacional sobre Mudança do Clima (Plano Clima 2024-2035)", descricao: "Estratégia de longo prazo para a descarbonização da economia brasileira, com metas setoriais de mitigação e adaptação às mudanças climáticas.", url: "https://www.gov.br/mma/pt-br/composicao/smc/plano-clima" },
      { titulo: "Decreto Nº 12.705, de 31 de outubro de 2025", descricao: "Estabelece a Taxonomia Sustentável Brasileira – TSB como instrumento do Plano de Transformação Ecológica do Poder Executivo federal.", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12705.htm?shem=rimspwouoe" },
    ],
  },
];
