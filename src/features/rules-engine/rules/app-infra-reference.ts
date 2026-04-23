import { ValidationRule, ValidationResult } from '@/types'
import { DEPLOYABLE_APP_TYPES } from '@/config/validation-rules'

export const appInfraReferenceRule: ValidationRule = {
  id: 'app-infra-reference',
  name: 'App-Infra Reference',
  description: 'Deployable application nodes should reference an infrastructure node',
  severity: 'warning',
  category: 'cross_layer',
  layer: 'application',
  evaluate: ({ nodes, layer }) =>
    nodes
      .filter(
        (n) =>
          DEPLOYABLE_APP_TYPES.includes(n.data.semanticType as typeof DEPLOYABLE_APP_TYPES[number]) &&
          !n.data.properties.relatedInfraNodeId
      )
      .map((n): ValidationResult => ({
        id: `app-infra-reference-${n.id}`,
        ruleId: 'app-infra-reference',
        severity: 'warning',
        message: `"${n.data.label || n.id}" has no infrastructure reference (relatedInfraNodeId)`,
        nodeId: n.id,
        layer,
        suggestion: 'Set relatedInfraNodeId to link this service to its deployment target',
      })),
}
