'use client'
import React from 'react'
import { EdgeProps, BaseEdge, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react'

export function ArchEdgeComponent({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, markerEnd,
}: EdgeProps) {
  const edgeData = data as Record<string, unknown> | undefined
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3B82F6' : '#94A3B8',
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: edgeData?.isAsync ? '5,3' : undefined,
        }}
      />
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
            className="absolute pointer-events-none bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-gray-600 shadow-sm"
          >
            {String(edgeData.label)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export const edgeTypes = {
  archEdge: ArchEdgeComponent,
}
