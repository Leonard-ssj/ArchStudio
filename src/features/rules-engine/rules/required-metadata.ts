import { ValidationRule, ValidationResult } from '@/types'

export const requiredMetadataRule: ValidationRule = {
  id: 'required-metadata',
  name: 'Required Metadata',
  description: 'Every diagram must have name and description',
  severity: 'error',
  category: 'required_fields',
  layer: 'all',
  evaluate: ({ diagram, layer }) => {
    const results: ValidationResult[] = []
    if (!diagram.name || diagram.name.trim() === '') {
      results.push({
        id: `required-metadata-name-${diagram.id}`,
        ruleId: 'required-metadata',
        severity: 'error',
        message: 'Diagram has no name',
        layer,
        suggestion: 'Add a name to this diagram',
      })
    }
    if (!diagram.description || diagram.description.trim() === '') {
      results.push({
        id: `required-metadata-desc-${diagram.id}`,
        ruleId: 'required-metadata',
        severity: 'error',
        message: 'Diagram has no description',
        layer,
        suggestion: 'Add a description to this diagram',
      })
    }
    return results
  },
}
