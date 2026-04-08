import { describe, it, expect } from 'vitest'
import { encode, decode } from '../base64'

describe('base64 encode/decode', () => {
  it('roundtrip com ASCII simples', () => {
    expect(decode(encode('hello world'))).toBe('hello world')
  })

  it('roundtrip com acentos e cedilha', () => {
    const text = 'olá, como vai você?'
    expect(decode(encode(text))).toBe(text)
  })

  it('roundtrip com emoji', () => {
    const text = '🇧🇷 Brasil'
    expect(decode(encode(text))).toBe(text)
  })

  it('roundtrip com JSON', () => {
    const json = JSON.stringify({ nome: 'João', ação: 'testar' })
    expect(decode(encode(json))).toBe(json)
  })

  it('encode produz string Base64 válida (apenas chars base64)', () => {
    const result = encode('teste')
    expect(result).toMatch(/^[A-Za-z0-9+/]+=*$/)
  })

  it('decode lança erro para input inválido', () => {
    expect(() => decode('não é base64!!!')).toThrow()
  })
})
