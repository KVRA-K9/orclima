import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { EIXOS } from "@/data/eixos";
import { ORGAOS, totaisPorEixo } from "@/lib/data";
import { formatCompactoBRL, formatPercentual } from "@/lib/format";

export function Eixos() {
  const totais = new Map(totaisPorEixo(ORGAOS).map((t) => [t.numero, t]));

  return (
    <section id="eixos" className="relative isolate min-h-svh">
      {/* Mesma camada sticky das seções anteriores. O recorte é ancorado na
          cabeça da arara, que fica à direita e acima do centro da foto.
          `min-h-svh` (e não `h-svh`) porque os sete cartões passam de uma tela:
          a seção cresce e a foto fica travada durante toda a rolagem dela. */}
      <div className="sticky top-0 -z-10 h-svh w-full overflow-hidden">
        <Image
          src="/fauna-arara.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-[68%_28%] contrast-110 saturate-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70"
        />
      </div>

      <div className="-mt-[100svh] flex min-h-svh flex-col justify-center px-4 py-24 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {/* Título e subtítulo em branco fixo: os tokens do tema sumiriam
              sobre a foto no tema claro. Os cartões abaixo mantêm o fundo do
              tema, que é opaco e já se sustenta sozinho. */}
          <div className="text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.7)]">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Eixos temáticos
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-white/85">
              Aplicado de forma transversal e integrada a todas as áreas do governo — como
              saúde, educação, infraestrutura, agricultura, meio ambiente e assistência
              social — o Orçamento Climático estrutura-se em sete eixos temáticos:
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EIXOS.map((eixo) => {
              const Icone = eixo.icone;
              const total = totais.get(eixo.numero);

              return (
                <Card
                  key={eixo.numero}
                  className="group relative overflow-hidden transition-colors hover:border-primary/40"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5"
                    style={{ backgroundColor: eixo.cor }}
                  />
                  {/* Marca d'água: o ícone sai da linha de cima e vai para o fundo,
                      recortado pelo overflow-hidden do cartão. Decorativo, então
                      fora da árvore de acessibilidade. A cor do eixo é misturada
                      com transparent porque ela vem inline (não é token do tema),
                      e por isso não dá para usar as opacidades do Tailwind. */}
                  <Icone
                    aria-hidden
                    strokeWidth={1.5}
                    className="pointer-events-none absolute -right-3 -bottom-4 size-28"
                    style={{ color: `color-mix(in oklab, ${eixo.cor} 35%, transparent)` }}
                  />
                  <CardContent className="relative space-y-3">
                    {/* Com o ícone no fundo, o número fica sozinho no lugar dele. */}
                    <span
                      className="block font-mono text-2xl font-semibold tabular-nums"
                      style={{ color: eixo.cor }}
                    >
                      {String(eixo.numero).padStart(2, "0")}
                    </span>

                    <h3 className="leading-snug font-semibold">{eixo.titulo}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {eixo.descricao}
                    </p>

                    {total ? (
                      <p className="border-t border-border/60 pt-3 text-sm">
                        <span className="font-semibold">
                          {formatCompactoBRL(total.valor)}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          · {formatPercentual(total.participacao)} do total
                        </span>
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Crédito da foto, no mesmo canto e no mesmo tratamento do hero. */}
      <p className="absolute right-4 bottom-3 z-10 text-[11px] font-medium text-white/95 [text-shadow:0_1px_4px_rgb(0_0_0/0.85)] sm:right-6">
        Fotografia: Talita Oliveira - SECOM/AC
      </p>
    </section>
  );
}
