// ============================================================
// Node Type Definitions - Catalog of all semantic node types
// with their required/optional properties per type
// ============================================================

import { NodeTypeDefinition } from '@/types/nodes';

export const NODE_DEFINITIONS: NodeTypeDefinition[] = [
  // ---- Actors & External ----
  {
    semanticType: 'user',
    displayName: 'User / Actor',
    description: 'A human user or actor interacting with the system',
    category: 'actors',
    icon: 'User',
    color: '#6366F1', // indigo
    allowedLayers: ['application'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'tags'],
    defaultProperties: { label: 'User' },
  },
  {
    semanticType: 'external_system',
    displayName: 'External System',
    description: 'An external system or third-party service',
    category: 'actors',
    icon: 'Globe',
    color: '#8B5CF6', // violet
    allowedLayers: ['application', 'infrastructure'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'owner', 'protocol', 'tags'],
    defaultProperties: { label: 'External System' },
  },

  // ---- Application Components ----
  {
    semanticType: 'api_service',
    displayName: 'API Service',
    description: 'A REST/GraphQL/gRPC API service',
    category: 'application',
    icon: 'Webhook',
    color: '#3B82F6', // blue
    allowedLayers: ['application'],
    requiredProperties: ['label', 'technology', 'owner'],
    optionalProperties: ['description', 'protocol', 'port', 'version', 'environment', 'criticality', 'relatedInfraNodeId', 'tags', 'status'],
    defaultProperties: { label: 'API Service', protocol: 'HTTPS', port: 443 },
  },
  {
    semanticType: 'backend_service',
    displayName: 'Backend Service',
    description: 'A backend microservice or monolith',
    category: 'application',
    icon: 'Server',
    color: '#2563EB', // blue-600
    allowedLayers: ['application'],
    requiredProperties: ['label', 'technology', 'owner'],
    optionalProperties: ['description', 'runtime', 'version', 'environment', 'criticality', 'relatedInfraNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Backend Service' },
  },
  {
    semanticType: 'frontend_app',
    displayName: 'Frontend App',
    description: 'A web or mobile frontend application',
    category: 'application',
    icon: 'Monitor',
    color: '#06B6D4', // cyan
    allowedLayers: ['application'],
    requiredProperties: ['label', 'technology'],
    optionalProperties: ['description', 'version', 'environment', 'owner', 'criticality', 'relatedInfraNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Frontend App', technology: 'React' },
  },

  // ---- Data Components ----
  {
    semanticType: 'database',
    displayName: 'Database',
    description: 'A relational or NoSQL database',
    category: 'data',
    icon: 'Database',
    color: '#10B981', // emerald
    allowedLayers: ['data', 'application'],
    requiredProperties: ['label', 'engine', 'owner'],
    optionalProperties: ['description', 'version', 'replicationMode', 'environment', 'criticality', 'relatedAppNodeId', 'relatedInfraNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Database', engine: 'PostgreSQL' },
  },
  {
    semanticType: 'cache',
    displayName: 'Cache',
    description: 'An in-memory cache layer (Redis, Memcached)',
    category: 'data',
    icon: 'Zap',
    color: '#F59E0B', // amber
    allowedLayers: ['data', 'application'],
    requiredProperties: ['label', 'engine'],
    optionalProperties: ['description', 'version', 'environment', 'owner', 'criticality', 'relatedAppNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Cache', engine: 'Redis' },
  },
  {
    semanticType: 'queue',
    displayName: 'Queue / Messaging',
    description: 'A message queue or event bus',
    category: 'data',
    icon: 'ArrowRightLeft',
    color: '#F97316', // orange
    allowedLayers: ['data', 'application'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'engine', 'environment', 'owner', 'criticality', 'relatedAppNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Message Queue' },
  },

  // ---- GCP Compute ----
  {
    semanticType: 'gcp_vm',
    displayName: 'GCP VM / Compute Engine',
    description: 'A Google Cloud Compute Engine virtual machine',
    category: 'gcp_compute',
    icon: '/icons/gcp/compute_engine.svg',
    color: '#4285F4', // GCP blue
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'region', 'gcpProject'],
    optionalProperties: ['description', 'machineType', 'zone', 'ipAddress', 'subnet', 'hostname', 'vpc', 'environment', 'owner', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'GCP VM', region: 'us-central1' },
  },
  {
    semanticType: 'gcp_cloud_run',
    displayName: 'GCP Cloud Run',
    description: 'A Google Cloud Run serverless container service',
    category: 'gcp_compute',
    icon: '/icons/gcp/cloud_run.svg',
    color: '#4285F4',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'region', 'gcpProject'],
    optionalProperties: ['description', 'runtime', 'environment', 'owner', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'Cloud Run Service', region: 'us-central1' },
  },
  {
    semanticType: 'gcp_gke',
    displayName: 'GCP GKE',
    description: 'A Google Kubernetes Engine cluster',
    category: 'gcp_compute',
    icon: '/icons/gcp/google_kubernetes_engine.svg',
    color: '#4285F4',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'region', 'gcpProject'],
    optionalProperties: ['description', 'version', 'machineType', 'zone', 'vpc', 'subnet', 'environment', 'owner', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'GKE Cluster', region: 'us-central1' },
  },
  {
    semanticType: 'gcp_load_balancer',
    displayName: 'GCP Load Balancer',
    description: 'A Google Cloud Load Balancer',
    category: 'gcp_network',
    icon: '/icons/gcp/cloud_load_balancing.svg',
    color: '#EA4335', // GCP red
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'protocol', 'port', 'region', 'ipAddress', 'environment', 'owner', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'Load Balancer', protocol: 'HTTPS', port: 443 },
  },

  // ---- GCP Network ----
  {
    semanticType: 'gcp_vpc',
    displayName: 'GCP VPC',
    description: 'A Google Cloud Virtual Private Cloud network',
    category: 'gcp_network',
    icon: '/icons/gcp/virtual_private_cloud.svg',
    color: '#34A853', // GCP green
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'region', 'environment', 'owner', 'tags', 'status'],
    defaultProperties: { label: 'VPC Network' },
  },
  {
    semanticType: 'gcp_subnet',
    displayName: 'GCP Subnet',
    description: 'A subnet within a GCP VPC',
    category: 'gcp_network',
    icon: '/icons/gcp/cloud_network.svg',
    color: '#34A853',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject', 'region'],
    optionalProperties: ['description', 'ipAddress', 'vpc', 'environment', 'owner', 'tags', 'status'],
    defaultProperties: { label: 'Subnet', region: 'us-central1' },
  },
  {
    semanticType: 'gcp_firewall',
    displayName: 'GCP Firewall',
    description: 'A GCP firewall rule',
    category: 'gcp_network',
    icon: '/icons/gcp/cloud_firewall_rules.svg',
    color: '#EA4335',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'protocol', 'port', 'vpc', 'environment', 'owner', 'tags', 'status'],
    defaultProperties: { label: 'Firewall Rule' },
  },

  // ---- GCP Storage ----
  {
    semanticType: 'gcp_storage',
    displayName: 'GCP Cloud Storage',
    description: 'A Google Cloud Storage bucket',
    category: 'gcp_storage',
    icon: '/icons/gcp/cloud_storage.svg',
    color: '#4285F4',
    allowedLayers: ['infrastructure', 'data'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'region', 'storageClass', 'retentionDays', 'environment', 'owner', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'Cloud Storage', storageClass: 'STANDARD' },
  },
  {
    semanticType: 'gcp_pubsub',
    displayName: 'GCP Pub/Sub',
    description: 'A Google Cloud Pub/Sub topic',
    category: 'gcp_storage',
    icon: '/icons/gcp/pubsub.svg',
    color: '#4285F4',
    allowedLayers: ['infrastructure', 'data'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'region', 'environment', 'owner', 'criticality', 'relatedAppNodeId', 'tags', 'status'],
    defaultProperties: { label: 'Pub/Sub Topic' },
  },

  // ---- Network ----
  {
    semanticType: 'network',
    displayName: 'Network / Internet',
    description: 'Represents the internet or a network boundary',
    category: 'other',
    icon: 'Wifi',
    color: '#6B7280', // gray
    allowedLayers: ['infrastructure', 'application'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'tags'],
    defaultProperties: { label: 'Internet' },
  },

  // ---- Security ----
  {
    semanticType: 'secret_manager',
    displayName: 'Secret Manager',
    description: 'A secrets management service',
    category: 'security',
    icon: '/icons/gcp/secret_manager.svg',
    color: '#EF4444', // red
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'environment', 'owner', 'tags', 'status'],
    defaultProperties: { label: 'Secret Manager' },
  },
  {
    semanticType: 'iam',
    displayName: 'IAM',
    description: 'Identity and Access Management configuration',
    category: 'security',
    icon: '/icons/gcp/identity_and_access_management.svg',
    color: '#EF4444',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'gcpProject', 'owner', 'tags'],
    defaultProperties: { label: 'IAM' },
  },
  {
    semanticType: 'service_account',
    displayName: 'Service Account',
    description: 'A GCP service account for authentication',
    category: 'security',
    icon: '/icons/gcp/permissions.svg',
    color: '#EF4444',
    allowedLayers: ['infrastructure'],
    requiredProperties: ['label', 'gcpProject'],
    optionalProperties: ['description', 'owner', 'tags', 'status'],
    defaultProperties: { label: 'Service Account' },
  },

  // ---- Generic ----
  {
    semanticType: 'generic',
    displayName: 'Generic Component',
    description: 'A generic architectural component',
    category: 'other',
    icon: 'Box',
    color: '#9CA3AF', // gray-400
    allowedLayers: ['application', 'infrastructure', 'data'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'owner', 'environment', 'criticality', 'tags', 'status'],
    defaultProperties: { label: 'Component' },
  },
  {
    semanticType: 'group',
    displayName: 'Group / Boundary',
    description: 'Visual boundary to group related components (subgraph/container)',
    category: 'other',
    icon: 'LayoutGrid',
    color: '#A78BFA',
    allowedLayers: ['application', 'infrastructure', 'data'],
    requiredProperties: ['label'],
    optionalProperties: ['description', 'owner', 'tags'],
    defaultProperties: { label: 'Group', width: 420, height: 240 },
  },
  {
    semanticType: 'annotation',
    displayName: 'Annotation / Note',
    description: 'A text annotation or note on the diagram',
    category: 'other',
    icon: 'StickyNote',
    color: '#FCD34D', // amber-300
    allowedLayers: ['application', 'infrastructure', 'data'],
    requiredProperties: ['label'],
    optionalProperties: ['description'],
    defaultProperties: { label: 'Note' },
  },
];

/**
 * Get node definition by semantic type.
 */
export function getNodeDefinition(semanticType: string): NodeTypeDefinition | undefined {
  return NODE_DEFINITIONS.find((def) => def.semanticType === semanticType);
}

/**
 * Get node definitions allowed for a specific layer.
 */
export function getNodeDefinitionsForLayer(layer: string): NodeTypeDefinition[] {
  return NODE_DEFINITIONS.filter((def) => def.allowedLayers.includes(layer as any));
}

/**
 * Get node definitions grouped by category.
 */
export function getNodeDefinitionsByCategory(): Record<string, NodeTypeDefinition[]> {
  return NODE_DEFINITIONS.reduce(
    (acc, def) => {
      if (!acc[def.category]) acc[def.category] = [];
      acc[def.category].push(def);
      return acc;
    },
    {} as Record<string, NodeTypeDefinition[]>
  );
}
