import { ValidationRule, ValidationResult } from '@/types'

export const isolatedNodesRule: ValidationRule = {
  id: 'isolated-nodes',
  name: 'Isolated Nodes',
  description: 'Nodes with no connections should be reviewed',
  severity: 'warning',
  category: 'completeness',
  layer: 'all',
  evaluate: ({ nodes, edges, layer }) => {
    const connectedIds = new Set(edges.flatMap((e) => [e.source, e.target]))
    return nodes
      .filter((n) => n.data.semanticType !== 'annotation' && !connectedIds.has(n.id))
      .map((n): ValidationResult => ({
        id: `isolated-nodes-${n.id}`,
        ruleId: 'isolated-nodes',
        severity: 'warning',
        message: `"${n.data.label || n.id}" has no connections`,
        nodeId: n.id,
        layer,
        suggestion: 'Connect this node to others or remove it if unused',
      }))
  },
}
