import { useState, useEffect } from 'react'
import { RefreshCw, Smile, Frown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import CopyButton from '@/components/CopyButton'
import { DocumentType } from '@/enums'
import { onGenerateCPF, onGenerateCNPJ, onGenerateRG, onSetMask } from '@/utils/document'

const TYPES = [
  { type: DocumentType.CPF, label: 'CPF' },
  { type: DocumentType.CNPJ, label: 'CNPJ' },
  { type: DocumentType.RG, label: 'RG' },
]

export default function DocumentGenerator() {
  const [docType, setDocType] = useState(DocumentType.CPF)
  const [document, setDocument] = useState('')
  const [mask, setMask] = useState(true)
  const [spinning, setSpinning] = useState(false)

  const generate = (type: DocumentType, withMask = mask) => {
    setDocType(type)
    let doc = ''
    if (type === DocumentType.CPF) doc = onGenerateCPF(withMask)
    else if (type === DocumentType.CNPJ) doc = onGenerateCNPJ(withMask)
    else if (type === DocumentType.RG) doc = onGenerateRG(withMask)
    setDocument(doc)
    return doc
  }

  const toggleMask = (next: boolean) => {
    setMask(next)
    setDocument((doc) =>
      next ? onSetMask(doc, docType) : doc.replace(/[^\d]/g, '')
    )
  }

  useEffect(() => {
    generate(DocumentType.CPF, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Type selector */}
      <div className="flex gap-2">
        {TYPES.map(({ type, label }) => (
          <Button
            key={type}
            variant={docType === type ? 'default' : 'outline'}
            onClick={() => generate(type)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Generated value */}
      <span
        key={document}
        className="text-3xl font-mono font-semibold tracking-wider text-foreground select-all animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {document}
      </span>

      {/* Action buttons */}
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <CopyButton text={document} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleMask(!mask)}
                aria-label="Alternar máscara"
              >
                {mask ? <Smile className="h-4 w-4" /> : <Frown className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mask ? 'Sem máscara' : 'Com máscara'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setSpinning(true); generate(docType) }}
                aria-label="Gerar novo"
              >
                <RefreshCw
                  className="h-4 w-4"
                  style={spinning ? { animation: 'spin-once 0.5s ease-in-out' } : {}}
                  onAnimationEnd={() => setSpinning(false)}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Gerar novo</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
