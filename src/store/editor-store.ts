import { create } from 'zustand'
import { LayerType, DiagramModel, ArchNode, ArchEdge, ValidationResult, ReviewStatus } from '@/types'

interface EditorStore {
  activeLayer: LayerType
  selectedNodeId: string | null
  selectedEdgeId: string | null
  validationResults: ValidationResult[]
  isValidating: boolean
  isPaletteOpen: boolean
  isPropertiesPanelOpen: boolean
  isValidationPanelOpen: boolean

  setActiveLayer: (layer: LayerType) => void
  setSelectedNode: (id: string | null) => void
  setSelectedEdge: (id: string | null) => void
  clearSelection: () => void
  setValidationResults: (results: ValidationResult[]) => void
  setIsValidating: (val: boolean) => void
  togglePalette: () => void
  togglePropertiesPanel: () => void
  toggleValidationPanel: () => void
  setPaletteOpen: (open: boolean) => void
  setPropertiesPanelOpen: (open: boolean) => void

  // Per-diagram node/edge operations
  // These mutate the system via systemStore — the editor store just tracks UI state
  // Actual diagram mutations happen through useDiagramActions hook
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeLayer: 'application',
  selectedNodeId: null,
  selectedEdgeId: null,
  validationResults: [],
  isValidating: false,
  isPaletteOpen: true,
  isPropertiesPanelOpen: true,
  isValidationPanelOpen: true,

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

  setPaletteOpen: (open) => set({ isPaletteOpen: open }),

  setPropertiesPanelOpen: (open) => set({ isPropertiesPanelOpen: open }),
}))
