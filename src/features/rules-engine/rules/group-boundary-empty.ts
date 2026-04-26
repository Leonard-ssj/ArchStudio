import { ValidationRule, ValidationResult, ArchNode } from '@/types'

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function isNodeInsideGroup(group: ArchNode, node: ArchNode): boolean {
  const width = asNumber(group.data.properties?.width, group.width ?? 420)
  const height = asNumber(group.data.properties?.height, group.height ?? 240)
  const gx1 = group.position.x
  const gy1 = group.position.y
  const gx2 = gx1 + width
  const gy2 = gy1 + height
  return node.position.x >= gx1 && node.position.x <= gx2 && node.position.y >= gy1 && node.position.y <= gy2
}

export const groupBoundaryEmptyRule: ValidationRule = {
  id: 'group-boundary-empty',
  name: 'Group Boundary Has Content',
  description: 'Group boundaries should contain at least one component',
  severity: 'warning',
  category: 'completeness',
  layer: 'all',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    const groups = nodes.filter((n) => n.data.semanticType === 'group')
    const components = nodes.filter((n) => n.data.semanticType !== 'group')

    for (const group of groups) {
      const hasContainedNode = components.some((node) => isNodeInsideGroup(group, node))
      if (hasContainedNode) continue

      results.push({
        id: `group-boundary-empty-${group.id}`,
        ruleId: 'group-boundary-empty',
        severity: 'warning',
        message: `Group "${group.data.label || group.id}" has no components inside its boundary`,
        nodeId: group.id,
        layer,
        suggestion: 'Resize/reposition this group or move related components inside it',
      })
    }

    return results
  },
}
