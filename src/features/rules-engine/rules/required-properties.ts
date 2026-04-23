import { ValidationRule, ValidationResult } from '@/types'
import { getNodeDefinition } from '@/config/node-definitions'

export const requiredPropertiesRule: ValidationRule = {
  id: 'required-properties',
  name: 'Required Properties',
  description: 'Each node type has mandatory properties that must be filled',
  severity: 'error',
  category: 'required_fields',
  layer: 'all',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    for (const node of nodes) {
      const def = getNodeDefinition(node.data.semanticType)
      if (!def) continue
      for (const field of def.requiredProperties) {
        if (field === 'label') continue // covered by required-label rule
        const val = (node.data.properties as Record<string, unknown>)[field]
        if (val === undefined || val === null || val === '') {
          results.push({
            id: `required-properties-${node.id}-${field}`,
            ruleId: 'required-properties',
            severity: 'error',
            message: `Node "${node.data.label || node.id}" is missing required field: ${field}`,
            nodeId: node.id,
            layer,
            suggestion: `Fill in the "${field}" property for this node`,
          })
        }
      }
    }
    return results
  },
}
