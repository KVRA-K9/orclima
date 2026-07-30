import { Check, ExternalLink } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

const LEI_ORCAMENTO_CLIMATICO = "https://legis.ac.gov.br/detalhar/6600";

const OBJETIVOS = [
  "Reduzir os impactos das mudanças climáticas (mitigação);",
  "Preparar o Estado para enfrentar esses impactos (adaptação);",
  "Proteger populações e territórios vulneráveis;",
  "Valorizar os recursos naturais e culturais da Amazônia.",
];

export function Sobre() {
  return (
    <section id="sobre" className="relative isolate min-h-svh">
      {/* Mesma camada sticky do hero: a foto trava na viewport enquanto o texto
          passa por cima. O `overflow-hidden` fica aqui, e não na seção — num
          ancestral ele quebraria o sticky. O recorte é ancorado à direita e
          acima do centro, onde está o jabuti sobre o tronco. */}
      <div className="sticky top-0 -z-10 h-svh w-full overflow-hidden">
        <Image
          src="/fauna-jabuti.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-[60%_40%] contrast-110 saturate-105"
        />
        {/* Véu escuro em gradiente, o mesmo do hero: com a foto ocupando a tela
            toda, o véu chapado anterior não sustentava a leitura. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"
        />
      </div>

      {/* Cores fixas em branco, e não os tokens do tema: quem está atrás do
          texto é sempre a foto — escura nos dois temas. A sombra herda para os
          filhos e é o que sustenta a leitura sobre as áreas mais claras. */}
      <div className="-mt-[100svh] flex min-h-svh flex-col justify-center px-4 py-24 sm:px-6">
        <div className="mx-auto w-full max-w-6xl text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.7)]">
          <h2 data-revelar className="text-3xl font-semibold tracking-tight sm:text-4xl">
            O que é o Orçamento Climático?
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div data-revelar className="space-y-5 text-base leading-relaxed text-white/90">
              <p>
                O Orçamento Climático é uma ferramenta inédita no Estado do Acre, criada
                para organizar e acompanhar os gastos públicos destinados à proteção
                ambiental e ao enfrentamento das mudanças climáticas, conforme estabelece
                a{" "}
                <a
                  href={LEI_ORCAMENTO_CLIMATICO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline underline-offset-4 decoration-white/50 hover:decoration-white"
                >
                  Lei nº 4.679, de 10 de novembro de 2025
                  <ExternalLink className="ml-1 inline size-3.5 align-[-0.1em]" />
                </a>
                .
              </p>
              <p>
                Mais do que um instrumento contábil, trata-se de um modelo inovador de
                gestão, que permite identificar, monitorar e avaliar todas as ações
                governamentais que contribuem para:
              </p>

              <ul className="space-y-3">
                {OBJETIVOS.map((objetivo) => (
                  <li key={objetivo} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="font-medium text-white">{objetivo}</span>
                  </li>
                ))}
              </ul>

              <p>
                Com essa ferramenta, o Acre busca mensurar com precisão quanto investe em
                ações climáticas, avaliar a efetividade dos projetos, atrair recursos
                nacionais e internacionais e fortalecer políticas públicas voltadas à
                sustentabilidade.
              </p>
            </div>

            {/* O bg-primary/5 original era translúcido demais para ficar sobre
                foto: aqui o card ganha um fundo escuro próprio. */}
            <Card data-revelar className="h-fit border-white/25 bg-black/40 text-white backdrop-blur-sm">
              <CardContent className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide uppercase">
                  Em outras palavras
                </h3>
                <p className="text-base leading-relaxed">
                  É a resposta à pergunta{" "}
                  <strong className="font-semibold">
                    &ldquo;quanto o Estado do Acre investe, de fato, em clima?&rdquo;
                  </strong>{" "}
                  — separando o que é despesa exclusivamente climática do que contribui
                  de forma parcial, em todas as áreas do governo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Crédito da foto, no mesmo canto e no mesmo tratamento do hero: sem
          fundo, a legibilidade vem do branco com sombra sobre a foto. */}
      <p className="absolute right-4 bottom-3 z-10 text-[11px] font-medium text-white/95 [text-shadow:0_1px_4px_rgb(0_0_0/0.85)] sm:right-6">
        Fotografia: Arison Jardim - SECOM/AC
      </p>
    </section>
  );
}
