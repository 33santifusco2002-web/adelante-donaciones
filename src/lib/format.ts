const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** 20000 -> "$20.000" */
export function formatARS(value: number): string {
  return `$${nf.format(value)}`;
}

/** 15000 -> "15.000" (para el input de "Otro monto") */
export function formatThousands(value: number): string {
  return nf.format(value);
}

/** "15.000" / "$ 15.000,50" -> 15000 */
export function parseAmount(input: string): number {
  const digits = input.split(",")[0].replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
