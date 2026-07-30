"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  ListChecks,
  MousePointerClick,
  Search,
  Target,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useFiltros } from "@/components/painel/filtros-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EIXOS, eixoPorNumero } from "@/data/eixos";
import { formatNumero } from "@/lib/format";
import {
  STATUS_COR,
  STATUS_ORDEM,
  STATUS_ROTULO,
  TOTAL_ODS,
  filtrarOds,
  type IndicadorDerivado,
  type OdsDerivado,
  type StatusOds,
} from "@/lib/ods";
import { cn } from "@/lib/utils";

/** Pílula de filtro. Mesmo formato para eixo e status; a cor ativa é injetada. */
const PILULA_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";
const PILULA_INATIVA = "border-border text-muted-foreground hover:bg-muted";

function StatusDot({ status }: { status: StatusOds }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2 shrink-0 rounded-full", STATUS_COR[status])}
    />
  );
}

function BadgeEixo({ numero }: { numero: number | null }) {
  const eixo = numero != null ? eixoPorNumero.get(numero) : undefined;

  if (!eixo) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Sem eixo mapeado
      </Badge>
    );
  }

  return (
    <Badge variant="outline" title={eixo.rotulo} className="gap-1.5">
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-[2px]"
        style={{ backgroundColor: eixo.cor }}
      />
      Eixo {eixo.romano}
    </Badge>
  );
}

function IndicadorCard({ indicador }: { indicador: IndicadorDerivado }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2.5 ring-1 ring-foreground/5">
      <div className="flex items-center gap-1.5">
        <StatusDot status={indicador.status} />
        <span className="text-xs font-semibold tabular-nums">
          {indicador.codigo ?? STATUS_ROTULO[indicador.status]}
        </span>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">
        {indicador.descricao}
      </p>
      <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
        <BadgeEixo numero={indicador.eixo} />
      </div>
    </div>
  );
}

function PainelOds({ ods, onFechar }: { ods: OdsDerivado; onFechar: () => void }) {
  return (
    <div className="flex animate-in flex-col gap-3 rounded-xl bg-card ring-1 ring-foreground/10 fade-in-0 slide-in-from-bottom-4">
      <div className="flex flex-col gap-2 rounded-t-xl bg-primary/5 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Image
              src={ods.img}
              alt=""
              width={72}
              height={72}
              className="size-11 shrink-0 rounded-md object-contain"
            />
            <div>
              <span className="block text-xs text-muted-foreground">{ods.cod}</span>
              <h3 className="text-sm leading-tight font-semibold">{ods.titulo}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFechar}
            className="shrink-0"
            aria-label={`Fechar ${ods.cod}`}
          >
            Fechar
          </Button>
        </div>

        {ods.eixosRelacionados.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {ods.eixosRelacionados.map((numero) => (
              <BadgeEixo key={numero} numero={numero} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-2 p-3 pt-0 sm:grid-cols-2 xl:grid-cols-3">
        {ods.indicadores.length === 0 ? (
          <p className="col-span-full px-1 py-6 text-center text-xs text-muted-foreground">
            Nenhum indicador deste ODS corresponde aos filtros ativos.
          </p>
        ) : (
          ods.indicadores.map((indicador) => (
            <IndicadorCard key={indicador.texto} indicador={indicador} />
          ))
        )}
      </div>
    </div>
  );
}

export function AbaOds() {
  const { filtros } = useFiltros();
  // Aqui o eixo é multi-seleção, e o `eixo` da query string guarda um só
  // (`Filtros.eixo` é `number | null`, e é assim que as outras abas o leem).
  // Então a lista mora em estado local, semeada com o que veio da URL: quem
  // escolheu um eixo em outra aba encontra esse eixo já marcado ao chegar.
  const [eixos, setEixos] = useState<number[]>(() =>
    filtros.eixo != null ? [filtros.eixo] : [],
  );
  const [status, setStatus] = useState<StatusOds[]>([]);
  const [busca, setBusca] = useState("");
  // Vários ODS podem ficar abertos ao mesmo tempo, para comparar indicadores
  // lado a lado sem perder o anterior a cada clique.
  const [odsSelecionados, setOdsSelecionados] = useState<number[]>([]);

  const lista = useMemo(
    () => filtrarOds({ eixos, status, busca }),
    [eixos, status, busca],
  );

  const resumo = useMemo(() => {
    let indicadores = 0;
    let contemplados = 0;
    let pendentes = 0;

    for (const ods of lista) {
      indicadores += ods.indicadores.length;
      if (ods.indicadores.length > 0) contemplados += 1;
      pendentes += ods.indicadores.filter((i) => i.status !== "produzido").length;
    }

    return { indicadores, contemplados, pendentes };
  }, [lista]);

  // A seleção não é limpa quando os filtros esvaziam um ODS escolhido: o painel
  // mostra o estado vazio, que explica o que aconteceu melhor que o sumiço.
  // Os painéis saem na ordem dos ODS, não na de clique, para não pularem de
  // lugar conforme a seleção muda.
  const selecionados = lista.filter((ods) => odsSelecionados.includes(ods.numero));

  const alternarOds = useCallback((numero: number) => {
    setOdsSelecionados((atual) =>
      atual.includes(numero) ? atual.filter((n) => n !== numero) : [...atual, numero],
    );
  }, []);

  const alternarEixo = useCallback((numero: number) => {
    setEixos((atual) =>
      atual.includes(numero) ? atual.filter((n) => n !== numero) : [...atual, numero],
    );
  }, []);

  const alternarStatus = useCallback((valor: StatusOds) => {
    setStatus((atual) =>
      atual.includes(valor) ? atual.filter((s) => s !== valor) : [...atual, valor],
    );
  }, []);

  const tiles: { titulo: string; valor: string; subtitulo: string; icone: LucideIcon }[] = [
    {
      titulo: "Indicadores mapeados",
      valor: formatNumero(resumo.indicadores),
      subtitulo: "Correspondem aos filtros",
      icone: ListChecks,
    },
    {
      titulo: "ODS contemplados",
      valor: `${resumo.contemplados}/${TOTAL_ODS}`,
      subtitulo: "Com ao menos um indicador",
      icone: Target,
    },
    {
      titulo: "Em construção ou sem dados",
      valor: formatNumero(resumo.pendentes),
      subtitulo: "Indicadores ainda não produzidos",
      icone: TriangleAlert,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => {
          const Icone = tile.icone;
          return (
            <Card
              key={tile.titulo}
              data-revelar
              className="relative gap-0 overflow-hidden"
            >
              {/* Marca d'água decorativa, no mesmo idioma dos KPIs do painel. */}
              <Icone
                aria-hidden
                strokeWidth={1.5}
                className="pointer-events-none absolute -right-3 -bottom-4 size-28 text-primary/35 dark:text-primary/40"
              />
              <CardContent className="relative">
                <p className="text-sm leading-snug font-medium text-muted-foreground">
                  {tile.titulo}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                  {tile.valor}
                </p>
                <p className="mt-1.5 text-sm font-medium text-primary">{tile.subtitulo}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {/* As pílulas de eixo também servem de legenda: mostram cor e nome.
              A aba não recebe o formulário de filtros do painel — `Filtros`
              devolve null aqui —, então este é o controle de eixo desta aba.
              Multi-seleção: vários eixos somam seus indicadores. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Eixo:</span>
            <button
              type="button"
              onClick={() => setEixos([])}
              aria-pressed={eixos.length === 0}
              className={cn(
                PILULA_BASE,
                eixos.length === 0
                  ? "border-foreground bg-foreground text-background"
                  : PILULA_INATIVA,
              )}
            >
              Todos
            </button>
            {EIXOS.map((eixo) => {
              const ativo = eixos.includes(eixo.numero);
              return (
                <button
                  key={eixo.numero}
                  type="button"
                  onClick={() => alternarEixo(eixo.numero)}
                  aria-pressed={ativo}
                  title={eixo.rotulo}
                  className={cn(
                    PILULA_BASE,
                    ativo ? "border-transparent text-white" : PILULA_INATIVA,
                  )}
                  style={ativo ? { backgroundColor: eixo.cor } : undefined}
                >
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: ativo ? "currentColor" : eixo.cor }}
                  />
                  Eixo {eixo.romano}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Situação:</span>
            <button
              type="button"
              onClick={() => setStatus([])}
              aria-pressed={status.length === 0}
              className={cn(
                PILULA_BASE,
                status.length === 0
                  ? "border-foreground bg-foreground text-background"
                  : PILULA_INATIVA,
              )}
            >
              Todas
            </button>
            {STATUS_ORDEM.map((valor) => {
              const ativo = status.includes(valor);
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => alternarStatus(valor)}
                  aria-pressed={ativo}
                  className={cn(
                    PILULA_BASE,
                    ativo
                      ? "border-foreground bg-foreground text-background"
                      : PILULA_INATIVA,
                  )}
                >
                  <StatusDot status={valor} />
                  {STATUS_ROTULO[valor]}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar por ODS, código ou texto do indicador..."
              aria-label="Buscar indicadores dos ODS"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Duas fileiras de 9 a partir de `md` — para em 9 colunas de propósito:
          numa fileira só de 18, cada logo fica pequeno demais para se ler.
          Os 18 ODS sempre ocupam as mesmas posições: filtrar apaga os tiles sem
          indicador em vez de removê-los, para a grade não reordenar a cada
          clique. */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-9">
        {lista.map((ods, indice) => {
          const selecionado = odsSelecionados.includes(ods.numero);
          const vazio = ods.indicadores.length === 0;
          // Assim que há alguma escolha, os demais recuam para o mesmo cinza
          // que os filtrados: colorido passa a significar "aberto abaixo", e o
          // anel sozinho era discreto demais para distinguir num logo pequeno.
          const apagado = !selecionado && (vazio || odsSelecionados.length > 0);
          return (
            <button
              key={ods.numero}
              type="button"
              onClick={() => alternarOds(ods.numero)}
              aria-label={`${ods.cod} — ${ods.titulo}`}
              aria-pressed={selecionado}
              title={`${ods.cod} — ${ods.titulo}`}
              style={{
                animationDelay: `${indice * 40}ms`,
                animationFillMode: "backwards",
              }}
              className={cn(
                "relative aspect-square animate-in overflow-hidden rounded-lg bg-muted/30 ring-2 transition-all duration-200 fade-in-0 zoom-in-95 focus-visible:ring-ring focus-visible:outline-none",
                selecionado
                  ? "scale-105 ring-primary"
                  : "ring-transparent hover:scale-105 hover:ring-foreground/20",
                // `hover:` devolve a cor: apagado marca o que não está escolhido,
                // não o que está indisponível — todos seguem clicáveis.
                apagado && "opacity-40 grayscale hover:opacity-100 hover:grayscale-0",
              )}
            >
              <Image
                src={ods.img}
                alt=""
                width={300}
                height={300}
                className="h-full w-full object-contain"
              />
            </button>
          );
        })}
      </div>

      {selecionados.length > 0 ? (
        <div className="space-y-4">
          {/* Só aparece com mais de um aberto: com um só, o "Fechar" do próprio
              painel já resolve. */}
          {selecionados.length > 1 ? (
            <div className="flex items-center justify-between gap-3 text-white/80 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
              <span className="text-sm">
                {selecionados.length} ODS selecionados
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOdsSelecionados([])}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Fechar todos
              </Button>
            </div>
          ) : null}

          {selecionados.map((ods) => (
            <PainelOds
              key={ods.numero}
              ods={ods}
              onFechar={() => alternarOds(ods.numero)}
            />
          ))}
        </div>
      ) : (
        // Sem fundo: só o texto sobre a foto do painel. O véu da foto é escuro
        // nos dois temas, então a legibilidade vem do branco a 80% mais uma
        // sombra curta — e não de um cartão, que pesaria demais para um aviso.
        <div className="flex items-center justify-center gap-2 px-4 py-6 text-center text-white/80 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
          <MousePointerClick aria-hidden className="size-4 shrink-0" />
          <p className="text-sm">
            Clique nos ODS acima para ver seus indicadores — pode escolher mais de um.
          </p>
        </div>
      )}
    </div>
  );
}
