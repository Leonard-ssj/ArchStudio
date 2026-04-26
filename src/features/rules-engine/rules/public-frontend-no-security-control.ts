import { ValidationRule, ValidationResult } from '@/types'

const SECURITY_TYPES = new Set(['gcp_firewall', 'iam', 'service_account', 'secret_manager', 'gcp_load_balancer'])

export const publicFrontendNoSecurityControlRule: ValidationRule = {
  id: 'public-frontend-no-security-control',
  name: 'Public Frontend Without Security Control',
  description: 'Public production frontends should connect to at least one security control component',
  severity: 'warning',
  category: 'cross_layer',
  layer: 'application',
  evaluate: ({ nodes, edges, layer }) => {
    const results: ValidationResult[] = []
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    const connections = new Map<string, Set<string>>()
    for (const edge of edges) {
      if (!connections.has(edge.source)) connections.set(edge.source, new Set())
      if (!connections.has(edge.target)) connections.set(edge.target, new Set())
      connections.get(edge.source)?.add(edge.target)
      connections.get(edge.target)?.add(edge.source)
    }

    for (const node of nodes) {
      if (node.data.semanticType !== 'frontend_app') continue
      const env = node.data.properties?.environment
      const isPublic = Boolean(node.data.properties?.publicExposure) || String(node.data.label).toLowerCase().includes('public')
      if (env !== 'production' || !isPublic) continue
      const linkedNodeIds = Array.from(connections.get(node.id) ?? [])
      const hasSecurityControl = linkedNodeIds.some((id) => SECURITY_TYPES.has(nodeMap.get(id)?.data.semanticType ?? ''))
      if (hasSecurityControl) continue
      results.push({
        id: `public-frontend-no-security-control-${node.id}`,
        ruleId: 'public-frontend-no-security-control',
        severity: 'warning',
        message: `Public frontend "${node.data.label || node.id}" has no direct security control`,
        nodeId: node.id,
        layer,
        suggestion: 'Connect this frontend to security controls (LB/WAF, firewall, IAM, secrets)',
      })
    }
    return results
  },
}
