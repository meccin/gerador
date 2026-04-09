import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Link {
  href: string
  label: string
}

interface Props {
  links: Link[]
}

export default function MobileMenu({ links }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {links.map(({ href, label }) => (
          <DropdownMenuItem key={href} asChild>
            <a
              href={href}
              className="cursor-pointer text-sm underline decoration-dashed decoration-primary underline-offset-4"
            >
              {label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
