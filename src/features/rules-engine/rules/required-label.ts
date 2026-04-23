import { ValidationRule, ValidationResult } from '@/types'

export const requiredLabelRule: ValidationRule = {
  id: 'required-label',
  name: 'Required Label',
  description: 'Every node must have a non-empty label',
  severity: 'error',
  category: 'required_fields',
  layer: 'all',
  evaluate: ({ nodes, layer }) =>
    nodes
      .filter((n) => !n.data.label || n.data.label.trim() === '')
      .map((n): ValidationResult => ({
        id: `required-label-${n.id}`,
        ruleId: 'required-label',
        severity: 'error',
        message: `Node "${n.id}" has no label`,
        nodeId: n.id,
        layer,
        suggestion: 'Add a descriptive label to this node',
      })),
}
