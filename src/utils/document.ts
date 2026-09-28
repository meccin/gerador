import { DocumentType } from '../enums'

const initialArray = (total: number, number: number) => {
  return Array.from(Array(total), () => numberRandom(number))
}
const numberRandom = (number: number) => Math.round(Math.random() * number)
const mod = (dividend: number, divider: number) => {
  return Math.round(dividend - Math.floor(dividend / divider) * divider)
}

export const onGenerateCPF = (masked: boolean): string => {
  const total = 9
  const number = 9
  const [n1, n2, n3, n4, n5, n6, n7, n8, n9] = initialArray(total, number)

  let d1 =
    n9 * 2 +
    n8 * 3 +
    n7 * 4 +
    n6 * 5 +
    n5 * 6 +
    n4 * 7 +
    n3 * 8 +
    n2 * 9 +
    n1 * 10
  d1 = 11 - mod(d1, 11)
  if (d1 >= 10) d1 = 0

  let d2 =
    d1 * 2 +
    n9 * 3 +
    n8 * 4 +
    n7 * 5 +
    n6 * 6 +
    n5 * 7 +
    n4 * 8 +
    n3 * 9 +
    n2 * 10 +
    n1 * 11
  d2 = 11 - mod(d2, 11)
  if (d2 >= 10) d2 = 0

  if (masked) {
    return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`
  }

  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`
}

const CNPJ_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const DIGITS = '0123456789'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const randomChar = (chars: string) => chars[numberRandom(chars.length - 1)]

// Cálculo dos DVs conforme especificação SERPRO do CNPJ alfanumérico:
// valor de cada caractere = código ASCII - 48 (dígitos mantêm seu valor).
export const calculateCNPJDV = (base: string): string => {
  let sum1 = 0
  let sum2 = 0
  for (let i = 0; i < 12; i++) {
    const value = base.charCodeAt(i) - 48
    sum1 += value * CNPJ_WEIGHTS[i + 1]
    sum2 += value * CNPJ_WEIGHTS[i]
  }
  const d1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11)
  sum2 += d1 * CNPJ_WEIGHTS[12]
  const d2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11)
  return `${d1}${d2}`
}

export const onGenerateCNPJ = (
  masked: boolean,
  alphanumeric = false
): string => {
  const chars = alphanumeric ? DIGITS + LETTERS : DIGITS
  const root = Array.from(Array(8), () => randomChar(chars))

  // Garante ao menos uma letra na raiz do CNPJ alfanumérico
  if (alphanumeric && !root.some((c) => LETTERS.includes(c))) {
    root[numberRandom(7)] = randomChar(LETTERS)
  }

  // Ordem do estabelecimento: numérico fixo em matriz (0001);
  // alfanumérico aleatório, exceto "0000" que não é válida
  let order = '0001'
  if (alphanumeric) {
    do {
      order = Array.from(Array(4), () => randomChar(chars)).join('')
    } while (order === '0000')
  }

  const base = `${root.join('')}${order}`
  const cnpj = `${base}${calculateCNPJDV(base)}`

  return masked ? onSetMask(cnpj, DocumentType.CNPJ) : cnpj
}

export const onGenerateRG = (masked: boolean): string => {
  const total = 8
  const number = 9
  const [n1, n2, n3, n4, n5, n6, n7, n8] = initialArray(total, number)

  let d1: number | string =
    n1 * 2 + n2 * 3 + n3 * 4 + n4 * 5 + n5 * 6 + n6 * 7 + n7 * 8 + n8 * 9

  d1 = 11 - mod(d1, 11)
  if (d1 === 10) d1 = 'X'
  if (d1 >= 10) d1 = 0

  if (masked) {
    return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}-${d1}`
  }

  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${d1}`
}

export const onSetMask = (value: string, type: DocumentType): string => {
  switch (type) {
    case DocumentType.CPF:
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')

    case DocumentType.CNPJ:
      return value.replace(
        /([A-Z\d]{2})([A-Z\d]{3})([A-Z\d]{3})([A-Z\d]{4})(\d{2})/g,
        '$1.$2.$3/$4-$5'
      )

    case DocumentType.RG:
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3-$4')

    default:
      return value
  }
}

export const onRemoveMask = (value: string): string =>
  value.replace(/[./-]/g, '')
