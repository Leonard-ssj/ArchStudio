import { ValidationRule, ValidationResult } from '@/types'

export const edgeEndpointsExistRule: ValidationRule = {
  id: 'edge-endpoints-exist',
  name: 'Edge Endpoints Exist',
  description: 'Every edge must point to existing source and target nodes',
  severity: 'error',
  category: 'edge_validity',
  layer: 'all',
  evaluate: ({ nodes, edges, layer }) => {
    const results: ValidationResult[] = []
    const nodeIds = new Set(nodes.map((n) => n.id))

    for (const edge of edges) {
      const missingSource = !nodeIds.has(edge.source)
      const missingTarget = !nodeIds.has(edge.target)
      if (!missingSource && !missingTarget) continue

      const missingParts = [
        missingSource ? `source "${edge.source}"` : null,
        missingTarget ? `target "${edge.target}"` : null,
      ]
        .filter(Boolean)
        .join(' and ')

      results.push({
        id: `edge-endpoints-exist-${edge.id}`,
        ruleId: 'edge-endpoints-exist',
        severity: 'error',
        message: `Edge "${edge.id}" points to missing ${missingParts}`,
        edgeId: edge.id,
        layer,
        suggestion: 'Reconnect this edge to existing nodes or delete the broken edge',
      })
    }

    return results
  },
}
