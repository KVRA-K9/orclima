"use client";

import { useSyncExternalStore } from "react";

const semAssinatura = () => () => {};
const noCliente = () => true;
const noServidor = () => false;

/**
 * `false` no servidor e no primeiro render do cliente, `true` depois da
 * hidratação. Usado por componentes que só podem medir o DOM no cliente
 * (Recharts) ou que dependem do tema resolvido.
 *
 * Preferível a `useState` + `useEffect`: não dispara render em cascata e o
 * React Compiler entende o padrão.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(semAssinatura, noCliente, noServidor);
}
