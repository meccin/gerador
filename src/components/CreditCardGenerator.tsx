import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import CopyButton from '@/components/CopyButton'
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
            className={`rounded-[1px] ${
              i === 4
                ? 'bg-yellow-400/30'
                : 'bg-yellow-500/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ContactlessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/70">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0" />
      <path d="M6.5 12c0-3.03 2.47-5.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12c0-4.42 3.58-8 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 12c0-1.66 1.34-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  )
}

export default function CreditCardGenerator() {
  const [brand, setBrand] = useState(CreditCardBrand.VISA)
  const [card, setCard] = useState<ICreditCard | null>(null)

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

        {/* Card visual — fixed aspect ratio ~1.586:1 */}
        <div
          className="relative w-full sm:w-[24rem] rounded-2xl shadow-2xl overflow-hidden"
          style={{ aspectRatio: '1.586 / 1' }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900" />
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />

          {/* Card content */}
          <div className="relative h-full flex flex-col justify-between p-6">
            {/* Top row: chip + contactless */}
            <div className="flex justify-between items-start">
              <Chip />
              <ContactlessIcon />
            </div>

            {/* Card number */}
            <p className="font-mono text-xl sm:text-2xl tracking-[0.2em] text-white drop-shadow-sm select-all">
              {formatNumber(card.number)}
            </p>

            {/* Bottom row: expiry + cvv + brand */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Validade</p>
                <p className="text-white font-mono text-sm tracking-wider">{card.expirity}</p>
              </div>
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">CVV</p>
                <p className="text-white font-mono text-sm tracking-wider">{card.cvv}</p>
              </div>
              <img
                src={`/brands/${card.brand}.svg`}
                alt={card.brand}
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <CopyButton text={card.number} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => generate(brand)} aria-label="Gerar novo">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Gerar novo</p></TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
