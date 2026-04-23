import { ValidationRule, ValidationResult } from '@/types'
import { KEY_COMPONENT_TYPES } from '@/config/validation-rules'

export const missingOwnerCriticalityRule: ValidationRule = {
  id: 'missing-owner-criticality',
  name: 'Missing Owner / Criticality',
  description: 'Key components should have an owner and criticality level defined',
  severity: 'warning',
  category: 'completeness',
  layer: 'all',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    for (const node of nodes) {
      if (!(KEY_COMPONENT_TYPES as readonly string[]).includes(node.data.semanticType)) continue
      const props = node.data.properties
      if (!props.owner) {
        results.push({
          id: `missing-owner-${node.id}`,
          ruleId: 'missing-owner-criticality',
          severity: 'warning',
          message: `"${node.data.label || node.id}" has no owner assigned`,
          nodeId: node.id,
          layer,
          suggestion: 'Assign an owner team or person responsible for this component',
        })
      }
      if (!props.criticality) {
        results.push({
          id: `missing-criticality-${node.id}`,
          ruleId: 'missing-owner-criticality',
          severity: 'warning',
          message: `"${node.data.label || node.id}" has no criticality level defined`,
          nodeId: node.id,
          layer,
          suggestion: 'Set criticality (low / medium / high / critical)',
        })
      }
    }
    return results
  },
}
