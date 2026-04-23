import { ValidationRule, ValidationResult } from '@/types'

export const crossLayerBrokenRefRule: ValidationRule = {
  id: 'cross-layer-broken-ref',
  name: 'Broken Cross-Layer Reference',
  description: 'Cross-layer references must point to existing nodes',
  severity: 'error',
  category: 'cross_layer',
  layer: 'all',
  evaluate: ({ nodes, allDiagrams, layer }) => {
    const results: ValidationResult[] = []
    const allNodeIds = new Set(allDiagrams.flatMap((d) => d.nodes.map((n) => n.id)))

    for (const node of nodes) {
      for (const ref of node.data.crossLayerRefs ?? []) {
        if (!allNodeIds.has(ref.targetNodeId)) {
          results.push({
            id: `cross-layer-broken-ref-${node.id}-${ref.targetNodeId}`,
            ruleId: 'cross-layer-broken-ref',
            severity: 'error',
            message: `"${node.data.label || node.id}" references non-existent node "${ref.targetNodeId}"`,
            nodeId: node.id,
            layer,
            suggestion: 'Remove the broken reference or create the missing target node',
          })
        }
      }
      // Also check relatedInfraNodeId / relatedAppNodeId / relatedDataNodeId
      const props = node.data.properties
      const refFields = ['relatedInfraNodeId', 'relatedAppNodeId', 'relatedDataNodeId'] as const
      for (const field of refFields) {
        const refId = props[field as keyof typeof props] as string | undefined
        if (refId && !allNodeIds.has(refId)) {
          results.push({
            id: `cross-layer-broken-ref-prop-${node.id}-${field}`,
            ruleId: 'cross-layer-broken-ref',
            severity: 'error',
            message: `"${node.data.label || node.id}" has a broken ${field}: "${refId}" does not exist`,
            nodeId: node.id,
            layer,
            suggestion: 'Fix or remove the broken reference',
          })
        }
      }
    }
    return results
  },
}
