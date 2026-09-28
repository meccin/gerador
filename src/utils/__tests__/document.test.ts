import { describe, it, expect } from 'vitest'
import {
  calculateCNPJDV,
  onGenerateCPF,
  onGenerateCNPJ,
  onGenerateRG,
  onRemoveMask,
  onSetMask,
} from '../document'
import { DocumentType } from '../../enums'

// CPF validator: verifies both check digits
function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
  let r1 = (sum * 10) % 11
  if (r1 === 10 || r1 === 11) r1 = 0
  if (r1 !== parseInt(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
  let r2 = (sum * 10) % 11
  if (r2 === 10 || r2 === 11) r2 = 0
  return r2 === parseInt(digits[10])
}

// CNPJ validator (numérico e alfanumérico)
function isValidCNPJ(cnpj: string): boolean {
  const d = cnpj.replace(/[./-]/g, '')
  if (!/^[A-Z\d]{12}\d{2}$/.test(d)) return false

  const calcDigit = (d: string, len: number) => {
    let sum = 0
    let pos = len - 7
    for (let i = len; i >= 1; i--) {
      sum += (d.charCodeAt(len - i) - 48) * pos--
      if (pos < 2) pos = 9
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }

  return (
    calcDigit(d, 12) === parseInt(d[12]) &&
    calcDigit(d, 13) === parseInt(d[13])
  )
}

describe('onGenerateCPF', () => {
  it('com máscara retorna formato xxx.xxx.xxx-xx', () => {
    const cpf = onGenerateCPF(true)
    expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  })

  it('sem máscara retorna 11 dígitos', () => {
    const cpf = onGenerateCPF(false)
    expect(cpf).toMatch(/^\d{11}$/)
  })

  it('gera CPF com dígitos verificadores válidos', () => {
    for (let i = 0; i < 10; i++) {
      expect(isValidCPF(onGenerateCPF(true))).toBe(true)
    }
  })
})

describe('calculateCNPJDV', () => {
  it('calcula DV do exemplo alfanumérico do SERPRO', () => {
    expect(calculateCNPJDV('12ABC34501DE')).toBe('35')
  })

  it('calcula DV de CNPJ numérico', () => {
    expect(calculateCNPJDV('112223330001')).toBe('81')
  })
})

describe('onGenerateCNPJ numérico', () => {
  it('com máscara retorna formato xx.xxx.xxx/xxxx-xx', () => {
    const cnpj = onGenerateCNPJ(true, false)
    expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })

  it('sem máscara retorna 14 dígitos', () => {
    const cnpj = onGenerateCNPJ(false, false)
    expect(cnpj).toMatch(/^\d{14}$/)
  })

  it('gera CNPJ com dígitos verificadores válidos', () => {
    for (let i = 0; i < 10; i++) {
      expect(isValidCNPJ(onGenerateCNPJ(true, false))).toBe(true)
    }
  })
})

describe('onGenerateCNPJ ordem do estabelecimento', () => {
  it('numérico mantém ordem fixa 0001 (matriz)', () => {
    for (let i = 0; i < 10; i++) {
      expect(onGenerateCNPJ(false, false).slice(8, 12)).toBe('0001')
    }
  })

  it('alfanumérico nunca gera ordem 0000', () => {
    for (let i = 0; i < 200; i++) {
      expect(onGenerateCNPJ(false, true).slice(8, 12)).not.toBe('0000')
    }
  })

  it('alfanumérico não fixa a ordem em 0001', () => {
    const orders = new Set(
      Array.from(Array(50), () => onGenerateCNPJ(false, true).slice(8, 12))
    )
    expect(orders.size).toBeGreaterThan(1)
  })
})

describe('onGenerateCNPJ alfanumérico', () => {
  it('com máscara retorna formato XX.XXX.XXX/XXXX-99', () => {
    const cnpj = onGenerateCNPJ(true, true)
    expect(cnpj).toMatch(
      /^[A-Z\d]{2}\.[A-Z\d]{3}\.[A-Z\d]{3}\/[A-Z\d]{4}-\d{2}$/
    )
  })

  it('sem máscara retorna 12 alfanuméricos + 2 dígitos', () => {
    const cnpj = onGenerateCNPJ(false, true)
    expect(cnpj).toMatch(/^[A-Z\d]{12}\d{2}$/)
  })

  it('contém ao menos uma letra', () => {
    for (let i = 0; i < 10; i++) {
      expect(onGenerateCNPJ(false, true)).toMatch(/[A-Z]/)
    }
  })

  it('gera CNPJ com dígitos verificadores válidos', () => {
    for (let i = 0; i < 10; i++) {
      expect(isValidCNPJ(onGenerateCNPJ(true, true))).toBe(true)
    }
  })
})

describe('onGenerateRG', () => {
  it('com máscara retorna formato xx.xxx.xxx-x', () => {
    const rg = onGenerateRG(true)
    expect(rg).toMatch(/^\d{2}\.\d{3}\.\d{3}-[\dxX]$/)
  })

  it('sem máscara retorna somente dígitos/x', () => {
    const rg = onGenerateRG(false)
    expect(rg).toMatch(/^\d{8}[\dxX]$/)
  })
})

describe('onSetMask', () => {
  it('aplica máscara CPF em número sem máscara', () => {
    const masked = onSetMask('12345678909', DocumentType.CPF)
    expect(masked).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  })

  it('aplica máscara CNPJ em número sem máscara', () => {
    const masked = onSetMask('11222333000181', DocumentType.CNPJ)
    expect(masked).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })

  it('aplica máscara em CNPJ alfanumérico', () => {
    expect(onSetMask('12ABC34501DE35', DocumentType.CNPJ)).toBe(
      '12.ABC.345/01DE-35'
    )
  })
})

describe('onRemoveMask', () => {
  it('remove máscara preservando letras', () => {
    expect(onRemoveMask('12.ABC.345/01DE-35')).toBe('12ABC34501DE35')
  })
})
