"use client";

import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Scale,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { SeletorNormas, ListaNormas } from "@/components/painel/acervo-normas";
import { TODOS } from "@/components/painel/filtros-context";
import { GraficoSerieLOA } from "@/components/painel/graficos/serie-loa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANOS_NORMAS,
  META_LEIS,
  NORMAS,
  NORMA_POR_EXERCICIO,
  SERIE_LOA,
  TOTAL_POR_TIPO,
  type Norma,
  type TipoNorma,
} from "@/data/historico-leis";
import { CORES_NORMA, DESCRICOES_NORMA, ICONES_NORMA } from "@/lib/normas";
import { cn } from "@/lib/utils";

/**
 * O ano pelo qual a norma se ordena e se agrupa por década.
 *
 * Uma LOA é sancionada no fim do ano anterior ao que orça, e uma LDO no meio —
 * ordenar pela assinatura embaralharia a série (a LOA de 2022 é de dezembro de
 * 2021, e viria depois da LOA de 2021, de janeiro do mesmo ano). Para as leis
 * orçamentárias vale o exercício, e para o PPA o primeiro ano do quadriênio:
 * é o período de que a norma trata, e é o que aparece na etiqueta do cartão.
 */
const anoReferencia = (norma: Norma) =>
  norma.exercicio ?? norma.quadrienio?.[0] ?? norma.ano;

const ORDENS = {
  recentes: "Mais recentes",
  antigas: "Mais antigas",
  numero: "Número da norma",
} as const;
type Ordem = keyof typeof ORDENS;

/** Doze fecham seis cartões em cada coluna do `xl:columns-2`. */
const TAMANHO_PAGINA = 12;

/**
 * O acervo normativo climático do Estado.
 *
 * O estado desta aba é local, e não da query string como o resto do painel: os
 * filtros do `filtros-context` recortam o orçamento de 2026 por eixo, órgão e
 * classificação, e nenhum deles tem sentido sobre um acervo de leis. Manter os
 * dois conjuntos separados evita que limpar um filtro daqui apague o recorte
 * que o usuário montou nas outras abas.
 */
export function AbaHistorico() {
  const [tipo, setTipo] = useState<TipoNorma | null>(null);
  const [busca, setBusca] = useState("");
  const [decada, setDecada] = useState<string>(TODOS);
  const [ordem, setOrdem] = useState<Ordem>("recentes");
  const [foco, setFoco] = useState<{ normaId: string; exercicio: number } | null>(null);
  const [pagina, setPagina] = useState(0);

  const doTipo = useMemo(
    () => (tipo ? NORMAS.filter((n) => n.tipo === tipo) : []),
    [tipo],
  );

  // Só as décadas que existem no tipo escolhido, com quantas normas cada uma
  // guarda — uma lista fixa de 1960 a 2020 ofereceria recortes vazios.
  const decadas = useMemo(() => {
    const conta = new Map<number, number>();
    for (const norma of doTipo) {
      const d = Math.floor(anoReferencia(norma) / 10) * 10;
      conta.set(d, (conta.get(d) ?? 0) + 1);
    }
    return [...conta.entries()].sort((a, b) => b[0] - a[0]);
  }, [doTipo]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = doTipo.filter((norma) => {
      if (
        decada !== TODOS &&
        Math.floor(anoReferencia(norma) / 10) * 10 !== Number(decada)
      ) {
        return false;
      }
      if (!termo) return true;
      return (
        norma.ementa.toLowerCase().includes(termo) ||
        norma.numero.toLowerCase().includes(termo) ||
        norma.especie.toLowerCase().includes(termo) ||
        String(norma.ano).includes(termo) ||
        String(norma.exercicio ?? "").includes(termo) ||
        (norma.orgaos?.toLowerCase().includes(termo) ?? false) ||
        norma.metas.some((m) => m.toLowerCase().includes(termo)) ||
        norma.citacoes.some((c) => c.descritor.toLowerCase().includes(termo))
      );
    });

    // "4.282" é texto com ponto: ordenar como número, senão "1.043" cai
    // depois de "999".
    const soNumero = (valor: string) => Number(valor.replace(/\D/g, "")) || 0;

    return [...lista].sort((a, b) => {
      if (ordem === "numero") return soNumero(b.numero) - soNumero(a.numero);
      const diferenca = anoReferencia(a) - anoReferencia(b);
      return ordem === "antigas" ? diferenca : -diferenca;
    });
  }, [busca, decada, doTipo, ordem]);

  const filtroAtivo = busca.trim().length > 0 || decada !== TODOS;
  const podeLimpar = filtroAtivo || ordem !== "recentes";

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / TAMANHO_PAGINA));

  // Com um cartão em foco, quem manda na página é ele; sem foco, vale a página
  // que o usuário escolheu. Derivar em vez de guardar é o que faz o clique no
  // gráfico funcionar: ele pode limpar os filtros, e a lista resultante só
  // existe no render seguinte — calcular a página dentro do handler leria a
  // lista velha e pararia na página errada.
  const indiceFoco = foco ? filtradas.findIndex((n) => n.id === foco.normaId) : -1;
  const paginaAtual =
    indiceFoco >= 0
      ? Math.floor(indiceFoco / TAMANHO_PAGINA)
      : Math.min(pagina, totalPaginas - 1);
  const inicio = paginaAtual * TAMANHO_PAGINA;
  const fim = Math.min(inicio + TAMANHO_PAGINA, filtradas.length);
  const daPagina = filtradas.slice(inicio, fim);

  // Trocar de página desfaz o foco: sem isso a página derivada acima puxaria de
  // volta para a do cartão focado, e as setas pareceriam quebradas.
  const irParaPagina = (proxima: number) => {
    setFoco(null);
    setPagina(proxima);
  };

  const limparFiltros = () => {
    setFoco(null);
    setPagina(0);
    setBusca("");
    setDecada(TODOS);
    setOrdem("recentes");
  };

  const escolherTipo = (proximo: TipoNorma | null) => {
    limparFiltros();
    setTipo(proximo);
  };

  // O elo entre o gráfico e a lista: a barra do exercício aponta para a lei
  // que o instituiu, que é sancionada no ano anterior.
  const irParaExercicio = (exercicio: number) => {
    const normaId = NORMA_POR_EXERCICIO.get(exercicio);
    if (!normaId) return;
    if (foco?.exercicio === exercicio) {
      setFoco(null);
      return;
    }
    if (!filtradas.some((n) => n.id === normaId)) limparFiltros();
    setFoco({ normaId, exercicio });
  };

  const anoMaisAntigo = ANOS_NORMAS[ANOS_NORMAS.length - 1];
  const anoMaisNovo = ANOS_NORMAS[0];
  const IconeTipo = tipo ? ICONES_NORMA[tipo] : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Indicador
          icone={Scale}
          titulo="Normas mapeadas"
          valor={String(META_LEIS.normas)}
          subtitulo="leis, decretos e planos com recorte ambiental e climático"
        />
        <Indicador
          icone={CalendarRange}
          titulo="Período coberto"
          valor={`${anoMaisAntigo}–${anoMaisNovo}`}
          subtitulo={`${anoMaisNovo - anoMaisAntigo} anos de legislação`}
        />
        <Indicador
          icone={Landmark}
          titulo="Instrumentos de planejamento"
          valor={String(
            TOTAL_POR_TIPO.PPA + TOTAL_POR_TIPO.LDO + TOTAL_POR_TIPO.LOA,
          )}
          subtitulo="entre PPAs, LDOs e LOAs"
        />
      </div>

      <Card data-revelar>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Acervo normativo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha um tipo de norma para percorrer o acervo. O levantamento
              partiu de descritores como &ldquo;mudanças climáticas&rdquo;,
              &ldquo;carbono&rdquo;, &ldquo;povos indígenas&rdquo; e
              &ldquo;bioeconomia&rdquo; para achar cada norma.
            </p>
          </div>

          <SeletorNormas
            selecionado={tipo}
            totais={TOTAL_POR_TIPO}
            aoSelecionar={escolherTipo}
          />
        </CardContent>
      </Card>

      {tipo ? (
        <div className="space-y-4 revelar-entrada">
          {/* `py-0` e `overflow-hidden` para a faixa colorida encostar na borda
              do cartão: sem isso o padding do Card deixaria uma tira branca
              acima dela. */}
          <Card className="gap-0 overflow-hidden py-0">
            {/* `overflow-hidden` próprio, e não só o do Card: sem ele a
                marca-d'água vazaria da faixa para o corpo branco de baixo. */}
            <div
              className="relative flex flex-col gap-1.5 overflow-hidden p-4"
              style={{
                background: `color-mix(in oklab, ${CORES_NORMA[tipo]} 20%, var(--card))`,
              }}
            >
              {/* Marca-d'água no canto direito, por trás do "Fechar". Fica
                  centrada na vertical e não sangra pelo canto como a dos
                  botões do seletor: a faixa tem 90px de altura, e um ícone
                  grande o bastante para vazar mostraria só uma tira do meio. */}
              {IconeTipo ? (
                <IconeTipo
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 -right-3 size-20 -translate-y-1/2 opacity-20"
                  style={{ color: CORES_NORMA[tipo] }}
                  strokeWidth={1.25}
                />
              ) : null}
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{tipo}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => escolherTipo(null)}
                  className="shrink-0"
                >
                  <X className="size-4" />
                  Fechar
                </Button>
              </div>
              <p className="relative text-sm text-muted-foreground">
                {DESCRICOES_NORMA[tipo]}
              </p>
            </div>

            <CardContent className="space-y-4 py-4">
              <form
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="busca-normas">Buscar</Label>
                  <div className="relative">
                    <Search
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="busca-normas"
                      value={busca}
                      onChange={(e) => {
                        setFoco(null);
                        setPagina(0);
                        setBusca(e.target.value);
                      }}
                      placeholder="Ementa, número, órgão…"
                      className="px-9"
                    />
                    {busca ? (
                      <button
                        type="button"
                        aria-label="Limpar busca"
                        onClick={() => {
                          setPagina(0);
                          setBusca("");
                        }}
                        className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decada-normas">Década</Label>
                  <Select
                    value={decada}
                    onValueChange={(valor) => {
                      setFoco(null);
                      setPagina(0);
                      setDecada(valor);
                    }}
                  >
                    <SelectTrigger id="decada-normas" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TODOS}>
                        Todas as décadas ({doTipo.length})
                      </SelectItem>
                      {decadas.map(([inicio, total]) => (
                        <SelectItem key={inicio} value={String(inicio)}>
                          {inicio} ({total})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordem-normas">Ordenar por</Label>
                  <Select
                    value={ordem}
                    onValueChange={(valor) => {
                      setFoco(null);
                      setPagina(0);
                      setOrdem(valor as Ordem);
                    }}
                  >
                    <SelectTrigger id="ordem-normas" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDENS).map(([chave, rotulo]) => (
                        <SelectItem key={chave} value={chave}>
                          {rotulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>

              {/* A contagem vive no rodapé da lista, junto da navegação de
                  página — aqui fica só a saída dos filtros. Sem nada a limpar,
                  a linha inteira sai, para não deixar um vão no cartão. */}
              {podeLimpar ? (
                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="sm" onClick={limparFiltros}>
                    <X className="size-4" />
                    Limpar filtros
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {tipo === "LOA" && SERIE_LOA.length > 0 ? (
            <GraficoSerieLOA
              exercicioEmFoco={foco?.exercicio ?? null}
              aoEscolherExercicio={irParaExercicio}
            />
          ) : null}

          <ListaNormas normas={daPagina} normaFoco={foco?.normaId ?? null} />

          {/* Rodapé da lista, no padrão da Tabela Detalhada: contagem à
              esquerda, navegação à direita. Sobre uma superfície própria, e não
              solto: aqui embaixo o fundo é a foto do painel, onde texto em
              `muted-foreground` some. */}
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
            <span>
              {filtradas.length === 0 ? (
                "Nenhuma norma"
              ) : (
                <>
                  Mostrando{" "}
                  <span className="tabular-nums">
                    {inicio + 1}–{fim}
                  </span>{" "}
                  de <span className="tabular-nums">{filtradas.length}</span>{" "}
                  {filtradas.length === 1 ? "norma" : "normas"}
                  {filtroAtivo ? ` (de ${doTipo.length} no total)` : ""}
                </>
              )}
            </span>
            {totalPaginas > 1 ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Página anterior"
                  disabled={paginaAtual === 0}
                  onClick={() => irParaPagina(paginaAtual - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="px-1 tabular-nums">
                  {paginaAtual + 1} / {totalPaginas}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Próxima página"
                  disabled={paginaAtual >= totalPaginas - 1}
                  onClick={() => irParaPagina(paginaAtual + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Num cartão, e não solta sobre a foto como o aviso da aba ODS: aquela
          seção é curta e sempre cai sobre a imagem, enquanto esta nota fecha
          uma página que cresce com o acervo — ora sobre a foto escura, ora
          sobre o fundo claro. Só o cartão é legível nos dois casos. */}
      <Card data-revelar>
        <CardContent>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Fonte: {META_LEIS.origem} sobre a base do{" "}
            <a
              href="https://legis.ac.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-primary hover:underline"
            >
              legis.ac.gov.br
            </a>
            . São {META_LEIS.normas} normas, atualizadas em{" "}
            {META_LEIS.atualizacoes
              .map((a) => a.atualizadoEm)
              .filter(Boolean)
              .sort()
              .at(-1)
              ?.split("-")
              .reverse()
              .join("/") ?? "—"}
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Indicador({
  icone: Icone,
  titulo,
  valor,
  subtitulo,
}: {
  icone: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  titulo: string;
  valor: string;
  subtitulo: string;
}) {
  return (
    <Card data-revelar className="relative overflow-hidden">
      <CardContent>
        <Icone
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-3 -bottom-3 size-24 text-primary opacity-10",
          )}
          strokeWidth={1.25}
        />
        <p className="text-sm text-muted-foreground">{titulo}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{valor}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitulo}</p>
      </CardContent>
    </Card>
  );
}
