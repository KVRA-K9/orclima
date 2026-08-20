"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DetalhamentoAccordion } from "@/components/painel/detalhamento-accordion";
import { useFiltros } from "@/components/painel/filtros-context";
import { PILULA_ATIVA, PILULA_BASE, PILULA_INATIVA } from "@/components/painel/pilula";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EIXOS } from "@/data/eixos";
import { aplicarFonte, fontesDisponiveis } from "@/lib/data";
import { exportarPdf, exportarXlsx } from "@/lib/export";
import { formatBRL, formatCompactoBRL, formatPercentual } from "@/lib/format";
import type { Orgao } from "@/lib/types";
import { cn } from "@/lib/utils";

type Visao = "tabela" | "detalhado";

type Coluna = {
  chave: keyof Orgao | "eixos";
  rotulo: string;
  numerica?: boolean;
};

const COLUNAS: Coluna[] = [
  { chave: "nome", rotulo: "Órgão" },
  { chave: "total", rotulo: "Dotação total", numerica: true },
  { chave: "exclusivo", rotulo: "Exclusivo", numerica: true },
  { chave: "naoExclusivo", rotulo: "Não exclusivo", numerica: true },
  { chave: "tipo", rotulo: "Classificação" },
  { chave: "eixos", rotulo: "Eixos" },
];

/** Linhas por página, como na tabela do OCAD. */
const TAMANHO_PAGINA = 10;

/**
 * Fontes com pílula própria na linha de filtro. Seis cobrem cerca de 80% do
 * orçamento — o resto é uma cauda longa que não merece espaço permanente e
 * fica atrás do botão que abre a lista completa.
 */
const FONTES_EM_DESTAQUE = 6;

export function AbaDetalhamento() {
  const { orgaosFiltrados, resumo, aplicacoesDe } = useFiltros();
  const [visao, setVisao] = useState<Visao>("tabela");
  const [fonte, setFonte] = useState<string | null>(null);
  const [ordem, setOrdem] = useState<{ chave: Coluna["chave"]; desc: boolean }>({
    chave: "total",
    desc: true,
  });
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [gerandoXlsx, setGerandoXlsx] = useState(false);
  const [pagina, setPagina] = useState(0);

  // O filtro por fonte vale só na visão detalhada — é lá que as ações, e
  // portanto as fontes, aparecem. Na tabela por órgão `fonteAtiva` é sempre
  // nula, então tudo abaixo se reduz aos órgãos filtrados de sempre.
  const fonteAtiva = visao === "detalhado" ? fonte : null;

  const fontes = useMemo(
    () => fontesDisponiveis(orgaosFiltrados, aplicacoesDe),
    [aplicacoesDe, orgaosFiltrados],
  );

  const recorte = useMemo(
    () => aplicarFonte(orgaosFiltrados, aplicacoesDe, fonteAtiva),
    [aplicacoesDe, fonteAtiva, orgaosFiltrados],
  );

  // Uma fonte selecionada some quando os filtros do painel mudam a ponto de
  // ela não existir mais no recorte — senão a tela ficaria vazia sem motivo
  // visível.
  if (fonte && !fontes.some((f) => f.fonte === fonte)) setFonte(null);

  const linhas = useMemo(() => {
    const copia = [...recorte.orgaos];
    const { chave, desc } = ordem;
    copia.sort((a, b) => {
      if (chave === "eixos") {
        const diff = Object.keys(a.eixos).length - Object.keys(b.eixos).length;
        return desc ? -diff : diff;
      }
      const va = a[chave];
      const vb = b[chave];
      if (typeof va === "number" && typeof vb === "number") {
        return desc ? vb - va : va - vb;
      }
      const cmp = String(va).localeCompare(String(vb), "pt-BR");
      return desc ? -cmp : cmp;
    });
    return copia;
  }, [ordem, recorte.orgaos]);

  // Ajuste de estado durante o render: quando a lista muda de identidade
  // (filtro ou ordenação), a página volta ao início. Um efeito aqui
  // renderizaria uma vez com a página errada antes de corrigir.
  const [linhasVistas, setLinhasVistas] = useState(linhas);
  if (linhas !== linhasVistas) {
    setLinhasVistas(linhas);
    setPagina(0);
  }

  const totalPaginas = Math.max(1, Math.ceil(linhas.length / TAMANHO_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaAtual * TAMANHO_PAGINA;
  const fim = Math.min(inicio + TAMANHO_PAGINA, linhas.length);
  const paginaDados = linhas.slice(inicio, fim);

  function alternar(chave: Coluna["chave"]) {
    setOrdem((atual) =>
      atual.chave === chave ? { chave, desc: !atual.desc } : { chave, desc: true },
    );
  }

  // Os dois formatos são detalhados até a aplicação, então saem iguais nas
  // duas visões — a planilha é de microdados e o PDF é o relatório por órgão.
  async function baixarXlsx() {
    setGerandoXlsx(true);
    try {
      await exportarXlsx(linhas, recorte.aplicacoesDe);
    } finally {
      setGerandoXlsx(false);
    }
  }

  async function baixarPdf() {
    setGerandoPdf(true);
    try {
      await exportarPdf(linhas, recorte.aplicacoesDe);
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <Card data-revelar>
      <CardHeader>
        <CardTitle className="text-base">Tabela detalhada</CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 flex flex-wrap items-start gap-2 self-start justify-self-end">
          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant={visao === "tabela" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setVisao("tabela");
                setFonte(null);
              }}
            >
              Tabela
            </Button>
            <Button
              variant={visao === "detalhado" ? "default" : "ghost"}
              size="sm"
              onClick={() => setVisao("detalhado")}
            >
              Detalhado
            </Button>
          </div>
          {/* Mesma moldura do seletor de visão ao lado — é o que iguala a
              altura dos dois grupos, já que o quadro soma a borda e o `p-1`
              à altura dos botões `sm`. */}
          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={baixarXlsx}
              disabled={linhas.length === 0 || gerandoXlsx}
            >
              <FileSpreadsheet className="size-4" />
              {gerandoXlsx ? "Gerando…" : "XLSX"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={baixarPdf}
              disabled={linhas.length === 0 || gerandoPdf}
            >
              <FileText className="size-4" />
              {gerandoPdf ? "Gerando…" : "PDF"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {visao === "detalhado" ? (
          <div className="flex flex-col gap-4">
            {fontes.length > 0 ? (
              <FiltroFonte
                fontes={fontes}
                fonte={fonte}
                definir={setFonte}
                total={resumo.total}
              />
            ) : null}
            <DetalhamentoAccordion
              orgaos={recorte.orgaos}
              aplicacoesDe={recorte.aplicacoesDe}
              fonte={fonteAtiva}
            />
          </div>
        ) : (
        <div className="flex flex-col gap-3">
        <div className="rounded-xl ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              {/* Faixa de fundo no cabeçalho, e o hover neutralizado para ela
                  não reagir como as linhas de dados. */}
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {COLUNAS.map((coluna) => {
                  const ativa = ordem.chave === coluna.chave;
                  return (
                    <TableHead
                      key={coluna.chave}
                      className={coluna.numerica ? "text-right" : undefined}
                    >
                      <button
                        type="button"
                        onClick={() => alternar(coluna.chave)}
                        aria-label={`Ordenar por ${coluna.rotulo}`}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground",
                          // Nas colunas de valor o ícone vai para a esquerda do
                          // rótulo, senão ele descolaria da borda direita.
                          coluna.numerica && "flex-row-reverse",
                          ativa && "text-foreground",
                        )}
                      >
                        {coluna.rotulo}
                        {ativa ? (
                          ordem.desc ? (
                            <ArrowDown className="size-3" />
                          ) : (
                            <ArrowUp className="size-3" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3 opacity-50" />
                        )}
                      </button>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginaDados.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUNAS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum órgão corresponde aos filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                paginaDados.map((orgao) => (
                  <TableRow key={orgao.nome}>
                    <TableCell className="max-w-80">
                      <span className="block font-medium">{orgao.sigla}</span>
                      <span className="block text-xs text-muted-foreground">
                        {orgao.codigo} · {orgao.intensidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatBRL(orgao.total)}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {formatPercentual(
                          resumo.total > 0 ? orgao.total / resumo.total : 0,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(orgao.exclusivo)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(orgao.naoExclusivo)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={orgao.tipo === "Exclusivo" ? "default" : "secondary"}
                      >
                        {orgao.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex flex-wrap gap-1">
                        {Object.keys(orgao.eixos)
                          .map(Number)
                          .sort((a, b) => a - b)
                          .map((numero) => {
                            const eixo = EIXOS.find((e) => e.numero === numero);
                            return (
                              <span
                                key={numero}
                                title={eixo?.rotulo}
                                className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs"
                              >
                                <span
                                  aria-hidden
                                  className="size-2 rounded-[2px]"
                                  style={{ backgroundColor: eixo?.cor }}
                                />
                                {eixo?.romano ?? numero}
                              </span>
                            );
                          })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé da tabela: contagem à esquerda, navegação de página à
            direita. Os botões de CSV e PDF continuam exportando a lista
            inteira, e não só a página visível. */}
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {linhas.length === 0 ? (
              "Nenhum órgão"
            ) : (
              <>
                Mostrando {inicio + 1}–{fim} de {linhas.length}{" "}
                {linhas.length === 1 ? "órgão" : "órgãos"} · total{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatBRL(resumo.total)}
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Página anterior"
              disabled={paginaAtual === 0}
              onClick={() => setPagina(paginaAtual - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="tabular-nums">
              {paginaAtual + 1} / {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Próxima página"
              disabled={paginaAtual >= totalPaginas - 1}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

type OpcaoFonte = { fonte: string; valor: number; acoes: number };

/**
 * Linha de filtro por fonte de recursos, no mesmo idioma das pílulas da aba
 * ODS. A diferença é de escala: são 43 fontes, e a distribuição é muito
 * concentrada (uma delas responde por quase metade do orçamento). Por isso só
 * as maiores ganham pílula; a cauda fica no popover.
 */
function FiltroFonte({
  fontes,
  fonte,
  definir,
  total,
}: {
  fontes: OpcaoFonte[];
  fonte: string | null;
  definir: (fonte: string | null) => void;
  /** Denominador das participações — o mesmo total exibido no rodapé da tabela. */
  total: number;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const destaque = fontes.slice(0, FONTES_EM_DESTAQUE);
  const resto = fontes.slice(FONTES_EM_DESTAQUE);

  // Uma fonte escolhida na lista completa não tem pílula própria; ela entra no
  // fim da linha para que a seleção ativa esteja sempre visível.
  const avulsa =
    fonte && !destaque.some((o) => o.fonte === fonte)
      ? fontes.find((o) => o.fonte === fonte)
      : undefined;

  const filtradas = busca.trim()
    ? resto.filter((o) => o.fonte.includes(busca.trim()))
    : resto;

  function escolher(codigo: string | null) {
    definir(codigo);
    setAberto(false);
    setBusca("");
  }

  return (
    <div
      role="group"
      aria-label="Filtrar por fonte de recursos"
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-sm font-medium text-muted-foreground">Fonte:</span>

      <button
        type="button"
        onClick={() => escolher(null)}
        aria-pressed={fonte === null}
        className={cn(PILULA_BASE, fonte === null ? PILULA_ATIVA : PILULA_INATIVA)}
      >
        Todas
      </button>

      {[...destaque, ...(avulsa ? [avulsa] : [])].map((opcao) => (
        <PilulaFonte
          key={opcao.fonte}
          opcao={opcao}
          total={total}
          ativa={fonte === opcao.fonte}
          onClick={() => escolher(opcao.fonte)}
        />
      ))}

      {resto.length > 0 ? (
        <Popover open={aberto} onOpenChange={setAberto}>
          <PopoverTrigger
            className={cn(PILULA_BASE, PILULA_INATIVA)}
            aria-label={`Ver as outras ${resto.length} fontes`}
          >
            + {resto.length} {resto.length === 1 ? "fonte" : "fontes"}
            <ChevronDown className="size-3" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar código da fonte..."
                aria-label="Buscar fonte de recursos"
                className="pl-9"
              />
            </div>

            <ul className="mt-2 max-h-72 overflow-y-auto">
              {filtradas.length === 0 ? (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Nenhuma fonte com esse código.
                </li>
              ) : (
                filtradas.map((opcao) => (
                  <li key={opcao.fonte}>
                    <button
                      type="button"
                      onClick={() => escolher(opcao.fonte)}
                      aria-pressed={fonte === opcao.fonte}
                      className={cn(
                        "flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                        fonte === opcao.fonte && "bg-muted font-medium",
                      )}
                    >
                      <span className="tabular-nums">{opcao.fonte}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatCompactoBRL(opcao.valor)} ·{" "}
                        {formatPercentual(total > 0 ? opcao.valor / total : 0)}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
}

function PilulaFonte({
  opcao,
  total,
  ativa,
  onClick,
}: {
  opcao: OpcaoFonte;
  total: number;
  ativa: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativa}
      title={`${formatBRL(opcao.valor)} · ${opcao.acoes} ${
        opcao.acoes === 1 ? "ação" : "ações"
      }`}
      className={cn(PILULA_BASE, ativa ? PILULA_ATIVA : PILULA_INATIVA)}
    >
      <span className="tabular-nums">{opcao.fonte}</span>
      <span className={cn("tabular-nums", !ativa && "text-muted-foreground/70")}>
        · {formatPercentual(total > 0 ? opcao.valor / total : 0)}
      </span>
    </button>
  );
}
