'use client'
import { useCallback } from 'react'
import { useSystemStore } from '@/store/system-store'
import { useEditorStore } from '@/store/editor-store'
import { ArchNode, ArchEdge, NodeProperties, SemanticNodeType, LayerType } from '@/types'
import { getNodeDefinition } from '@/config/node-definitions'

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useDiagramActions() {
  const system = useSystemStore((s) => s.getActiveSystem())
  const updateSystem = useSystemStore((s) => s.updateSystem)
  const activeLayer = useEditorStore((s) => s.activeLayer)

  const getDiagram = useCallback(() => {
    return system?.diagrams.find((d) => d.layer === activeLayer) ?? null
  }, [system, activeLayer])

  const patchDiagram = useCallback(
    (updater: (nodes: ArchNode[], edges: ArchEdge[]) => { nodes: ArchNode[]; edges: ArchEdge[] }) => {
      if (!system) return
      const diagram = getDiagram()
      if (!diagram) return
      const { nodes, edges } = updater(diagram.nodes, diagram.edges)
      const updatedSystem = {
        ...system,
        updatedAt: new Date().toISOString(),
        diagrams: system.diagrams.map((d) =>
          d.layer === activeLayer ? { ...d, nodes, edges, updatedAt: new Date().toISOString() } : d
        ),
      }
      updateSystem(updatedSystem)
    },
    [system, getDiagram, updateSystem, activeLayer]
  )

  const addNode = useCallback(
    (semanticType: SemanticNodeType, position: { x: number; y: number }, layer: LayerType) => {
      const def = getNodeDefinition(semanticType)
      if (!def) return
      const id = generateId(semanticType.replace('_', '-'))
      const newNode: ArchNode = {
        id,
        type: 'archNode',
        position,
        data: {
          semanticType,
          label: def.defaultProperties?.label ?? def.displayName,
          description: '',
          properties: { ...(def.defaultProperties ?? {}) } as NodeProperties,
          layer,
          crossLayerRefs: [],
          validationErrors: [],
        },
      }
      patchDiagram((nodes, edges) => ({ nodes: [...nodes, newNode], edges }))
      return id
    },
    [patchDiagram]
  )

  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<ArchNode['data']>) => {
      patchDiagram((nodes, edges) => ({
        nodes: nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
        ),
        edges,
      }))
    },
    [patchDiagram]
  )

  const updateNodePosition = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      patchDiagram((nodes, edges) => ({
        nodes: nodes.map((n) => (n.id === nodeId ? { ...n, position } : n)),
        edges,
      }))
    },
    [patchDiagram]
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      patchDiagram((nodes, edges) => ({
        nodes: nodes.filter((n) => n.id !== nodeId),
        edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      }))
    },
    [patchDiagram]
  )

  const addEdge = useCallback(
    (source: string, target: string, label?: string) => {
      const id = generateId('edge')
      const newEdge: ArchEdge = {
        id,
        source,
        target,
        type: 'smoothstep',
        animated: false,
        data: { relationType: 'generic', label },
        label,
      }
      patchDiagram((nodes, edges) => ({ nodes, edges: [...edges, newEdge] }))
    },
    [patchDiagram]
  )

  const deleteEdge = useCallback(
    (edgeId: string) => {
      patchDiagram((nodes, edges) => ({ nodes, edges: edges.filter((e) => e.id !== edgeId) }))
    },
    [patchDiagram]
  )

  return { addNode, updateNodeData, updateNodePosition, deleteNode, addEdge, deleteEdge }
}
