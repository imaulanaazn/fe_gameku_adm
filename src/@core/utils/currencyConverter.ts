export const currencyConverter = (nominal: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(nominal)
}

type CurrencyFormatterOptions = {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export const formatCurrencyIDR = (
  amount: number,
  options?: CurrencyFormatterOptions,
  useK: boolean = false
): string => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options || {}

  if (amount < 1000 || !useK) {
    return `${amount.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits })}`
  } else if (amount < 1000000) {
    return `${(amount / 1000).toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits })}k`
  } else {
    return `${(amount / 1000000).toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits })}M`
  }
}
