'use client'
import { useCallback } from 'react'
import { useSystemStore } from '@/store/system-store'
import { useEditorStore } from '@/store/editor-store'
import { ArchNode, ArchEdge, NodeProperties, SemanticNodeType, LayerType } from '@/types'
import { getNodeDefinition } from '@/config/node-definitions'

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const NODE_WIDTH = 180
const NODE_HEIGHT = 96
const NODE_GAP = 28

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function findFreePosition(
  position: { x: number; y: number },
  nodes: ArchNode[],
  size: { w: number; h: number }
) {
  const safeX = Math.max(0, position.x)
  const safeY = Math.max(0, position.y)
  const maxAttempts = 200
  for (let i = 0; i < maxAttempts; i++) {
    const row = Math.floor(i / 10)
    const col = i % 10
    const candidate = {
      x: safeX + col * NODE_GAP,
      y: safeY + row * NODE_GAP,
      w: size.w,
      h: size.h,
    }
    const overlaps = nodes.some((n) =>
      rectsOverlap(candidate, {
        x: n.position.x,
        y: n.position.y,
        w: n.width ?? NODE_WIDTH,
        h: n.height ?? NODE_HEIGHT,
      })
    )
    if (!overlaps) return { x: candidate.x, y: candidate.y }
  }
  return { x: safeX + NODE_GAP, y: safeY + NODE_GAP }
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
      const p = (def.defaultProperties ?? {}) as Record<string, unknown>
      const nodeWidth = typeof p.width === 'number' ? p.width : NODE_WIDTH
      const nodeHeight = typeof p.height === 'number' ? p.height : NODE_HEIGHT
      const newNode: ArchNode = {
        id,
        type: 'archNode',
        position,
        width: nodeWidth,
        height: nodeHeight,
        zIndex: semanticType === 'group' ? -1 : 1,
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
      patchDiagram((nodes, edges) => {
        const nextPosition = findFreePosition(position, nodes, { w: nodeWidth, h: nodeHeight })
        return { nodes: [...nodes, { ...newNode, position: nextPosition }], edges }
      })
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
      const safePosition = {
        x: Math.max(0, position.x),
        y: Math.max(0, position.y),
      }
      patchDiagram((nodes, edges) => ({
        nodes: nodes.map((n) => (n.id === nodeId ? { ...n, position: safePosition } : n)),
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
