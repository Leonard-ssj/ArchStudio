// ============================================================
// Validation Rules Configuration
// Reference file documenting all MVP validation rules.
// Actual rule implementations go in src/features/rules-engine/rules/
// ============================================================

/**
 * RULE CATALOG - 10 MVP validation rules
 *
 * Each rule is a pure function: (ValidationContext) => ValidationResult[]
 *
 * Implementation pattern:
 * ```
 * export const ruleName: ValidationRule = {
 *   id: 'rule-id',
 *   name: 'Human Readable Name',
 *   description: 'What this rule checks',
 *   severity: 'error' | 'warning' | 'info',
 *   category: 'required_fields' | 'cross_layer' | 'edge_validity' | 'consistency' | 'completeness',
 *   layer: 'application' | 'infrastructure' | 'data' | 'all',
 *   evaluate: (ctx) => { ... return results; }
 * };
 * ```
 */

export const VALIDATION_RULE_CATALOG = [
  {
    id: 'required-label',
    name: 'Required Label',
    description: 'Every node must have a non-empty label',
    severity: 'error' as const,
    category: 'required_fields' as const,
    layer: 'all' as const,
  },
  {
    id: 'required-metadata',
    name: 'Required Diagram Metadata',
    description: 'Every diagram must have name and description',
    severity: 'error' as const,
    category: 'required_fields' as const,
    layer: 'all' as const,
  },
  {
    id: 'required-properties',
    name: 'Required Properties by Type',
    description: 'Each node type has mandatory properties that must be filled',
    severity: 'error' as const,
    category: 'required_fields' as const,
    layer: 'all' as const,
  },
  {
    id: 'app-infra-reference',
    name: 'Application-Infrastructure Reference',
    description: 'Deployable application nodes (backend_service, api_service, frontend_app) should have a relatedInfraNodeId',
    severity: 'warning' as const,
    category: 'cross_layer' as const,
    layer: 'application' as const,
  },
  {
    id: 'infra-required-fields',
    name: 'Infrastructure Required Fields',
    description: 'GCP infrastructure nodes must have region and gcpProject',
    severity: 'error' as const,
    category: 'required_fields' as const,
    layer: 'infrastructure' as const,
  },
  {
    id: 'cross-layer-broken-ref',
    name: 'Broken Cross-Layer Reference',
    description: 'Cross-layer references pointing to non-existent nodes are errors',
    severity: 'error' as const,
    category: 'cross_layer' as const,
    layer: 'all' as const,
  },
  {
    id: 'invalid-edge',
    name: 'Invalid Edge Connection',
    description: 'Edges between incompatible node types (e.g., annotation -> database) are invalid',
    severity: 'error' as const,
    category: 'edge_validity' as const,
    layer: 'all' as const,
  },
  {
    id: 'edge-endpoints-exist',
    name: 'Edge Endpoints Exist',
    description: 'Every edge must point to nodes that exist in the current diagram',
    severity: 'error' as const,
    category: 'edge_validity' as const,
    layer: 'all' as const,
  },
  {
    id: 'isolated-nodes',
    name: 'Isolated Nodes',
    description: 'Nodes with no connections (edges) may indicate incomplete modeling',
    severity: 'warning' as const,
    category: 'completeness' as const,
    layer: 'all' as const,
  },
  {
    id: 'duplicate-labels',
    name: 'Duplicate Labels',
    description: 'Multiple nodes with the same label within a layer cause confusion',
    severity: 'warning' as const,
    category: 'consistency' as const,
    layer: 'all' as const,
  },
  {
    id: 'group-boundary-empty',
    name: 'Group Boundary Has Content',
    description: 'Group boundaries should contain at least one component',
    severity: 'warning' as const,
    category: 'completeness' as const,
    layer: 'all' as const,
  },
  {
    id: 'missing-owner-criticality',
    name: 'Missing Owner or Criticality',
    description: 'Key components (services, databases) should have owner and criticality assigned',
    severity: 'warning' as const,
    category: 'completeness' as const,
    layer: 'all' as const,
  },
] as const;

/**
 * Invalid edge combinations - annotation nodes should not connect to data components.
 */
export const INVALID_EDGE_PAIRS: Array<{ source: string; target: string }> = [
  { source: 'annotation', target: 'database' },
  { source: 'annotation', target: 'cache' },
  { source: 'annotation', target: 'backend_service' },
  { source: 'annotation', target: 'api_service' },
  { source: 'annotation', target: 'gcp_vm' },
  { source: 'annotation', target: 'gcp_cloud_run' },
  { source: 'annotation', target: 'gcp_gke' },
  { source: 'database', target: 'annotation' },
  { source: 'cache', target: 'annotation' },
  { source: 'backend_service', target: 'annotation' },
  { source: 'api_service', target: 'annotation' },
];

/**
 * Node types that are considered "deployable" and should reference infrastructure.
 */
export const DEPLOYABLE_APP_TYPES = [
  'backend_service',
  'api_service',
  'frontend_app',
] as const;

/**
 * Node types that are considered "key components" requiring owner and criticality.
 */
export const KEY_COMPONENT_TYPES = [
  'backend_service',
  'api_service',
  'frontend_app',
  'database',
  'cache',
  'gcp_vm',
  'gcp_cloud_run',
  'gcp_gke',
] as const;
