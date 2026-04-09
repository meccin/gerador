import { useState, useEffect } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CreditCardBrand } from '@/enums'
import { onGenerateCreditCard } from '@/utils/credit-card'
import type { ICreditCard } from '@/interfaces'

const BRANDS = [
  { brand: CreditCardBrand.VISA, label: 'Visa' },
  { brand: CreditCardBrand.MASTERCARD, label: 'Mastercard' },
  { brand: CreditCardBrand.AMEX, label: 'Amex' },
]

function formatNumber(num: string) {
  if (num.length === 15) {
    return `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`
  }
  return num.replace(/(.{4})/g, '$1 ').trim()
}

function Chip() {
  return (
    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 shadow-md flex items-center justify-center overflow-hidden">
      <div className="w-9 h-6 rounded-sm border border-yellow-500/40 grid grid-cols-3 grid-rows-3 gap-px p-px">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-[1px] ${i === 4 ? 'bg-yellow-400/30' : 'bg-yellow-500/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

function ContactlessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/70">
      <path d="M6.5 12c0-3.03 2.47-5.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12c0-4.42 3.58-8 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 12c0-1.66 1.34-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  )
}

function CardCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-white/50 hover:text-white transition-colors"
      aria-label="Copiar"
    >
      {copied
        ? <Check className="h-3 w-3 text-green-400" />
        : <Copy className="h-3 w-3" />
      }
    </button>
  )
}

export default function CreditCardGenerator() {
  const [brand, setBrand] = useState(CreditCardBrand.VISA)
  const [card, setCard] = useState<ICreditCard | null>(null)
  const [spinning, setSpinning] = useState(false)

  const generate = (b: CreditCardBrand) => {
    setBrand(b)
    setCard(onGenerateCreditCard(b))
  }

  useEffect(() => {
    generate(CreditCardBrand.VISA)
  }, [])

  if (!card) return null

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-8">
        {/* Brand selector */}
        <div className="flex gap-2">
          {BRANDS.map(({ brand: b, label }) => (
            <Button
              key={b}
              variant={brand === b ? 'default' : 'outline'}
              onClick={() => generate(b)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Card visual — standard credit card aspect ratio 1.586:1 */}
        <div
          className="relative w-full sm:w-[24rem] rounded-2xl shadow-2xl overflow-hidden"
          style={{ aspectRatio: '1.586 / 1' }}
        >
          {/* Gradient background — neutral dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.10)_0%,_transparent_60%)]" />

          {/* Card content */}
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            {/* Top row: chip + contactless */}
            <div className="flex justify-between items-start">
              <Chip />
              <ContactlessIcon />
            </div>

            {/* Card number + copy */}
            <div className="flex items-center gap-2">
              <p className="font-mono text-base sm:text-lg tracking-[0.15em] text-white drop-shadow-sm select-all">
                {formatNumber(card.number)}
              </p>
              <CardCopyButton text={card.number} />
            </div>

            {/* Bottom row: expiry | cvv | brand */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Validade</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-mono text-sm tracking-wider">{card.expirity}</p>
                  <CardCopyButton text={card.expirity} />
                </div>
              </div>
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">CVV</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-mono text-sm tracking-wider">{card.cvv}</p>
                  <CardCopyButton text={card.cvv} />
                </div>
              </div>
              <img
                src={`/brands/${card.brand}.svg`}
                alt={card.brand}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Gerar novo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => { setSpinning(true); generate(brand) }}
              aria-label="Gerar novo"
            >
              <RefreshCw
                className="h-4 w-4"
                style={spinning ? { animation: 'spin-once 0.5s ease-in-out' } : {}}
                onAnimationEnd={() => setSpinning(false)}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Gerar novo</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
