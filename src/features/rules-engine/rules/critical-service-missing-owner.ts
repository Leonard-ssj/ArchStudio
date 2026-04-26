import { ValidationRule, ValidationResult } from '@/types'

const CRITICAL_SERVICES = new Set(['backend_service', 'api_service', 'frontend_app'])

export const criticalServiceMissingOwnerRule: ValidationRule = {
  id: 'critical-service-missing-owner',
  name: 'Critical Service Missing Owner',
  description: 'Critical services must define an owner',
  severity: 'error',
  category: 'completeness',
  layer: 'application',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    for (const node of nodes) {
      if (!CRITICAL_SERVICES.has(node.data.semanticType)) continue
      const props = node.data.properties
      if (props.criticality !== 'critical') continue
      if (props.owner) continue
      results.push({
        id: `critical-service-missing-owner-${node.id}`,
        ruleId: 'critical-service-missing-owner',
        severity: 'error',
        message: `Critical service "${node.data.label || node.id}" has no owner`,
        nodeId: node.id,
        layer,
        suggestion: 'Assign an owner team/person for this critical service',
      })
    }
    return results
  },
}
