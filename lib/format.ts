const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INTEIRO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** R$ 200.124.164,91 */
export function formatBRL(valor: number): string {
  return BRL.format(valor);
}

/** 200.124.164 (sem centavos, sem símbolo) */
export function formatNumero(valor: number): string {
  return INTEIRO.format(valor);
}

/**
 * Abreviação usada nos cartões e eixos dos gráficos, na mesma escala do painel
 * atual: "1,2 bi" / "340,5 MI" / "700 mil".
 */
export function formatCompacto(valor: number): string {
  const abs = Math.abs(valor);
  if (abs >= 1e9) return escala(valor / 1e9, 1) + " bi";
  if (abs >= 1e6) return escala(valor / 1e6, 1) + " MI";
  if (abs >= 1e3) return escala(valor / 1e3, 0) + " mil";
  return valor.toLocaleString("pt-BR");
}

/** "R$ 340,5 MI" */
export function formatCompactoBRL(valor: number): string {
  return `R$ ${formatCompacto(valor)}`;
}

function escala(valor: number, casas: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

/** 12,4% */
export function formatPercentual(fracao: number, casas = 1): string {
  return `${(fracao * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })}%`;
}
