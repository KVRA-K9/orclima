"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TODOS, useFiltros } from "@/components/painel/filtros-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EIXOS } from "@/data/eixos";
import { EXERCICIOS, NOMES_ORGAOS } from "@/lib/data";
import type { TipoDotacao } from "@/lib/types";

const esquema = z.object({
  exercicio: z.string(),
  eixo: z.string(),
  orgao: z.string(),
  tipo: z.string(),
  busca: z.string(),
});

type Formulario = z.infer<typeof esquema>;

const TIPOS: TipoDotacao[] = ["Exclusivo", "Não Exclusivo"];

export function Filtros() {
  const { aba, filtros, ativo, definir, limpar, orgaosFiltrados } = useFiltros();

  // A URL é a fonte de verdade; `values` mantém o formulário espelhando-a
  // (inclusive ao voltar/avançar no navegador ou ao clicar em "Limpar filtros").
  const form = useForm<Formulario>({
    resolver: zodResolver(esquema),
    values: {
      exercicio: filtros.exercicio ? String(filtros.exercicio) : TODOS,
      eixo: filtros.eixo ? String(filtros.eixo) : TODOS,
      orgao: filtros.orgao ?? TODOS,
      tipo: filtros.tipo ?? TODOS,
      busca: filtros.busca,
    },
  });

  const busca = form.watch("busca");

  // A busca é digitada: aplica com atraso curto para não reescrever a URL a cada tecla.
  useEffect(() => {
    if (busca === filtros.busca) return;
    const id = setTimeout(() => definir({ busca }), 300);
    return () => clearTimeout(id);
  }, [busca, definir, filtros.busca]);

  // Instrumentos legais e ODS não têm o que recortar por órgão ou classificação,
  // então o cartão sai de cena nessas duas abas. O retorno vem depois dos
  // hooks acima, que não podem ficar atrás de uma condição.
  if (aba === "instrumentos" || aba === "ods") return null;

  return (
    // Primeira dobra do painel: entra por tempo, logo depois do banner.
    <Card className="revelar-entrada" style={{ animationDelay: "120ms" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          Filtros
        </CardTitle>
        {ativo ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpar}
            className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
          >
            <X className="size-4" />
            Limpar filtros
          </Button>
        ) : null}
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-2">
            <Label htmlFor="filtro-ano">Ano</Label>
            <Select
              value={form.watch("exercicio")}
              onValueChange={(valor) => {
                form.setValue("exercicio", valor);
                definir({ exercicio: valor === TODOS ? null : Number(valor) });
              }}
            >
              <SelectTrigger id="filtro-ano" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos os anos</SelectItem>
                {EXERCICIOS.map((ano) => (
                  <SelectItem key={ano} value={String(ano)}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-eixo">Eixo temático</Label>
            <Select
              value={form.watch("eixo")}
              onValueChange={(valor) => {
                form.setValue("eixo", valor);
                definir({ eixo: valor === TODOS ? null : Number(valor) });
              }}
            >
              <SelectTrigger id="filtro-eixo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos os eixos temáticos</SelectItem>
                {EIXOS.map((eixo) => (
                  <SelectItem key={eixo.numero} value={String(eixo.numero)}>
                    {eixo.romano} — {eixo.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-orgao">Órgão</Label>
            <Select
              value={form.watch("orgao")}
              onValueChange={(valor) => {
                form.setValue("orgao", valor);
                definir({ orgao: valor === TODOS ? null : valor });
              }}
            >
              <SelectTrigger id="filtro-orgao" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={TODOS}>Todos os órgãos</SelectItem>
                {NOMES_ORGAOS.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-tipo">Classificação</Label>
            <Select
              value={form.watch("tipo")}
              onValueChange={(valor) => {
                form.setValue("tipo", valor);
                definir({ tipo: valor === TODOS ? null : (valor as TipoDotacao) });
              }}
            >
              <SelectTrigger id="filtro-tipo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas as classificações</SelectItem>
                {TIPOS.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filtro-busca">Pesquisar</Label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="filtro-busca"
                placeholder="Pesquisar órgão..."
                className="pl-9"
                {...form.register("busca")}
              />
            </div>
          </div>
        </form>

        {ativo ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {orgaosFiltrados.length === 0
              ? "Nenhum órgão corresponde aos filtros."
              : `${orgaosFiltrados.length} de ${NOMES_ORGAOS.length} órgãos no recorte atual.`}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
