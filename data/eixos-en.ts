export type EixoEn = {
  rotulo: string;
  titulo: string;
  descricao: string;
};

export const EIXOS_EN: Record<number, EixoEn> = {
  1: {
    rotulo: "Sustainable development and bioeconomy",
    titulo: "Sustainable development and bioeconomy",
    descricao:
      "Incentives for sustainable production chains that value the standing forest and generate income for local communities.",
  },
  2: {
    rotulo: "Climate change mitigation",
    titulo: "Climate change mitigation",
    descricao:
      "Actions to reduce greenhouse gas emissions and increase carbon absorption by the Amazon rainforest.",
  },
  3: {
    rotulo: "Climate adaptation",
    titulo: "Climate adaptation",
    descricao:
      "Strategies to prepare cities and rural communities for the impacts of climate change in the Amazon.",
  },
  4: {
    rotulo: "Climate justice and social inclusion",
    titulo: "Climate justice and social inclusion",
    descricao:
      "Protection of vulnerable populations and territories, ensuring equity in the benefits of climate action.",
  },
  5: {
    rotulo: "Environmental governance and transparency",
    titulo: "Environmental governance and transparency",
    descricao:
      "Strengthening public administration through monitoring, enforcement, and public access to environmental information.",
  },
  6: {
    rotulo: "Environmental education and innovation",
    titulo: "Environmental education and innovation",
    descricao:
      "Promotion of knowledge, research, and clean technologies for a sustainable transition.",
  },
  7: {
    rotulo: "Risk management and civil protection",
    titulo: "Risk management and civil protection",
    descricao:
      "Prevention and response to natural disasters, wildfires, and extreme weather events.",
  },
};
