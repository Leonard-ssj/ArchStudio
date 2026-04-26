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
const GROUP_PADDING = 36
const GROUP_MIN_WIDTH = 320
const GROUP_MIN_HEIGHT = 180

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

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function getNodeSize(node: ArchNode) {
  const width = asNumber(node.data.properties?.width, node.width ?? NODE_WIDTH)
  const height = asNumber(node.data.properties?.height, node.height ?? NODE_HEIGHT)
  return { width, height }
}

function isInsideGroup(group: ArchNode, node: ArchNode) {
  const { width, height } = getNodeSize(group)
  const x1 = group.position.x
  const y1 = group.position.y
  const x2 = x1 + width
  const y2 = y1 + height
  const centerX = node.position.x + getNodeSize(node).width / 2
  const centerY = node.position.y + getNodeSize(node).height / 2
  return centerX >= x1 && centerX <= x2 && centerY >= y1 && centerY <= y2
}

function autoFitGroups(nodes: ArchNode[]): ArchNode[] {
  const groups = nodes.filter((n) => n.data.semanticType === 'group')
  if (groups.length === 0) return nodes
  const components = nodes.filter((n) => n.data.semanticType !== 'group')
  const byId = new Map(nodes.map((n) => [n.id, n]))

  for (const group of groups) {
    const members = components.filter((node) => isInsideGroup(group, node))
    if (members.length === 0) continue

    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY
    for (const member of members) {
      const size = getNodeSize(member)
      minX = Math.min(minX, member.position.x)
      minY = Math.min(minY, member.position.y)
      maxX = Math.max(maxX, member.position.x + size.width)
      maxY = Math.max(maxY, member.position.y + size.height)
    }

    const nextWidth = Math.max(GROUP_MIN_WIDTH, maxX - group.position.x + GROUP_PADDING)
    const nextHeight = Math.max(GROUP_MIN_HEIGHT, maxY - group.position.y + GROUP_PADDING)
    byId.set(group.id, {
      ...group,
      width: nextWidth,
      height: nextHeight,
      data: {
        ...group.data,
        properties: {
          ...group.data.properties,
          width: nextWidth,
          height: nextHeight,
        } as NodeProperties,
      },
    })
  }

  return nodes.map((node) => byId.get(node.id) ?? node)
}

function autoLayoutByGroups(nodes: ArchNode[]): ArchNode[] {
  const groups = nodes.filter((n) => n.data.semanticType === 'group')
  if (groups.length === 0) return nodes
  const nextNodes = [...nodes]

  for (const group of groups) {
    const members = nextNodes.filter(
      (node) => node.data.semanticType !== 'group' && isInsideGroup(group, node)
    )
    if (members.length === 0) continue

    const cols = Math.max(1, Math.ceil(Math.sqrt(members.length)))
    const gapX = 28
    const gapY = 22
    const startX = group.position.x + 24
    const startY = group.position.y + 36
    let currentMaxX = group.position.x
    let currentMaxY = group.position.y

    members.forEach((member, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const size = getNodeSize(member)
      const x = startX + col * (size.width + gapX)
      const y = startY + row * (size.height + gapY)
      member.position = { x, y }
      currentMaxX = Math.max(currentMaxX, x + size.width)
      currentMaxY = Math.max(currentMaxY, y + size.height)
    })

    const width = Math.max(GROUP_MIN_WIDTH, currentMaxX - group.position.x + 28)
    const height = Math.max(GROUP_MIN_HEIGHT, currentMaxY - group.position.y + 28)
    group.width = width
    group.height = height
    group.data = {
      ...group.data,
      properties: {
        ...group.data.properties,
        width,
        height,
      } as NodeProperties,
    }
  }

  return nextNodes
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
        const merged = [...nodes, { ...newNode, position: nextPosition }]
        return { nodes: autoFitGroups(merged), edges }
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
        nodes: autoFitGroups(nodes.map((n) => (n.id === nodeId ? { ...n, position: safePosition } : n))),
        edges,
      }))
    },
    [patchDiagram]
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      patchDiagram((nodes, edges) => {
        const nextNodes = nodes.filter((n) => n.id !== nodeId)
        return {
          nodes: autoFitGroups(nextNodes),
          edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        }
      })
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
        type: 'archEdge',
        animated: false,
        data: { relationType: 'generic', label, lineType: 'smoothstep', linePattern: 'solid' } as ArchEdge['data'],
        label,
      }
      patchDiagram((nodes, edges) => ({ nodes, edges: [...edges, newEdge] }))
    },
    [patchDiagram]
  )

  const updateEdge = useCallback(
    (edgeId: string, updates: Partial<ArchEdge>) => {
      patchDiagram((nodes, edges) => ({
        nodes,
        edges: edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)),
      }))
    },
    [patchDiagram]
  )

  const updateEdgeData = useCallback(
    (edgeId: string, updates: Record<string, unknown>) => {
      patchDiagram((nodes, edges) => ({
        nodes,
        edges: edges.map((e) =>
          e.id === edgeId
            ? {
                ...e,
                data: {
                  relationType: e.data?.relationType ?? 'generic',
                  ...(e.data ?? {}),
                  ...updates,
                },
              }
            : e
        ),
      }))
    },
    [patchDiagram]
  )

  const deleteEdge = useCallback(
    (edgeId: string) => {
      patchDiagram((nodes, edges) => ({ nodes, edges: edges.filter((e) => e.id !== edgeId) }))
    },
    [patchDiagram]
  )

  const applyAutoLayoutGroups = useCallback(() => {
    patchDiagram((nodes, edges) => ({
      nodes: autoFitGroups(autoLayoutByGroups([...nodes])),
      edges,
    }))
  }, [patchDiagram])

  return {
    addNode,
    updateNodeData,
    updateNodePosition,
    deleteNode,
    addEdge,
    updateEdge,
    updateEdgeData,
    deleteEdge,
    applyAutoLayoutGroups,
  }
}
