'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { Languages, Moon, Sun } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'

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
    <header className="h-11 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 flex items-center gap-3">
      <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {t(language, 'global.appName')}
      </Link>
      <Link href="/" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
        {t(language, 'global.home')}
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <Languages size={12} />
          {t(language, 'global.language')}
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs rounded px-2 py-1 text-gray-700 dark:text-gray-200"
        >
          <option value="en">{t(language, 'global.english')}</option>
          <option value="es">{t(language, 'global.spanish')}</option>
        </select>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="inline-flex items-center gap-1.5 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          {theme === 'dark' ? t(language, 'global.light') : t(language, 'global.dark')}
        </button>
      </div>
    </header>
  )
}
