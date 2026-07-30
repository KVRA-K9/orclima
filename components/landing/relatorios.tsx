import { ArrowUpRight, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PUBLICACOES } from "@/lib/instrumentos";

export function Relatorios() {
  return (
    <section id="relatorios" className="border-t border-border/60 bg-card/40 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Relatórios e publicações
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Documentos oficiais que embasam e detalham o Orçamento Climático do Estado do
          Acre.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PUBLICACOES.map((item) => (
            <Card key={item.titulo} className="transition-colors hover:border-primary/40">
              <CardContent>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 focus-visible:outline-none"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="leading-snug font-semibold">{item.titulo}</span>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    </span>
                    {item.descricao ? (
                      <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                        {item.descricao}
                      </span>
                    ) : null}
                  </span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
