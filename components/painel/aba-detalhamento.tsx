"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
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
import { aplicarFonte, fontesDisponiveis, resumoDe } from "@/lib/data";
import { normalizar } from "@/lib/texto";
import { exportarPdf, exportarXlsx } from "@/lib/export";
import { useI18n } from "@/lib/i18n/cliente";
import { rotuloDoEixo, rotuloIntensidade } from "@/lib/i18n/conteudo";
import {
  formatBRL,
  formatCompactoBRL,
  formatParticipacao,
  formatPercentual,
} from "@/lib/format";
import type { Aplicacao, Orgao } from "@/lib/types";
import { cn } from "@/lib/utils";

type Visao = "tabela" | "detalhado";

type Coluna = {
  chave: keyof Orgao | "eixos";
  rotulo: string;
  numerica?: boolean;
};

/** Linhas por página, como na tabela do OCAD. */
const TAMANHO_PAGINA = 10;

/**
 * Onde a lista de fontes corta entre "Maiores" e "Demais". Seis cobrem cerca
 * de 80% do orçamento; o resto é uma cauda longa, que só fica legível quando
 * as barras são escaladas separadamente das grandes.
 */
const FONTES_EM_DESTAQUE = 6;

/** Identidade estável para "nenhuma fonte", que os `useMemo` usam de dependência. */
const VAZIO: string[] = [];

export function AbaDetalhamento() {
  const { orgaosFiltrados, resumo, aplicacoesDe } = useFiltros();
  const { t, lang } = useI18n();
  const textos = t.painel.detalhamento;

  const colunas: Coluna[] = [
    { chave: "nome", rotulo: textos.colunas.nome },
    { chave: "total", rotulo: textos.colunas.total, numerica: true },
    { chave: "exclusivo", rotulo: textos.colunas.exclusivo, numerica: true },
    { chave: "naoExclusivo", rotulo: textos.colunas.naoExclusivo, numerica: true },
    { chave: "tipo", rotulo: textos.colunas.tipo },
    { chave: "eixos", rotulo: textos.colunas.eixos },
  ];

  const [visao, setVisao] = useState<Visao>("tabela");
  const [fontesEscolhidas, setFontesEscolhidas] = useState<string[]>([]);
  const [ordem, setOrdem] = useState<{ chave: Coluna["chave"]; desc: boolean }>({
    chave: "total",
    desc: true,
  });
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [gerandoXlsx, setGerandoXlsx] = useState(false);
  const [pagina, setPagina] = useState(0);

  // O filtro por fonte vale só na visão detalhada — é lá que as ações, e
  // portanto as fontes, aparecem. Na tabela por órgão a lista é sempre vazia,
  // então tudo abaixo se reduz aos órgãos filtrados de sempre.
  const fontesAtivas = visao === "detalhado" ? fontesEscolhidas : VAZIO;

  const fontes = useMemo(
    () => fontesDisponiveis(orgaosFiltrados, aplicacoesDe),
    [aplicacoesDe, orgaosFiltrados],
  );

  const recorte = useMemo(
    () => aplicarFonte(orgaosFiltrados, aplicacoesDe, fontesAtivas),
    [aplicacoesDe, fontesAtivas, orgaosFiltrados],
  );

  const selecionadas = useMemo(
    () => fontes.filter((f) => fontesAtivas.includes(f.fonte)),
    [fontes, fontesAtivas],
  );

  // Uma fonte escolhida pode sumir quando os filtros do painel mudam. Podamos
  // só as que sumiram — zerar a seleção inteira faria o usuário perder as
  // outras sem motivo visível.
  const sobreviventes = fontesEscolhidas.filter((f) =>
    fontes.some((o) => o.fonte === f),
  );
  if (sobreviventes.length !== fontesEscolhidas.length) {
    setFontesEscolhidas(sobreviventes);
  }

  function alternarFonte(codigo: string) {
    setFontesEscolhidas((atuais) =>
      atuais.includes(codigo)
        ? atuais.filter((f) => f !== codigo)
        : [...atuais, codigo],
    );
  }

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
      await exportarXlsx(linhas, recorte.aplicacoesDe, lang);
    } finally {
      setGerandoXlsx(false);
    }
  }

  async function baixarPdf() {
    setGerandoPdf(true);
    try {
      await exportarPdf(linhas, recorte.aplicacoesDe, lang);
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <Card data-revelar>
      <CardHeader>
        <CardTitle className="text-base">{textos.titulo}</CardTitle>
        <div className="col-start-2 row-span-2 row-start-1 flex flex-wrap items-start gap-2 self-start justify-self-end">
          {/* A fonte de recursos só existe no grão da ação, então o filtro
              acompanha a visão detalhada. É um botão só: as 43 fontes moram
              todas dentro do popover.

              Ele vem PRIMEIRO de propósito. A barra é ancorada à direita, então
              um grupo que nasce aqui cresce para a esquerda, sobre espaço
              vazio, e os dois grupos seguintes não saem do lugar. Entre o
              alternador e os botões de exportação, como estava, o alternador
              pulava para a esquerda no instante do clique — o botão fugia de
              baixo do cursor. */}
          {visao === "detalhado" && fontes.length > 0 ? (
            <div className="flex gap-1 rounded-lg border border-border p-1 motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-out motion-safe:fade-in-0">
              <FiltroFonte
                fontes={fontes}
                escolhidas={fontesAtivas}
                alternar={alternarFonte}
                limpar={() => setFontesEscolhidas(VAZIO)}
                total={resumo.total}
              />
            </div>
          ) : null}

          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant={visao === "tabela" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setVisao("tabela");
                setFontesEscolhidas(VAZIO);
              }}
            >
              {textos.visao.tabela}
            </Button>
            <Button
              variant={visao === "detalhado" ? "default" : "ghost"}
              size="sm"
              onClick={() => setVisao("detalhado")}
            >
              {textos.visao.detalhado}
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
              {gerandoXlsx ? textos.gerando : "XLSX"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={baixarPdf}
              disabled={linhas.length === 0 || gerandoPdf}
            >
              <FileText className="size-4" />
              {gerandoPdf ? textos.gerando : "PDF"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Trocar de visão é um gesto, não um corte. O bloco que chega usa o
            mesmo desenho da revelação da página — só opacidade e um
            deslocamento curto, `ease-out` —, e o `key` força a remontagem para
            que ele rode a cada troca. Meio rem em vez de um: a mudança é
            dentro de um cartão, não a entrada de uma seção inteira.

            A altura muda muito entre as duas visões (10 linhas contra 58
            órgãos) e isso é inerente; o que a animação resolve é o corte seco,
            dando ao olho um instante para acompanhar de onde veio o conteúdo. */}
        <div
          key={visao}
          className="motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-out motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2"
        >
        {visao === "detalhado" ? (
          <div className="flex flex-col gap-4">
            {selecionadas.length > 0 ? (
              <FichaFonte
                opcoes={selecionadas}
                orgaos={recorte.orgaos}
                aplicacoesDe={recorte.aplicacoesDe}
                total={resumo.total}
              />
            ) : null}
            <DetalhamentoAccordion
              orgaos={recorte.orgaos}
              aplicacoesDe={recorte.aplicacoesDe}
              fontes={fontesAtivas}
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
                {colunas.map((coluna) => {
                  const ativa = ordem.chave === coluna.chave;
                  return (
                    <TableHead
                      key={coluna.chave}
                      className={coluna.numerica ? "text-right" : undefined}
                    >
                      <button
                        type="button"
                        onClick={() => alternar(coluna.chave)}
                        aria-label={textos.ordenarPor(coluna.rotulo)}
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
                    colSpan={colunas.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t.painel.semOrgaos}
                  </TableCell>
                </TableRow>
              ) : (
                paginaDados.map((orgao) => (
                  <TableRow key={orgao.nome}>
                    <TableCell className="max-w-80">
                      <span className="block font-medium">{orgao.sigla}</span>
                      <span className="block text-xs text-muted-foreground">
                        {orgao.codigo} · {rotuloIntensidade(orgao.intensidade, t.dados)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatBRL(orgao.total, lang)}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {formatPercentual(
                          resumo.total > 0 ? orgao.total / resumo.total : 0,
                          1,
                          lang,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(orgao.exclusivo, lang)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatBRL(orgao.naoExclusivo, lang)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={orgao.tipo === "Exclusivo" ? "default" : "secondary"}
                      >
                        {t.dados.tipoDotacao[orgao.tipo]}
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
                                title={rotuloDoEixo(numero, eixo?.rotulo ?? "", lang)}
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
              textos.rodape.nenhum
            ) : (
              <>
                {textos.rodape.mostrando(
                  inicio + 1,
                  fim,
                  linhas.length,
                  textos.rodape.palavra(linhas.length),
                )}{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatBRL(resumo.total, lang)}
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.comum.paginaAnterior}
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
              aria-label={t.comum.proximaPagina}
              disabled={paginaAtual >= totalPaginas - 1}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
}

type OpcaoFonte = { fonte: string; nome: string; valor: number; acoes: number };

/**
 * Identificação das fontes selecionadas. O número sozinho é opaco, e o nome não
 * cabe na pílula — as descrições têm mediana de 37 caracteres e chegam a 100 —,
 * então ele ganha lugar próprio aqui, junto dos números do recorte e da
 * ressalva sobre o rateio.
 */
function FichaFonte({
  opcoes,
  orgaos,
  aplicacoesDe,
  total,
}: {
  opcoes: OpcaoFonte[];
  /** Órgãos já recortados — a origem do agregado. */
  orgaos: Orgao[];
  aplicacoesDe: (orgao: string) => Record<string, Aplicacao[]>;
  total: number;
}) {
  const { t, lang } = useI18n();
  const textos = t.painel.detalhamento.fichaFonte;

  // O agregado sai do recorte, e não da soma dos valores por fonte: uma ação
  // custeada por duas fontes selecionadas seria contada duas vezes.
  const { valor, acoes } = useMemo(() => {
    let acoes = 0;
    for (const orgao of orgaos) {
      for (const lista of Object.values(aplicacoesDe(orgao.nome))) acoes += lista.length;
    }
    return { valor: resumoDe(orgaos).total, acoes };
  }, [aplicacoesDe, orgaos]);

  const varias = opcoes.length > 1;

  return (
    <div className="rounded-lg border-l-2 border-primary/40 bg-primary/15 p-3 dark:bg-primary/10">
      <p className="text-xs font-medium tracking-wide text-muted-foreground tabular-nums">
        {varias ? textos.varias(opcoes.length) : textos.uma(opcoes[0].fonte)}
      </p>

      {varias ? null : (
        <p className="mt-0.5 text-sm leading-snug font-medium">{opcoes[0].nome}</p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground tabular-nums">
          {formatBRL(valor, lang)}
        </span>{" "}
        · {formatParticipacao(total > 0 ? valor / total : 0, 1, lang)}{" "}
        {textos.doRecorte} · {acoes} {textos.acoes(acoes)}
      </p>

      {varias ? (
        <ul className="mt-3 flex flex-col gap-1 border-t border-primary/25 pt-2">
          {opcoes.map((opcao) => (
            <li
              key={opcao.fonte}
              className="flex items-baseline justify-between gap-3 text-xs"
            >
              <span className="min-w-0">
                <span className="font-medium tabular-nums">{opcao.fonte}</span>{" "}
                <span className="text-muted-foreground">{opcao.nome}</span>
              </span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {formatCompactoBRL(opcao.valor, lang)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-xs text-muted-foreground">
        {varias ? textos.rateioVaria : textos.rateioUma}
      </p>
    </div>
  );
}

/**
 * Filtro por fonte de recursos: um botão no cabeçalho que abre a lista das 43.
 *
 * A lista vai em duas seções, "Maiores" e "Demais", cada uma escalando as
 * barras pela sua própria maior. Numa régua única a `15000100` (46,5% do
 * orçamento) achataria as outras 42 — o percentual ao lado é que segue sempre
 * sobre o total, então a separação organiza sem enganar.
 */
function FiltroFonte({
  fontes,
  escolhidas,
  alternar,
  limpar,
  total,
}: {
  fontes: OpcaoFonte[];
  escolhidas: string[];
  alternar: (fonte: string) => void;
  limpar: () => void;
  /** Denominador das participações — o mesmo total exibido no rodapé da tabela. */
  total: number;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const { t } = useI18n();
  const textos = t.painel.detalhamento.filtroFonte;

  // A seção de cada fonte vem do posto no orçamento inteiro, e não da posição
  // entre os resultados: senão buscar "fundo" listaria o Fundo Amazônia (2,8%)
  // sob "Maiores". `fontes` já vem ordenada por valor decrescente de
  // `fontesDisponiveis`, então o corte é por índice.
  const maiores = fontes.slice(0, FONTES_EM_DESTAQUE);
  const demais = fontes.slice(FONTES_EM_DESTAQUE);

  // Busca por código ou nome, sem acento: "credito" acha OPERAÇÕES DE CRÉDITO.
  const termo = normalizar(busca.trim());
  const casa = (lista: OpcaoFonte[]) =>
    termo ? lista.filter((o) => normalizar(`${o.fonte} ${o.nome}`).includes(termo)) : lista;

  const secoes = [
    { titulo: textos.maiores, itens: casa(maiores) },
    { titulo: textos.demais, itens: casa(demais) },
  ].filter((secao) => secao.itens.length > 0);

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={textos.aria}>
          {textos.botao}
          {escolhidas.length > 0 ? (
            <span className="tabular-nums">· {escolhidas.length}</span>
          ) : null}
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder={textos.placeholder}
            aria-label={textos.ariaBusca}
            className="pl-9"
          />
        </div>

        {escolhidas.length > 0 ? (
          <div className="mt-2 flex items-center justify-between gap-2 px-2 text-xs text-muted-foreground">
            <span>{textos.selecionadas(escolhidas.length)}</span>
            <button
              type="button"
              onClick={limpar}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {textos.limpar}
            </button>
          </div>
        ) : null}

        <div className="mt-2 max-h-80 overflow-y-auto">
          {secoes.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {textos.vazio}
            </p>
          ) : (
            secoes.map((secao) => (
              <SecaoFontes
                key={secao.titulo}
                titulo={secao.titulo}
                itens={secao.itens}
                escolhidas={escolhidas}
                alternar={alternar}
                total={total}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Um bloco da lista, com régua própria: a barra de cada linha é proporcional à
 * maior fonte DA SEÇÃO, não ao total nem à maior de todas. É o que devolve
 * legibilidade à cauda, onde a maior vale 2,8% do orçamento.
 */
function SecaoFontes({
  titulo,
  itens,
  escolhidas,
  alternar,
  total,
}: {
  titulo: string;
  itens: OpcaoFonte[];
  escolhidas: string[];
  alternar: (fonte: string) => void;
  total: number;
}) {
  const teto = Math.max(...itens.map((o) => o.valor), 0);

  return (
    <>
      <p className="sticky top-0 z-10 bg-popover px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {titulo}
      </p>
      <ul>
        {itens.map((opcao) => (
          <li key={opcao.fonte}>
            <LinhaFonte
              opcao={opcao}
              total={total}
              teto={teto}
              marcada={escolhidas.includes(opcao.fonte)}
              onClick={() => alternar(opcao.fonte)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Uma fonte na lista completa. O popover não fecha ao clicar — a seleção é
 * múltipla, e fechar a cada escolha tornaria impossível montar um conjunto.
 */
function LinhaFonte({
  opcao,
  total,
  teto,
  marcada,
  onClick,
}: {
  opcao: OpcaoFonte;
  total: number;
  /** Maior valor da lista, que define a barra cheia. */
  teto: number;
  marcada: boolean;
  onClick: () => void;
}) {
  const { lang } = useI18n();
  // Um piso de 2% de largura mantém visível a barra das menores fontes, que de
  // outro modo desapareceriam: nesta lista a maior vale 4.243× a menor.
  const largura = teto > 0 ? Math.max((opcao.valor / teto) * 100, 2) : 0;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={marcada}
      onClick={onClick}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          marcada ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {marcada ? <Check className="size-3" /> : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3 text-sm">
          <span className={cn("tabular-nums", marcada && "font-medium")}>
            {opcao.fonte}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatCompactoBRL(opcao.valor, lang)} ·{" "}
            {formatParticipacao(total > 0 ? opcao.valor / total : 0, 1, lang)}
          </span>
        </span>

        <span aria-hidden className="mt-1 block h-1 rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-primary/60"
            style={{ width: `${largura}%` }}
          />
        </span>

        <span className="mt-1 line-clamp-2 block text-xs leading-snug text-muted-foreground">
          {opcao.nome}
        </span>
      </span>
    </button>
  );
}
