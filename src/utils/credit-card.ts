import { CreditCardBrand } from '../enums'
import type { ICreditCard } from '../interfaces'

export const onGenerateCreditCard = (brand: CreditCardBrand): ICreditCard => {
  let number = generateCardNumber(brand)

  while (!luhnCheck(number)) {
    number = generateCardNumber(brand)
  }

  return {
    number,
    expirity: getRamdomDateInBetween(),
    cvv: String(Math.floor(Math.random() * (999 - 100)) + 100),
    brand,
  }
}

const generateCardNumber = (brand: CreditCardBrand) => {
  let bin: string
  let numberLength: number

  switch (brand) {
    case CreditCardBrand.AMEX:
      bin = ['34', '37'].sort(() => 0.5 - Math.random())[0]
      numberLength = 15
      break

    case CreditCardBrand.MASTERCARD:
      bin = ['51', '55'].sort(() => 0.5 - Math.random())[0]
      numberLength = 16
      break

    case CreditCardBrand.VISA:
      bin = '4'
      numberLength = 16
      break

    default:
      bin = '55'
      numberLength = 16
  }

  let cardNumber = bin,
    randomNumberLength = numberLength - (bin.length + 1)

  for (let i = 0; i < randomNumberLength; i++) {
    let digit = Math.floor(Math.random() * 9 + 0)
    cardNumber += digit
  }

  let checkDigit = getCheckDigit(cardNumber)

  cardNumber += String(checkDigit)

  return cardNumber
}

const getCheckDigit = (number: string) => {
  let sum = 0,
    module,
    checkDigit

  for (let i = 0; i < number.length; i++) {
    let digit = parseInt(number.substring(i, i + 1))

    if (i % 2 == 0) {
      digit = digit * 2
      if (digit > 9) {
        digit = digit / 10 + (digit % 10)
      }
    }

    sum += digit
  }

  module = parseInt(String(sum)) % 10
  checkDigit = module === 0 ? 0 : 10 - module

  return checkDigit
}

const luhnCheck = (num: string): boolean => {
  let arr = (num + '')
    .split('')
    .reverse()
    .map((x) => parseInt(x))

  let lastDigit = arr.splice(0, 1)[0]

  let sum = arr.reduce(
    (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
    0
  )

  sum += lastDigit

  return sum % 10 === 0
}

const getRamdomDateInBetween = (): string => {
  const start = new Date()
  const end = new Date(
    start.getFullYear() + 5,
    start.getMonth(),
    start.getDate()
  )

  const randomDate = new Date(
    Math.floor(
      Math.random() * (end.getTime() - start.getTime() + 1) + start.getTime()
    )
  )

  return `${('0' + (randomDate.getMonth() + 1)).slice(
    -2
  )}/${randomDate.getFullYear()}`
}
