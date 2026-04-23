import { ValidationRule, ValidationResult } from '@/types'

export const duplicateLabelsRule: ValidationRule = {
  id: 'duplicate-labels',
  name: 'Duplicate Labels',
  description: 'Nodes with duplicate labels in the same layer create ambiguity',
  severity: 'warning',
  category: 'consistency',
  layer: 'all',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    const labelMap = new Map<string, string[]>()
    for (const node of nodes) {
      const lbl = (node.data.label ?? '').trim().toLowerCase()
      if (!lbl) continue
      if (!labelMap.has(lbl)) labelMap.set(lbl, [])
      labelMap.get(lbl)!.push(node.id)
    }
    labelMap.forEach((ids, label) => {
      if (ids.length > 1) {
        ids.forEach((id) => {
          results.push({
            id: `duplicate-labels-${id}`,
            ruleId: 'duplicate-labels',
            severity: 'warning',
            message: `Duplicate label "${label}" — ${ids.length} nodes share this name`,
            nodeId: id,
            layer,
            suggestion: 'Use unique labels to avoid confusion in documentation and cross-references',
          })
        })
      }
    })
    return results
  },
}
