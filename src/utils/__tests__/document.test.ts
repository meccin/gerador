import { describe, it, expect } from 'vitest'
import { onGenerateCPF, onGenerateCNPJ, onGenerateRG, onSetMask } from '../document'
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

// CNPJ validator
function isValidCNPJ(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, '')
  if (d.length !== 14) return false

  const calcDigit = (d: string, len: number) => {
    let sum = 0
    let pos = len - 7
    for (let i = len; i >= 1; i--) {
      sum += parseInt(d[len - i]) * pos--
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

describe('onGenerateCNPJ', () => {
  it('com máscara retorna formato xx.xxx.xxx/xxxx-xx', () => {
    const cnpj = onGenerateCNPJ(true)
    expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })

  it('sem máscara retorna 14 dígitos', () => {
    const cnpj = onGenerateCNPJ(false)
    expect(cnpj).toMatch(/^\d{14}$/)
  })

  it('gera CNPJ com dígitos verificadores válidos', () => {
    for (let i = 0; i < 10; i++) {
      expect(isValidCNPJ(onGenerateCNPJ(true))).toBe(true)
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
})
