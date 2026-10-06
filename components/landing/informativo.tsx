import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PDF_COMUNICADO } from "@/data/comunicado";
import { PDF_COMUNICADO_EN } from "@/data/comunicado-en";
import type { Dicionario, Locale } from "@/lib/i18n";

export function Informativo({
  textos,
  lang,
}: {
  textos: Dicionario["landing"]["informativo"];
  lang: Locale;
}) {
  return (
    // Sem <section> de próprio: este card aninha dentro da seção do CtaPainel,
    // logo abaixo do cartão "Explore os dados" — o mesmo vidro escuro e a
    // mesma composição centrada.
    <div
      data-revelar
      className="mx-auto mt-8 w-full max-w-6xl rounded-2xl border border-white/25 bg-black/40 px-6 py-8 text-center text-white backdrop-blur-sm [text-shadow:0_1px_4px_rgb(0_0_0/0.7)] sm:px-12"
    >
      <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
        {textos.titulo}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-balance text-white/85">
        {textos.paragrafo}
      </p>
      <Button asChild size="sm" className="mt-6">
        <a
          href={lang === "pt" ? PDF_COMUNICADO : PDF_COMUNICADO_EN}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="size-4" />
          {textos.botao}
        </a>
      </Button>
    </div>
  );
}
