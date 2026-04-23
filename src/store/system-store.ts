import { create } from 'zustand'
import { SystemModel } from '@/types'
import { EXAMPLE_SYSTEM } from '@/mock-data/example-system'

interface SystemStore {
  systems: SystemModel[]
  activeSystemId: string | null
  getActiveSystem: () => SystemModel | null
  setActiveSystem: (id: string) => void
  addSystem: (system: SystemModel) => void
  updateSystem: (system: SystemModel) => void
  removeSystem: (id: string) => void
  importSystem: (system: SystemModel) => void
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  systems: [EXAMPLE_SYSTEM],
  activeSystemId: EXAMPLE_SYSTEM.id,

  getActiveSystem: () => {
    const { systems, activeSystemId } = get()
    return systems.find((s) => s.id === activeSystemId) ?? null
  },

  setActiveSystem: (id) => set({ activeSystemId: id }),

  addSystem: (system) =>
    set((state) => ({ systems: [...state.systems, system] })),

  updateSystem: (system) =>
    set((state) => ({
      systems: state.systems.map((s) => (s.id === system.id ? system : s)),
    })),

  removeSystem: (id) =>
    set((state) => ({
      systems: state.systems.filter((s) => s.id !== id),
      activeSystemId: state.activeSystemId === id ? null : state.activeSystemId,
    })),

  importSystem: (system) => {
    const { systems } = get()
    const existing = systems.find((s) => s.id === system.id)
    if (existing) {
      get().updateSystem(system)
    } else {
      get().addSystem(system)
    }
    set({ activeSystemId: system.id })
  },
}))
