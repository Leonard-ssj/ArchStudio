import { ArchNode } from '@/types'

export interface SnappingPreferences {
  enabled: boolean
  gridSize: number
  threshold: number
}

export interface AlignmentGuide {
  orientation: 'vertical' | 'horizontal'
  position: number
}

export interface SnapResult {
  position: { x: number; y: number }
  guides: AlignmentGuide[]
}

interface NodeBounds {
  left: number
  right: number
  top: number
  bottom: number
  centerX: number
  centerY: number
  width: number
  height: number
}

const DEFAULT_NODE_WIDTH = 180
const DEFAULT_NODE_HEIGHT = 96
const MIN_GRID_SIZE = 1

function asPositiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback
}

function getNodeBounds(node: ArchNode, position = node.position): NodeBounds {
  const width = asPositiveNumber(node.data.properties?.width, node.width ?? DEFAULT_NODE_WIDTH)
  const height = asPositiveNumber(node.data.properties?.height, node.height ?? DEFAULT_NODE_HEIGHT)
  return {
    left: position.x,
    right: position.x + width,
    top: position.y,
    bottom: position.y + height,
    centerX: position.x + width / 2,
    centerY: position.y + height / 2,
    width,
    height,
  }
}

function snapToGrid(position: { x: number; y: number }, gridSize: number) {
  const size = Math.max(MIN_GRID_SIZE, Math.round(gridSize))
  return {
    x: Math.round(position.x / size) * size,
    y: Math.round(position.y / size) * size,
  }
}

function isNearby(candidate: NodeBounds, moving: NodeBounds, threshold: number) {
  const search = threshold * 6
  return !(
    candidate.right < moving.left - search ||
    candidate.left > moving.right + search ||
    candidate.bottom < moving.top - search ||
    candidate.top > moving.bottom + search
  )
}

function nearestAlignment(
  movingPoints: number[],
  targetValues: number[],
  threshold: number
) {
  let best: { delta: number; guidePosition: number } | null = null

  for (const point of movingPoints) {
    for (const target of targetValues) {
      const delta = target - point
      if (Math.abs(delta) > threshold) continue
      if (!best || Math.abs(delta) < Math.abs(best.delta)) {
        best = { delta, guidePosition: target }
      }
    }
  }

  return best
}

export function calculateSnappedPosition(
  node: ArchNode,
  requestedPosition: { x: number; y: number },
  nodes: ArchNode[],
  preferences: SnappingPreferences
): SnapResult {
  if (!preferences.enabled) {
    return { position: requestedPosition, guides: [] }
  }

  const gridPosition = snapToGrid(requestedPosition, preferences.gridSize)
  const threshold = Math.max(0, preferences.threshold)
  const moving = getNodeBounds(node, gridPosition)
  const candidateBounds = nodes
    .filter((candidate) => candidate.id !== node.id)
    .map((candidate) => getNodeBounds(candidate))
    .filter((candidate) => isNearby(candidate, moving, threshold))

  if (candidateBounds.length === 0 || threshold === 0) {
    return { position: gridPosition, guides: [] }
  }

  const verticalTargets = candidateBounds.flatMap((candidate) => [
    candidate.left,
    candidate.centerX,
    candidate.right,
  ])
  const horizontalTargets = candidateBounds.flatMap((candidate) => [
    candidate.top,
    candidate.centerY,
    candidate.bottom,
  ])

  const verticalSnap = nearestAlignment(
    [
      moving.left,
      moving.centerX,
      moving.right,
    ],
    verticalTargets,
    threshold
  )
  const horizontalSnap = nearestAlignment(
    [
      moving.top,
      moving.centerY,
      moving.bottom,
    ],
    horizontalTargets,
    threshold
  )

  const nextPosition = {
    x: Math.max(0, gridPosition.x + (verticalSnap?.delta ?? 0)),
    y: Math.max(0, gridPosition.y + (horizontalSnap?.delta ?? 0)),
  }

  return {
    position: nextPosition,
    guides: [
      ...(verticalSnap ? [{ orientation: 'vertical' as const, position: verticalSnap.guidePosition }] : []),
      ...(horizontalSnap ? [{ orientation: 'horizontal' as const, position: horizontalSnap.guidePosition }] : []),
    ],
  }
}
