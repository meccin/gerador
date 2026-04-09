import { useState } from 'react'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import CopyButton from '@/components/CopyButton'

export default function JsonPretty() {
  const [input, setInput] = useState('')
  const [prettyJson, setPrettyJson] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePrettify = async () => {
    setError(false)
    setLoading(true)
    try {
      const escaped = input.replace(/[\u201C\u201D]/g, '"')
      const parsed = JSON.stringify(JSON.parse(escaped), null, 2)
      setPrettyJson(parsed)
      const highlighter = await createHighlighterCore({
        themes: [
          import('shiki/themes/github-light.mjs'),
          import('shiki/themes/github-dark.mjs'),
        ],
        langs: [import('shiki/langs/json.mjs')],
        engine: createJavaScriptRegexEngine(),
      })
      // defaultColor: false → Shiki embeds both themes as CSS vars (--shiki-light / --shiki-dark)
      // The .dark CSS rules in global.css pick the right one automatically
      const html = highlighter.codeToHtml(parsed, {
        lang: 'json',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      })
      setHighlighted(html)
    } catch {
      setError(true)
      setPrettyJson('')
      setHighlighted('')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setPrettyJson('')
    setHighlighted('')
    setError(false)
  }

  const handleNew = () => {
    setInput('')
    setPrettyJson('')
    setHighlighted('')
    setError(false)
  }

  if (prettyJson) {
    return (
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>JSON Raw</Button>
          <Button variant="outline" onClick={handleNew}>Novo</Button>
        </div>
        <div className="relative rounded-lg border border-border overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={prettyJson} />
          </div>
          <div
            className="overflow-auto max-h-[31.25rem] text-sm [&_pre]:p-4 [&_pre]:m-0 animate-in fade-in slide-in-from-right-4 duration-300"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <Button onClick={handlePrettify} disabled={input.length === 0 || loading}>
        {loading ? 'Processando...' : 'Prettify'}
      </Button>
      <Textarea
        placeholder="{}"
        value={input}
        onChange={(e) => { setInput(e.target.value); setError(false) }}
        rows={18}
        className={`resize-none font-mono text-sm ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
      />
      {error && (
        <p className="text-sm text-destructive">JSON inválido. Verifique a sintaxe.</p>
      )}
    </div>
  )
}
