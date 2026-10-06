"use client";

import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INSTRUMENTOS_LEGAIS } from "@/data/instrumentos-legais";
import { useI18n } from "@/lib/i18n/cliente";
import { instrumentoDoIdioma } from "@/lib/i18n/conteudo";

export function AbaInstrumentos() {
  const { t, lang } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {INSTRUMENTOS_LEGAIS.map((grupo) => {
        const Icone = grupo.icone;
        return (
          <Card key={grupo.categoria} data-revelar>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icone className="size-4" strokeWidth={1.75} />
                </span>
                {t.dados.categoriaInstrumentos[grupo.categoria] ?? grupo.categoria}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {grupo.itens.map((itemBruto) => {
                  // A alfa não é a mesma nos dois temas de propósito: sobre o
                  // branco puro do cartão claro, `primary/10` renderizaria 1,14 de
                  // contraste contra 1,25 no escuro. O /15 no claro iguala a
                  // presença dos dois — o alvo é a leitura, não a alfa.
                  const item = instrumentoDoIdioma(itemBruto, lang);
                  return (
                    <li
                      key={itemBruto.titulo}
                      className="rounded-lg border-l-2 border-primary/40 bg-primary/15 p-3 dark:bg-primary/10"
                    >
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
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
