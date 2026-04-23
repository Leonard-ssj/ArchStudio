import { ValidationRule, ValidationResult } from '@/types'
import { INVALID_EDGE_PAIRS } from '@/config/validation-rules'

export const invalidEdgeRule: ValidationRule = {
  id: 'invalid-edge',
  name: 'Invalid Edge',
  description: 'Edges between incompatible node types are not allowed',
  severity: 'error',
  category: 'edge_validity',
  layer: 'all',
  evaluate: ({ nodes, edges, layer }) => {
    const results: ValidationResult[] = []
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    for (const edge of edges) {
      const source = nodeMap.get(edge.source)
      const target = nodeMap.get(edge.target)
      if (!source || !target) continue
      const sourceType = source.data.semanticType
      const targetType = target.data.semanticType
      const invalid = INVALID_EDGE_PAIRS.some(
        (pair) => pair.source === sourceType && pair.target === targetType
      )
      if (invalid) {
        results.push({
          id: `invalid-edge-${edge.id}`,
          ruleId: 'invalid-edge',
          severity: 'error',
          message: `Invalid connection: "${source.data.label}" (${sourceType}) → "${target.data.label}" (${targetType})`,
          edgeId: edge.id,
          layer,
          suggestion: 'Remove or reroute this edge — these node types cannot be directly connected',
        })
      }
    }
    return results
  },
}
