"use client";

import { Info } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ORCAMENTO } from "@/lib/data";

export function NotaAno() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Os valores são referentes ao ano de ${ORCAMENTO.exercicio}`}
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border/60 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Info aria-hidden className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-3">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Info aria-hidden className="size-3.5 shrink-0 text-primary" />
          Os valores são referentes ao ano de {ORCAMENTO.exercicio}.
        </p>
      </PopoverContent>
    </Popover>
  );
}
