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
  // Groups: 4-4-4-4 for Visa/Mastercard, 4-6-5 for Amex
  if (num.length === 15) {
    return `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`
  }
  return num.replace(/(.{4})/g, '$1 ').trim()
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

        {/* Card visual */}
        <div className="relative w-full sm:w-[22rem] bg-secondary rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-7 rounded bg-yellow-400/80" />
            <img
              src={`/brands/${card.brand}.svg`}
              alt={card.brand}
              className="h-8 w-auto"
            />
          </div>

          <p className="font-mono text-lg tracking-widest text-foreground">
            {formatNumber(card.number)}
          </p>

          <div className="flex justify-between text-sm text-muted-foreground font-mono">
            <span>{card.expirity}</span>
            <span>CVV: {card.cvv}</span>
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
