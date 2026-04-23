'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'es'
export type ThemeMode = 'light' | 'dark'

interface UiStore {
  language: Language
  theme: ThemeMode
  setLanguage: (language: Language) => void
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'light',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'archstudio-ui',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
)
