import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value ?? 0)
}
