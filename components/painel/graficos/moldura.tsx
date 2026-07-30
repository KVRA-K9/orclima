"use client";

import { useEffect, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMontado } from "@/hooks/use-montado";
import { cn } from "@/lib/utils";

type Props = {
  titulo: string;
  descricao?: string;
  altura?: number;
  className?: string;
  /** Conteúdo extra abaixo do gráfico (legenda própria, nota de rodapé). */
  rodape?: React.ReactNode;
  children: React.ReactElement;
};

/**
 * Cartão padrão dos gráficos. O Recharts mede o contêiner no cliente, então o
 * desenho só entra após a montagem — até lá fica um Skeleton da mesma altura,
 * o que evita salto de layout e aviso de hidratação.
 */
export function MolduraGrafico({
  titulo,
  descricao,
  altura = 300,
  className,
  rodape,
  children,
}: Props) {
  const montado = useMontado();
  const alvo = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  // O Recharts anima na montagem. Sem esperar a visibilidade, os quatro
  // gráficos animariam juntos no carregamento — atrás de um cartão ainda
  // transparente — e o usuário só encontraria o desenho já parado ao rolar até
  // lá. Montando na entrada em tela, a animação toca quando há quem veja.
  useEffect(() => {
    if (visivel) return;
    const no = alvo.current;
    if (!no || typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setVisivel(true);
        observador.disconnect();
      },
      // Espera o cartão entrar de fato, não só encostar na borda inferior.
      { rootMargin: "0px 0px -12% 0px" },
    );
    observador.observe(no);
    return () => observador.disconnect();
  }, [visivel]);

  return (
    <Card className={cn("revelar-rolagem gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-base">{titulo}</CardTitle>
        {descricao ? <CardDescription>{descricao}</CardDescription> : null}
      </CardHeader>
      <CardContent ref={alvo}>
        {montado && visivel ? (
          <ResponsiveContainer width="100%" height={altura}>
            {children}
          </ResponsiveContainer>
        ) : (
          <Skeleton style={{ height: altura }} className="w-full" />
        )}
        {rodape}
      </CardContent>
    </Card>
  );
}
