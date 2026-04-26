import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { LayerType, ValidationResult } from '@/types'

export interface EditorSnappingPreferences {
  enabled: boolean
  gridSize: number
  threshold: number
}

export const DEFAULT_SNAPPING_PREFERENCES: EditorSnappingPreferences = {
  enabled: true,
  gridSize: 16,
  threshold: 10,
}

type PersistedEditorPreferences = {
  snappingPreferences: EditorSnappingPreferences
}

interface EditorStore {
  activeLayer: LayerType
  selectedNodeId: string | null
  selectedEdgeId: string | null
  validationResults: ValidationResult[]
  isValidating: boolean
  isPaletteOpen: boolean
  isPropertiesPanelOpen: boolean
  isValidationPanelOpen: boolean
  isJsonPanelOpen: boolean
  snappingPreferences: EditorSnappingPreferences

  setActiveLayer: (layer: LayerType) => void
  setSelectedNode: (id: string | null) => void
  setSelectedEdge: (id: string | null) => void
  clearSelection: () => void
  setValidationResults: (results: ValidationResult[]) => void
  setIsValidating: (val: boolean) => void
  togglePalette: () => void
  togglePropertiesPanel: () => void
  toggleValidationPanel: () => void
  toggleJsonPanel: () => void
  setPaletteOpen: (open: boolean) => void
  setPropertiesPanelOpen: (open: boolean) => void
  setJsonPanelOpen: (open: boolean) => void
  setSnappingEnabled: (enabled: boolean) => void
  setSnappingGridSize: (gridSize: number) => void
  setSnappingThreshold: (threshold: number) => void

  // Per-diagram node/edge operations mutate the system through useDiagramActions.
}

function clampPreference(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

function readPersistedSnappingPreferences(value: unknown): EditorSnappingPreferences | null {
  if (!value || typeof value !== 'object' || !('snappingPreferences' in value)) return null
  const preferences = (value as { snappingPreferences?: unknown }).snappingPreferences
  if (!preferences || typeof preferences !== 'object') return null
  const candidate = preferences as Partial<EditorSnappingPreferences>

  return {
    enabled:
      typeof candidate.enabled === 'boolean'
        ? candidate.enabled
        : DEFAULT_SNAPPING_PREFERENCES.enabled,
    gridSize: clampPreference(
      Number(candidate.gridSize),
      4,
      128,
      DEFAULT_SNAPPING_PREFERENCES.gridSize
    ),
    threshold: clampPreference(
      Number(candidate.threshold),
      0,
      64,
      DEFAULT_SNAPPING_PREFERENCES.threshold
    ),
  }
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      activeLayer: 'application',
      selectedNodeId: null,
      selectedEdgeId: null,
      validationResults: [],
      isValidating: false,
      isPaletteOpen: true,
      isPropertiesPanelOpen: true,
      isValidationPanelOpen: true,
      isJsonPanelOpen: false,
      snappingPreferences: DEFAULT_SNAPPING_PREFERENCES,

      setActiveLayer: (layer) =>
        set({ activeLayer: layer, selectedNodeId: null, selectedEdgeId: null }),

      setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),

      setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

      clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

      setValidationResults: (results) => set({ validationResults: results }),

      setIsValidating: (val) => set({ isValidating: val }),

      togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),

      togglePropertiesPanel: () =>
        set((s) => ({ isPropertiesPanelOpen: !s.isPropertiesPanelOpen })),

      toggleValidationPanel: () =>
        set((s) => ({ isValidationPanelOpen: !s.isValidationPanelOpen })),

      toggleJsonPanel: () => set((s) => ({ isJsonPanelOpen: !s.isJsonPanelOpen })),

      setPaletteOpen: (open) => set({ isPaletteOpen: open }),

      setPropertiesPanelOpen: (open) => set({ isPropertiesPanelOpen: open }),

      setJsonPanelOpen: (open) => set({ isJsonPanelOpen: open }),

      setSnappingEnabled: (enabled) =>
        set((s) => ({ snappingPreferences: { ...s.snappingPreferences, enabled } })),

      setSnappingGridSize: (gridSize) =>
        set((s) => ({
          snappingPreferences: {
            ...s.snappingPreferences,
            gridSize: clampPreference(
              gridSize,
              4,
              128,
              DEFAULT_SNAPPING_PREFERENCES.gridSize
            ),
          },
        })),

      setSnappingThreshold: (threshold) =>
        set((s) => ({
          snappingPreferences: {
            ...s.snappingPreferences,
            threshold: clampPreference(
              threshold,
              0,
              64,
              DEFAULT_SNAPPING_PREFERENCES.threshold
            ),
          },
        })),
    }),
    {
      name: 'archstudio-editor-preferences',
      storage: createJSONStorage<PersistedEditorPreferences>(() => localStorage),
      partialize: (state) => ({ snappingPreferences: state.snappingPreferences }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        snappingPreferences:
          readPersistedSnappingPreferences(persistedState) ?? currentState.snappingPreferences,
      }),
    }
  )
)
