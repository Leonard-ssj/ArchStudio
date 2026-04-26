import { ValidationRule, ValidationResult, ArchNode } from '@/types'

const SENSITIVE_TYPES = new Set(['database', 'cache', 'gcp_storage'])

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function isSecureGroup(group: ArchNode): boolean {
  const label = String(group.data.label ?? '').toLowerCase()
  const tags = Array.isArray(group.data.properties?.tags)
    ? (group.data.properties?.tags as string[]).map((tag) => tag.toLowerCase())
    : []
  return (
    label.includes('secure') ||
    label.includes('pci') ||
    label.includes('private') ||
    tags.includes('secure') ||
    tags.includes('pci') ||
    tags.includes('hipaa')
  )
}

function isInside(group: ArchNode, node: ArchNode): boolean {
  const width = asNumber(group.data.properties?.width, group.width ?? 420)
  const height = asNumber(group.data.properties?.height, group.height ?? 240)
  const x1 = group.position.x
  const y1 = group.position.y
  const x2 = x1 + width
  const y2 = y1 + height
  const cx = node.position.x + asNumber(node.width, 150) / 2
  const cy = node.position.y + asNumber(node.height, 90) / 2
  return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2
}

export const sensitiveDataOutsideSecureZoneRule: ValidationRule = {
  id: 'sensitive-data-outside-secure-zone',
  name: 'Sensitive Data Outside Secure Zone',
  description: 'Sensitive data components should be inside a secure boundary/group',
  severity: 'warning',
  category: 'consistency',
  layer: 'all',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    const secureGroups = nodes.filter((node) => node.data.semanticType === 'group' && isSecureGroup(node))
    if (secureGroups.length === 0) return results

    for (const node of nodes) {
      if (!SENSITIVE_TYPES.has(node.data.semanticType)) continue
      const markedSensitive = node.data.properties?.criticality === 'critical' || String(node.data.properties?.dataClass ?? '').toLowerCase() === 'sensitive'
      if (!markedSensitive) continue
      const covered = secureGroups.some((group) => isInside(group, node))
      if (covered) continue
      results.push({
        id: `sensitive-data-outside-secure-zone-${node.id}`,
        ruleId: 'sensitive-data-outside-secure-zone',
        severity: 'warning',
        message: `Sensitive data node "${node.data.label || node.id}" is outside secure boundaries`,
        nodeId: node.id,
        layer,
        suggestion: 'Move this data component into a secure group (e.g., PCI/Private zone)',
      })
    }
    return results
  },
}
