'use client'
import React, { useCallback, useRef, useState } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  OnConnect, OnNodesChange, OnEdgesChange,
  Connection, Node, Edge, Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEditor } from '../hooks/useEditor'
import { useDiagramActions } from '../hooks/useDiagramActions'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { nodeTypes } from '../nodes/ArchNode'
import { edgeTypes } from '../edges/ArchEdge'
import { SemanticNodeType } from '@/types'
import { AlignmentGuide, calculateSnappedPosition } from '../utils/snapping'

export function DiagramCanvas() {
  const language = useUiStore((s) => s.language)
  const theme = useUiStore((s) => s.theme)
  const { currentDiagram, activeLayer } = useEditor()
  const { addNode, addEdge: addArchEdge, updateNodePosition, deleteNode, deleteEdge } = useDiagramActions()
  const setSelectedNode = useEditorStore((s) => s.setSelectedNode)
  const setSelectedEdge = useEditorStore((s) => s.setSelectedEdge)
  const clearSelection = useEditorStore((s) => s.clearSelection)
  const snappingPreferences = useEditorStore((s) => s.snappingPreferences)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([])
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 })
  const diagramNodes = currentDiagram?.nodes
  const diagramEdges = currentDiagram?.edges

  const nodes: Node[] = (diagramNodes ?? []).map((n) => ({
    ...n,
    type: 'archNode',
    data: n.data as unknown as Record<string, unknown>,
  }))

  const edges: Edge[] = (diagramEdges ?? []).map((e) => ({
    ...e,
    type: 'archEdge',
    data: e.data as unknown as Record<string, unknown>,
  }))

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const positionChanges = changes.filter((change) => change.type === 'position' && change.position)
      const shouldAlign = snappingPreferences.enabled && positionChanges.length === 1
      let nextGuides: AlignmentGuide[] = []
      let hasActiveDrag = false

      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          hasActiveDrag = hasActiveDrag || Boolean(change.dragging)
          const currentNode = diagramNodes?.find((node) => node.id === change.id)
          const snapResult = shouldAlign && currentNode
            ? calculateSnappedPosition(currentNode, change.position, diagramNodes ?? [], snappingPreferences)
            : { position: change.position, guides: [] }

          nextGuides = snapResult.guides
          updateNodePosition(change.id, snapResult.position)
        }
        if (change.type === 'remove') {
          deleteNode(change.id)
        }
      })

      if (shouldAlign && hasActiveDrag) {
        setAlignmentGuides(nextGuides)
      } else if (positionChanges.length > 0) {
        setAlignmentGuides([])
      }
    },
    [diagramNodes, snappingPreferences, updateNodePosition, deleteNode]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') deleteEdge(change.id)
      })
    },
    [deleteEdge]
  )

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addArchEdge(connection.source, connection.target)
      }
    },
    [addArchEdge]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/archstudio-node-type') as SemanticNodeType
      if (!type || !reactFlowWrapper.current) return
      const rect = reactFlowWrapper.current.getBoundingClientRect()
      const position = { x: e.clientX - rect.left - 70, y: e.clientY - rect.top - 25 }
      addNode(type, position, activeLayer)
    },
    [addNode, activeLayer]
  )

  const renderGuide = (guide: AlignmentGuide) => {
    if (guide.orientation === 'vertical') {
      const x = guide.position * viewport.zoom + viewport.x
      return (
        <div
          key={`vertical-${guide.position}`}
          className="absolute top-0 bottom-0 w-px bg-sky-500/80 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]"
          style={{ left: x }}
        />
      )
    }

    const y = guide.position * viewport.zoom + viewport.y
    return (
      <div
        key={`horizontal-${guide.position}`}
        className="absolute left-0 right-0 h-px bg-sky-500/80 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]"
        style={{ top: y }}
      />
    )
  }

  if (!currentDiagram) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">{t(language, 'editor.noDiagram')}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 relative" ref={reactFlowWrapper} data-diagram-canvas="true">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStart={() => setAlignmentGuides([])}
        onNodeDragStop={() => setAlignmentGuides([])}
        onMove={(_, nextViewport) => setViewport(nextViewport)}
        onInit={(instance) => setViewport(instance.getViewport())}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onEdgeClick={(_, edge) => setSelectedEdge(edge.id)}
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        snapToGrid={snappingPreferences.enabled}
        snapGrid={[snappingPreferences.gridSize, snappingPreferences.gridSize]}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ type: 'smoothstep', animated: false }}
      >
        <Background gap={16} color="hsl(var(--border))" />
        <Controls />
        <MiniMap
          nodeColor={() => '#94A3B8'}
          maskColor={theme === 'dark' ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.7)'}
          className="!hidden md:!block !border !border-border !rounded"
        />
      </ReactFlow>
      {alignmentGuides.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {alignmentGuides.map(renderGuide)}
        </div>
      )}
    </div>
  )
}
