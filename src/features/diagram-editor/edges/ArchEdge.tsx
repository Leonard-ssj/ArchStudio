'use client'
import React from 'react'
import {
  EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  EdgeLabelRenderer,
} from '@xyflow/react'

export function ArchEdgeComponent({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, markerEnd,
}: EdgeProps) {
  const edgeData = data as Record<string, unknown> | undefined
  const lineType = String(edgeData?.lineType ?? 'smoothstep')
  const [edgePath, labelX, labelY] =
    lineType === 'bezier'
      ? getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
      : lineType === 'straight'
        ? getStraightPath({ sourceX, sourceY, targetX, targetY })
        : getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const pattern = String(edgeData?.linePattern ?? (edgeData?.isAsync ? 'dashed' : 'solid'))
  const dashArray = pattern === 'dotted' ? '2,5' : pattern === 'dashed' ? '7,5' : undefined

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3B82F6' : String((edgeData?.strokeColor as string) ?? '#94A3B8'),
          strokeWidth: selected ? 2.2 : Number(edgeData?.strokeWidth ?? 1.6),
          strokeDasharray: dashArray,
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
