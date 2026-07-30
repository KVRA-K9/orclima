"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DetalhamentoAccordion } from "@/components/painel/detalhamento-accordion";
import { useFiltros } from "@/components/painel/filtros-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EIXOS } from "@/data/eixos";
import { exportarPdf, exportarXlsx } from "@/lib/export";
import { formatBRL, formatPercentual } from "@/lib/format";
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

export function AbaDetalhamento() {
  const { orgaosFiltrados, resumo, aplicacoesDe } = useFiltros();
  const [visao, setVisao] = useState<Visao>("tabela");
  const [ordem, setOrdem] = useState<{ chave: Coluna["chave"]; desc: boolean }>({
    chave: "total",
    desc: true,
  });
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [gerandoXlsx, setGerandoXlsx] = useState(false);
  const [pagina, setPagina] = useState(0);

  const linhas = useMemo(() => {
    const copia = [...orgaosFiltrados];
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
  }, [ordem, orgaosFiltrados]);

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
      await exportarXlsx(linhas, aplicacoesDe);
    } finally {
      setGerandoXlsx(false);
    }
  }

  async function baixarPdf() {
    setGerandoPdf(true);
    try {
      await exportarPdf(linhas, aplicacoesDe);
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tabela detalhada</CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 flex flex-wrap items-start gap-2 self-start justify-self-end">
          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant={visao === "tabela" ? "default" : "ghost"}
              size="sm"
              onClick={() => setVisao("tabela")}
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
          <DetalhamentoAccordion />
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
