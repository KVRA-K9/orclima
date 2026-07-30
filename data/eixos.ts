import {
  CloudRainWind,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Siren,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Eixo = {
  /** 1..7 — chave usada nas alocações de `orcamento.json`. */
  numero: number;
  romano: string;
  /** Rótulo completo, como aparece na fonte oficial. */
  rotulo: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  cor: string;
};

export const EIXOS: Eixo[] = [
  {
    numero: 1,
    romano: "I",
    rotulo: "Desenvolvimento sustentável e bioeconomia",
    titulo: "Desenvolvimento sustentável e bioeconomia",
    descricao: "Incentivo a cadeias produtivas sustentáveis que valorizam a floresta em pé e geram renda para comunidades locais.",
    icone: Sprout,
    cor: "var(--eixo-1)",
  },
  {
    numero: 2,
    romano: "II",
    rotulo: "Mitigação das mudanças climáticas",
    titulo: "Mitigação das mudanças climáticas",
    descricao: "Ações para reduzir a emissão de gases de efeito estufa e aumentar a absorção de carbono pela floresta amazônica.",
    icone: CloudRainWind,
    cor: "var(--eixo-2)",
  },
  {
    numero: 3,
    romano: "III",
    rotulo: "Adaptação climática",
    titulo: "Adaptação climática",
    descricao: "Estratégias para preparar cidades e comunidades rurais aos impactos das mudanças climáticas na Amazônia.",
    icone: ShieldCheck,
    cor: "var(--eixo-3)",
  },
  {
    numero: 4,
    romano: "IV",
    rotulo: "Justiça climática e inclusão social",
    titulo: "Justiça climática e inclusão social",
    descricao: "Proteção de populações e territórios vulneráveis, garantindo equidade nos benefícios das ações climáticas.",
    icone: Users,
    cor: "var(--eixo-4)",
  },
  {
    numero: 5,
    romano: "V",
    rotulo: "Governança ambiental e transparência",
    titulo: "Governança ambiental e transparência",
    descricao: "Fortalecimento da gestão pública com monitoramento, fiscalização e acesso à informação ambiental.",
    icone: Landmark,
    cor: "var(--eixo-5)",
  },
  {
    numero: 6,
    romano: "VI",
    rotulo: "Educação ambiental e inovação",
    titulo: "Educação ambiental e inovação",
    descricao: "Promoção do conhecimento, pesquisa e tecnologias limpas para a transição sustentável.",
    icone: GraduationCap,
    cor: "var(--eixo-6)",
  },
  {
    numero: 7,
    romano: "VII",
    rotulo: "Gestão de riscos e proteção civil",
    titulo: "Gestão de riscos e proteção civil",
    descricao: "Prevenção e resposta a desastres naturais, incêndios florestais e eventos climáticos extremos.",
    icone: Siren,
    cor: "var(--eixo-7)",
  },
];

export const eixoPorNumero = new Map(EIXOS.map((e) => [e.numero, e]));
