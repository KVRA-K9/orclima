"use client";

import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INSTRUMENTOS_LEGAIS } from "@/data/instrumentos-legais";

export function AbaInstrumentos() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {INSTRUMENTOS_LEGAIS.map((grupo) => {
        const Icone = grupo.icone;
        return (
          <Card key={grupo.categoria}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icone className="size-4" strokeWidth={1.75} />
                </span>
                {grupo.categoria}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {grupo.itens.map((item) => (
                  <li key={item.titulo} className="border-l-2 border-border pl-3">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium underline-offset-4 hover:text-primary hover:underline"
                      >
                        {item.titulo}
                        <ExternalLink className="ml-1 inline size-3 align-[-0.05em]" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium">{item.titulo}</span>
                    )}
                    {item.subtitulo ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.subtitulo}
                      </p>
                    ) : null}
                    {item.descricao ? (
                      <p className="mt-1.5 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                        {item.descricao}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
