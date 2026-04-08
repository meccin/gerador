import { describe, it, expect } from 'vitest'
import { onGenerateCreditCard } from '../credit-card'
import { CreditCardBrand } from '../../enums'

function luhnCheck(num: string): boolean {
  const arr = num.split('').reverse().map(Number)
  const lastDigit = arr.shift()!
  const sum = arr.reduce((acc, val, i) =>
    i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9, 0
  )
  return (sum + lastDigit) % 10 === 0
}

describe('onGenerateCreditCard', () => {
  it('Visa: começa com 4, 16 dígitos, passa Luhn', () => {
    for (let i = 0; i < 5; i++) {
      const card = onGenerateCreditCard(CreditCardBrand.VISA)
      expect(card.number).toMatch(/^4\d{15}$/)
      expect(luhnCheck(card.number)).toBe(true)
    }
  })

  it('Mastercard: começa com 51-55, 16 dígitos, passa Luhn', () => {
    for (let i = 0; i < 5; i++) {
      const card = onGenerateCreditCard(CreditCardBrand.MASTERCARD)
      expect(card.number).toMatch(/^5[1-5]\d{14}$/)
      expect(luhnCheck(card.number)).toBe(true)
    }
  })

  it('Amex: começa com 34 ou 37, 15 dígitos, passa Luhn', () => {
    for (let i = 0; i < 5; i++) {
      const card = onGenerateCreditCard(CreditCardBrand.AMEX)
      expect(card.number).toMatch(/^3[47]\d{13}$/)
      expect(luhnCheck(card.number)).toBe(true)
    }
  })

  it('data de expiração é futura no formato MM/YYYY', () => {
    const card = onGenerateCreditCard(CreditCardBrand.VISA)
    expect(card.expirity).toMatch(/^\d{2}\/\d{4}$/)
    const [month, year] = card.expirity.split('/').map(Number)
    const now = new Date()
    expect(year).toBeGreaterThanOrEqual(now.getFullYear())
    expect(month).toBeGreaterThanOrEqual(1)
    expect(month).toBeLessThanOrEqual(12)
  })

  it('CVV tem 3 dígitos para Visa/Mastercard', () => {
    const card = onGenerateCreditCard(CreditCardBrand.VISA)
    expect(card.cvv).toMatch(/^\d{3}$/)
  })

  it('brand está correta no resultado', () => {
    expect(onGenerateCreditCard(CreditCardBrand.VISA).brand).toBe(CreditCardBrand.VISA)
    expect(onGenerateCreditCard(CreditCardBrand.MASTERCARD).brand).toBe(CreditCardBrand.MASTERCARD)
    expect(onGenerateCreditCard(CreditCardBrand.AMEX).brand).toBe(CreditCardBrand.AMEX)
  })
})
