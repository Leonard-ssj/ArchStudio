'use client'
import { useEditorStore } from '@/store/editor-store'
import { useSystemStore } from '@/store/system-store'
import { DiagramModel, LayerType } from '@/types'

export function useEditor() {
  const activeLayer = useEditorStore((s) => s.activeLayer)
  const setActiveLayer = useEditorStore((s) => s.setActiveLayer)
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
  const selectedEdgeId = useEditorStore((s) => s.selectedEdgeId)
  const setSelectedNode = useEditorStore((s) => s.setSelectedNode)
  const setSelectedEdge = useEditorStore((s) => s.setSelectedEdge)
  const clearSelection = useEditorStore((s) => s.clearSelection)

  const system = useSystemStore((s) => s.getActiveSystem())

  const currentDiagram: DiagramModel | null =
    system?.diagrams.find((d) => d.layer === activeLayer) ?? null

  const selectedNode = currentDiagram?.nodes.find((n) => n.id === selectedNodeId) ?? null
  const selectedEdge = currentDiagram?.edges.find((e) => e.id === selectedEdgeId) ?? null

  return {
    system,
    currentDiagram,
    activeLayer,
    selectedNodeId,
    selectedEdgeId,
    selectedNode,
    selectedEdge,
    setActiveLayer: (layer: LayerType) => setActiveLayer(layer),
    setSelectedNode,
    setSelectedEdge,
    clearSelection,
  }
}
