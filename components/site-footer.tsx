import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const INSTITUCIONAL = [
  { rotulo: "SEPLAN", href: "https://seplan.ac.gov.br" },
  { rotulo: "Diário Oficial do Acre", href: "https://www.diario.ac.gov.br/" },
  { rotulo: "Legislação estadual", href: "https://legis.ac.gov.br/" },
  { rotulo: "Portal da Transparência", href: "https://transparencia.ac.gov.br/#/dashboard" },
];

const NAVEGACAO = [
  { rotulo: "Sobre", href: "/#sobre" },
  { rotulo: "Eixos temáticos", href: "/#eixos" },
  { rotulo: "Instrumentos legais", href: "/painel?aba=instrumentos" },
  { rotulo: "Painel de dados", href: "/painel" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t bg-background">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            {/* Duas versões do mesmo logo: no branco, só o brasão é colorido —
                a tipografia é branca e sumiria sobre o `bg-background` claro.
                A troca é por classe (`next-themes` usa `attribute="class"`),
                então não há troca visível depois da hidratação. */}
            <Image
              src="/logo-governo-acre.png"
              alt="Governo do Estado do Acre 2023-2026"
              width={2086}
              height={987}
              className="h-32 w-auto self-start dark:hidden"
            />
            <Image
              src="/logo-governo-acre-branco.png"
              alt="Governo do Estado do Acre 2023-2026"
              width={2058}
              height={987}
              className="hidden h-32 w-auto self-start dark:block"
            />
          </div>

          <nav aria-label="Navegação" className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Navegação
            </h2>
            {NAVEGACAO.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground hover:text-primary"
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>

          <nav aria-label="Institucional" className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Institucional
            </h2>
            {INSTITUCIONAL.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-primary"
              >
                {item.rotulo}
              </a>
            ))}
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Governo do Estado do Acre · Secretaria de
              Estado de Planejamento do Acre - Departamento de Estudos e Planejamento
              Orçamentário - DEPPO/SEPLAN
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              Av. Getúlio Vargas, 232 · Centro · Rio Branco · Acre · CEP 69900-060
            </p>
          </div>
          <Separator className="my-2" />
          {/* Equipe conforme o expediente do "Roteiro Operativo para Orçamento
              Climático" (docs/fonte), não a do projeto vizinho. */}
          <p className="leading-relaxed">
            Coordenação: Denyscley Oliveira Bandeira (Departamento de Estudos e
            Planejamento Orçamentário); Equipe Técnica: Ícaro Lebre Gundim (Economista),
            Luísa Nascimento Ribeiro (Economista), Roseneide Mendonça de Sena Caldera
            (Especialista Executiva – Administração), Vinicius Carneiro de Farias
            (Economista).
          </p>
        </div>
      </div>
    </footer>
  );
}
