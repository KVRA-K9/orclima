/**
 * Confronta os status embutidos nos textos de `data/ods.ts` com o portal ODS
 * Brasil — o mesmo endpoint (`/objetivo/MetadadosAPIMeta?n=N`) que a página de
 * cada objetivo usa para montar a lista.
 *
 *   npm run ods:verificar
 *
 * Por que importa: o status do texto alimenta o filtro "Situação" da aba ODS e
 * decide quem ganha link para a ficha no portal (só os produzidos) — status
 * velho é filtro torto e link furado. Os status do portal mudam com o tempo:
 * a checagem que criou este script já achou três defasados (3.9.1 e 11.6.2
 * passaram a produzidos; 5.a.2, a sem dados).
 *
 * Sai com código 1 se houver divergência ou sem correspondência — dado
 * auditável, não plausível (a cascata de `docs/02-ARQUITETURA-DE-DADOS.md`).
 */
import { ODS } from "../data/ods.ts";

type StatusNosso = "produzido" | "construcao" | "sem-dados";

/** Igual ao `statusDoIndicador` de `lib/ods.ts` — replicado porque `lib/` usa
 *  aliases `@/` que o Node não resolve. Se um dia divergirem, é bug aqui. */
const statusDoTexto = (texto: string): StatusNosso => {
  const t = texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  if (t.includes("(em construcao)")) return "construcao";
  if (t.includes("(sem dados)")) return "sem-dados";
  return "produzido";
};

/** "Indicador C15.1.c: …" -> "C15.1.c" — o mesmo recorte de `derivarIndicador`.
 *  O "C" inicial é parte do código no portal (existe em "Cobertura das áreas
 *  terrestres protegidas…"): descartá-lo gera correspondência perdida. */
const codigoDe = (texto: string): string | null => {
  const corte = texto.indexOf(":");
  if (corte <= 0) return null;
  return texto.slice(0, corte).match(/[Cc]?\d+(?:\.[0-9A-Za-z]+)+/)?.[0] ?? null;
};

const SITE_PARA_NOSSO: Record<string, StatusNosso> = {
  Produzido: "produzido",
  "Em análise/construção": "construcao",
  "Sem dados": "sem-dados",
};

const RAIZ = "https://odsbrasil.gov.br";

const nossos = new Map<string, { status: StatusNosso; ods: number }>();
for (const ods of ODS) {
  for (const indicador of ods.indicadores) {
    const codigo = codigoDe(indicador.texto);
    if (codigo) nossos.set(codigo, { status: statusDoTexto(indicador.texto), ods: ods.numero });
  }
}

const site = new Map<string, { status: string | null; ficha: boolean }>();
for (let n = 1; n <= 18; n++) {
  const resposta = await fetch(`${RAIZ}/objetivo/MetadadosAPIMeta?n=${n}`);
  if (!resposta.ok) {
    console.error(`Falha ao consultar o objetivo ${n}: HTTP ${resposta.status}`);
    process.exit(1);
  }
  const metas: { indicadores?: { numero: string; status: string; possui_ficha: boolean }[] }[] =
    JSON.parse(await resposta.text());
  for (const meta of metas) {
    for (const indicador of meta.indicadores ?? []) {
      site.set(indicador.numero, {
        status: SITE_PARA_NOSSO[indicador.status] ?? null,
        ficha: indicador.possui_ficha,
      });
    }
  }
}

let divergentes = 0;
for (const [codigo, nosso] of nossos) {
  const noSite = site.get(codigo);
  if (!noSite) {
    divergentes++;
    console.log(`SEM CORRESPONDÊNCIA  ${codigo} (nosso: ${nosso.status})`);
    continue;
  }
  if (noSite.status == null) {
    divergentes++;
    console.log(
      `STATUS FORA DO MODELO  ${codigo}: portal diz "${site.get(codigo)?.status ?? ""}" — tratar no data/ods.ts`,
    );
    continue;
  }
  if (noSite.status !== nosso.status) {
    divergentes++;
    console.log(
      `DIVERGE  ${codigo}: nosso=${nosso.status} | portal=${noSite.status} (ficha: ${noSite.ficha ? "sim" : "não"})`,
    );
  }
}

const produzidos = [...nossos.values()].filter((n) => n.status === "produzido").length;
console.log(
  `${nossos.size} indicadores conferidos | ${produzidos} produzidos (com link para a ficha) | ${divergentes} divergências`,
);

if (divergentes > 0) {
  console.error(
    "Divergências encontradas — atualize as marcações (EM CONSTRUÇÃO)/(SEM DADOS) em data/ods.ts.",
  );
  process.exit(1);
}
