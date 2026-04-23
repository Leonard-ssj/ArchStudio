import { DiagramModel, ValidationResult, ValidationContext, ValidationSummary } from '@/types'
import { ACTIVE_RULES } from './rule-registry'

export function runValidation(
  diagram: DiagramModel,
  allDiagrams: DiagramModel[]
): ValidationSummary {
  const context: ValidationContext = {
    diagram,
    allDiagrams,
    nodes: diagram.nodes,
    edges: diagram.edges,
    layer: diagram.layer,
  }

  const results: ValidationResult[] = []
  for (const rule of ACTIVE_RULES) {
    if (rule.layer !== 'all' && rule.layer !== diagram.layer) continue
    try {
      const ruleResults = rule.evaluate(context)
      results.push(...ruleResults)
    } catch {
      // Rule evaluation errors should not crash the UI
    }
  }

  return {
    totalErrors: results.filter((r) => r.severity === 'error').length,
    totalWarnings: results.filter((r) => r.severity === 'warning').length,
    totalInfo: results.filter((r) => r.severity === 'info').length,
    results,
    lastValidatedAt: new Date().toISOString(),
  }
}

export { ACTIVE_RULES }
