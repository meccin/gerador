import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import CopyButton from '@/components/CopyButton'
import { encode, decode } from '@/utils/base64'

type Mode = 'encode' | 'decode'

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    try {
      setOutput(mode === 'encode' ? encode(input) : decode(input))
    } catch {
      setError(mode === 'decode' ? 'Entrada inválida — não é um Base64 válido.' : 'Erro ao codificar.')
      setOutput('')
    }
  }

  const handleSwap = () => {
    const next: Mode = mode === 'encode' ? 'decode' : 'encode'
    setMode(next)
    setInput(output)
    setOutput('')
    setError('')
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'encode' ? 'default' : 'outline'}
          onClick={() => { setMode('encode'); setOutput(''); setError('') }}
        >
          Encode
        </Button>
        <Button
          variant={mode === 'decode' ? 'default' : 'outline'}
          onClick={() => { setMode('decode'); setOutput(''); setError('') }}
        >
          Decode
        </Button>
      </div>

      {/* Input */}
      <Textarea
        placeholder={mode === 'encode' ? 'Texto para codificar...' : 'Base64 para decodificar...'}
        value={input}
        onChange={(e) => { setInput(e.target.value); setOutput(''); setError('') }}
        rows={5}
        className="resize-none font-mono text-sm"
      />

      <Button onClick={handleConvert} disabled={input.length === 0}>
        {mode === 'encode' ? 'Codificar' : 'Decodificar'}
      </Button>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Output */}
      {output && (
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Textarea
            readOnly
            value={output}
            rows={5}
            className="resize-none font-mono text-sm pr-12"
          />
          <CopyButton text={output} className="absolute top-2 right-2" />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={handleSwap}
          >
            Usar resultado como entrada
          </Button>
        </div>
      )}
    </div>
  )
}
