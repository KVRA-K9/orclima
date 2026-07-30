"use client";

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

  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-base">{titulo}</CardTitle>
        {descricao ? <CardDescription>{descricao}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {montado ? (
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
