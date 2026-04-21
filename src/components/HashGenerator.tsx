import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import CopyButton from '@/components/CopyButton'
import { hash } from '@/utils/hash'
import { HashAlgorithm } from '@/enums'

const ALGORITHMS = [
  HashAlgorithm.MD5,
  HashAlgorithm.SHA1,
  HashAlgorithm.SHA256,
  HashAlgorithm.SHA384,
  HashAlgorithm.SHA512,
]

export default function HashGenerator() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>(HashAlgorithm.SHA256)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setOutput(await hash(input, algorithm))
    setLoading(false)
  }

  const handleAlgorithmChange = (algo: HashAlgorithm) => {
    setAlgorithm(algo)
    setOutput('')
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {ALGORITHMS.map((algo) => (
          <Button
            key={algo}
            variant={algorithm === algo ? 'default' : 'outline'}
            onClick={() => handleAlgorithmChange(algo)}
          >
            {algo}
          </Button>
        ))}
      </div>

      {algorithm === HashAlgorithm.MD5 && (
        <p className="text-sm text-amber-600 dark:text-amber-500">
          MD5 é considerado inseguro e não é recomendado para uso em produção.
        </p>
      )}

      <Textarea
        placeholder="Digite o texto para gerar o hash"
        value={input}
        onChange={(e) => { setInput(e.target.value); setOutput('') }}
        rows={5}
        className="resize-none font-mono text-sm"
      />

      <Button onClick={handleGenerate} disabled={input.length === 0 || loading}>
        {loading ? 'Gerando…' : 'Gerar hash'}
      </Button>

      {output && (
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Textarea
            readOnly
            value={output}
            rows={2}
            className="resize-none font-mono text-sm pr-12 break-all"
          />
          <CopyButton text={output} className="absolute top-2 right-2" />
        </div>
      )}
    </div>
  )
}
