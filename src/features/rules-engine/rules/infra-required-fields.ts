import { ValidationRule, ValidationResult } from '@/types'

const GCP_TYPES_NEEDING_REGION = [
  'gcp_vm', 'gcp_cloud_run', 'gcp_gke', 'gcp_subnet',
] as const

const GCP_TYPES_NEEDING_PROJECT = [
  'gcp_vm', 'gcp_cloud_run', 'gcp_gke', 'gcp_load_balancer',
  'gcp_vpc', 'gcp_subnet', 'gcp_firewall', 'gcp_storage',
  'gcp_pubsub', 'secret_manager', 'service_account',
] as const

export const infraRequiredFieldsRule: ValidationRule = {
  id: 'infra-required-fields',
  name: 'Infra Required Fields',
  description: 'GCP infrastructure nodes must have region and gcpProject',
  severity: 'error',
  category: 'required_fields',
  layer: 'infrastructure',
  evaluate: ({ nodes, layer }) => {
    const results: ValidationResult[] = []
    for (const node of nodes) {
      const type = node.data.semanticType as string
      const props = node.data.properties
      if ((GCP_TYPES_NEEDING_REGION as readonly string[]).includes(type) && !props.region) {
        results.push({
          id: `infra-required-fields-region-${node.id}`,
          ruleId: 'infra-required-fields',
          severity: 'error',
          message: `"${node.data.label || node.id}" is missing required field: region`,
          nodeId: node.id,
          layer,
          suggestion: 'Set the GCP region (e.g., us-central1)',
        })
      }
      if ((GCP_TYPES_NEEDING_PROJECT as readonly string[]).includes(type) && !props.gcpProject) {
        results.push({
          id: `infra-required-fields-project-${node.id}`,
          ruleId: 'infra-required-fields',
          severity: 'error',
          message: `"${node.data.label || node.id}" is missing required field: gcpProject`,
          nodeId: node.id,
          layer,
          suggestion: 'Set the GCP project ID',
        })
      }
    }
    return results
  },
}
