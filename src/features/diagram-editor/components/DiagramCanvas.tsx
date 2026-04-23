'use client'
import React, { useCallback, useRef } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  OnConnect, OnNodesChange, applyNodeChanges, OnEdgesChange,
  Connection, Node, Edge,
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

export function DiagramCanvas() {
  const language = useUiStore((s) => s.language)
  const theme = useUiStore((s) => s.theme)
  const { currentDiagram, activeLayer } = useEditor()
  const { addNode, addEdge: addArchEdge, updateNodePosition, deleteNode, deleteEdge } = useDiagramActions()
  const setSelectedNode = useEditorStore((s) => s.setSelectedNode)
  const setSelectedEdge = useEditorStore((s) => s.setSelectedEdge)
  const clearSelection = useEditorStore((s) => s.clearSelection)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const nodes: Node[] = (currentDiagram?.nodes ?? []).map((n) => ({
    ...n,
    type: 'archNode',
    data: n.data as unknown as Record<string, unknown>,
  }))

  const edges: Edge[] = (currentDiagram?.edges ?? []).map((e) => ({
    ...e,
    type: e.type ?? 'smoothstep',
    data: e.data as unknown as Record<string, unknown>,
  }))

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      applyNodeChanges(changes, nodes)
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          updateNodePosition(change.id, change.position)
        }
        if (change.type === 'remove') {
          deleteNode(change.id)
        }
      })
    },
    [nodes, updateNodePosition, deleteNode]
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
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onEdgeClick={(_, edge) => setSelectedEdge(edge.id)}
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.2 }}
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
    </div>
  )
}
