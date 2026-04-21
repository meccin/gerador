import { describe, it, expect } from 'vitest'
import { hash } from '../hash'
import { HashAlgorithm } from '@/enums'

describe('MD5', () => {
  it('string vazia', async () => {
    expect(await hash('', HashAlgorithm.MD5)).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it("'abc'", async () => {
    expect(await hash('abc', HashAlgorithm.MD5)).toBe('900150983cd24fb0d6963f7d28e17f72')
  })

  it('unicode (São Paulo)', async () => {
    expect(await hash('São Paulo', HashAlgorithm.MD5)).toBe('ea76c0ae9dd817eb448fd1b3db6253bb')
  })
})

describe('SHA-1', () => {
  it("'abc'", async () => {
    expect(await hash('abc', HashAlgorithm.SHA1)).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
})

describe('SHA-256', () => {
  it("'abc'", async () => {
    expect(await hash('abc', HashAlgorithm.SHA256)).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
})

describe('SHA-384', () => {
  it("'abc'", async () => {
    expect(await hash('abc', HashAlgorithm.SHA384)).toBe('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7')
  })
})

describe('SHA-512', () => {
  it("'abc'", async () => {
    expect(await hash('abc', HashAlgorithm.SHA512)).toBe('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f')
  })
})
