'use client'
import React from 'react'
import { useEditor } from '../hooks/useEditor'
import { useSystemStore } from '@/store/system-store'
import { parseImportedJson } from '@/features/import-export/import-json'
import { validateImportedJson } from '@/features/import-export/schema-validator'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editor-store'

type LineError = { line: number; message: string }

function findLineByPath(jsonText: string, path: string): number {
  const lines = jsonText.split('\n')
  const token = String(path.split('.').slice(-1)[0] ?? '').replace(/"/g, '')
  if (!token) return 1
  const index = lines.findIndex((line) => line.includes(`"${token}"`))
  return index >= 0 ? index + 1 : 1
}

function parseSyntaxLine(errorMessage: string): number {
  const match = errorMessage.match(/position\s+(\d+)/i)
  if (!match) return 1
  const charPos = Number(match[1])
  if (!Number.isFinite(charPos) || charPos < 0) return 1
  return charPos
}

export function JsonLivePanel() {
  const { system } = useEditor()
  const importSystem = useSystemStore((s) => s.importSystem)
  const setJsonPanelOpen = useEditorStore((s) => s.setJsonPanelOpen)
  const [jsonText, setJsonText] = React.useState('')
  const [errors, setErrors] = React.useState<LineError[]>([])
  const [status, setStatus] = React.useState<string>('Ready')

  React.useEffect(() => {
    if (!system) return
    const payload = {
      formatVersion: '1.0',
      exportedAt: new Date().toISOString(),
      system,
    }
    setJsonText(JSON.stringify(payload, null, 2))
    setErrors([])
    setStatus('Ready')
  }, [system?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const validateLive = React.useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text)
      const validated = validateImportedJson(parsed)
      if (validated.success) {
        setErrors([])
        setStatus('Valid')
        return
      }
      const nextErrors = validated.errors.slice(0, 10).map((message) => {
        const path = String(message.split(' — ')[0] ?? '')
        return { line: findLineByPath(text, path), message }
      })
      setErrors(nextErrors)
      setStatus('Schema errors')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON syntax'
      setErrors([{ line: parseSyntaxLine(msg), message: msg }])
      setStatus('Syntax error')
    }
  }, [])

  const onChangeText = (text: string) => {
    setJsonText(text)
    validateLive(text)
  }

  const applyJson = () => {
    const result = parseImportedJson(jsonText)
    if (!result.success) {
      const nextErrors = result.errors.map((message) => ({ line: 1, message }))
      setErrors(nextErrors)
      setStatus('Apply failed')
      return
    }
    importSystem(result.system)
    setErrors([])
    setStatus('Applied')
  }

  return (
    <aside className="hidden lg:flex w-[34rem] max-w-[40vw] border-l border-border bg-card shrink-0 flex-col">
      <div className="px-3 py-2 border-b border-border/80 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground">JSON Live</p>
          <p className="text-[10px] text-muted-foreground">Source of truth + line validation</p>
        </div>
        <button onClick={() => setJsonPanelOpen(false)} className="p-1 rounded hover:bg-accent text-muted-foreground">
          <X size={13} />
        </button>
      </div>
      <div className="px-3 py-2 border-b border-border/80 flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => validateLive(jsonText)}>Validate</Button>
        <Button size="sm" variant="primary" onClick={applyJson}>Apply</Button>
        <span className="text-[10px] text-muted-foreground ml-auto">{status}</span>
      </div>
      <textarea
        value={jsonText}
        onChange={(e) => onChangeText(e.target.value)}
        className="flex-1 w-full resize-none p-3 font-mono text-xs bg-background text-foreground focus:outline-none"
      />
      <div className="border-t border-border/80 p-2 max-h-28 overflow-auto">
        {errors.length === 0 ? (
          <p className="text-[10px] text-emerald-600">No issues</p>
        ) : (
          errors.map((error, idx) => (
            <p key={`${error.line}-${idx}`} className="text-[10px] text-destructive">
              L{error.line}: {error.message}
            </p>
          ))
        )}
      </div>
    </aside>
  )
}
