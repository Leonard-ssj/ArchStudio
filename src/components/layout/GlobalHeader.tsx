'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { Languages, Moon, Sun } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'

export function GlobalHeader() {
  const language = useUiStore((s) => s.language)
  const theme = useUiStore((s) => s.theme)
  const setLanguage = useUiStore((s) => s.setLanguage)
  const setTheme = useUiStore((s) => s.setTheme)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <header className="h-auto min-h-12 shrink-0 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-4 py-1.5 flex flex-wrap items-center gap-2">
      <Link href="/" className="text-sm font-semibold text-foreground">
        {t(language, 'global.appName')}
      </Link>
      <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
        {t(language, 'global.home')}
      </Link>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <label className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Languages size={12} />
          {t(language, 'global.language')}
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
          className="h-8 w-[90px] sm:w-auto border border-input bg-background text-foreground text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="en">{t(language, 'global.english')}</option>
          <option value="es">{t(language, 'global.spanish')}</option>
        </select>

        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="secondary"
          size="sm"
          className="h-7"
        >
          {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          {theme === 'dark' ? t(language, 'global.light') : t(language, 'global.dark')}
        </Button>
      </div>
    </header>
  )
}
