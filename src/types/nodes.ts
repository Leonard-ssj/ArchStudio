// ============================================================
// Node Types - Semantic node definitions for architecture
// ============================================================

import { LayerType } from './layers';
import { ValidationResult } from './validation';

/**
 * All available semantic node types.
 * Each type maps to a real architectural component with specific required properties.
 */
export type SemanticNodeType =
  // Actors & External
  | 'user'
  | 'external_system'
  // Application components
  | 'api_service'
  | 'backend_service'
  | 'frontend_app'
  // Data components
  | 'database'
  | 'cache'
  | 'queue'
  // GCP Infrastructure
  | 'gcp_vm'
  | 'gcp_cloud_run'
  | 'gcp_gke'
  | 'gcp_load_balancer'
  | 'gcp_vpc'
  | 'gcp_subnet'
  | 'gcp_firewall'
  | 'gcp_storage'
  | 'gcp_pubsub'
  // Network
  | 'network'
  // Security / IAM
  | 'secret_manager'
  | 'iam'
  | 'service_account'
  // Generic
  | 'generic'
  | 'annotation';

/**
 * Dynamic properties for a node, dependent on its SemanticNodeType.
 * Not all fields apply to all types - see config/node-definitions.ts
 */
export interface NodeProperties {
  // Common
  label: string;
  description?: string;
  environment?: 'production' | 'staging' | 'development' | 'testing';
  owner?: string;
  criticality?: 'critical' | 'high' | 'medium' | 'low';
  tags?: string[];
  status?: 'active' | 'deprecated' | 'planned' | 'decommissioned';

  // Infrastructure / GCP
  region?: string;
  gcpProject?: string;
  ipAddress?: string;
  subnet?: string;
  hostname?: string;
  vpc?: string;
  zone?: string;
  machineType?: string;

  // Application / Service
  technology?: string;
  protocol?: string;
  port?: number;
  version?: string;
  runtime?: string;

  // Data
  engine?: string;
  replicationMode?: 'single' | 'multi-region' | 'read-replica';
  storageClass?: string;
  retentionDays?: number;

  // Cross-layer references (string IDs)
  relatedInfraNodeId?: string;
  relatedAppNodeId?: string;
  relatedDataNodeId?: string;

  // Extensible: any additional custom properties
  [key: string]: unknown;
}

/**
 * Cross-layer reference between nodes in different architectural layers.
 */
export interface CrossLayerReference {
  sourceNodeId: string;
  sourceLayer: LayerType;
  targetNodeId: string;
  targetLayer: LayerType;
  referenceType: 'runs_on' | 'stores_data_in' | 'depends_on' | 'secured_by';
  status: 'resolved' | 'broken' | 'missing';
}

/**
 * The data payload inside a React Flow node.
 * Contains all semantic information about the architectural component.
 */
export interface ArchNodeData {
  semanticType: SemanticNodeType;
  label: string;
  description: string;
  properties: NodeProperties;
  layer: LayerType;
  crossLayerRefs: CrossLayerReference[];
  validationErrors: ValidationResult[];
}

/**
 * Full ArchNode = React Flow node shape + semantic data.
 */
export interface ArchNode {
  id: string;
  type: string; // React Flow visual node type (maps to custom node component)
  position: { x: number; y: number };
  data: ArchNodeData;
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
}

/**
 * Definition of a node type for the component palette.
 * Used to configure which properties are required/optional per type.
 */
export interface NodeTypeDefinition {
  semanticType: SemanticNodeType;
  displayName: string;
  description: string;
  category: NodeCategory;
  icon: string; // lucide icon name
  color: string;
  allowedLayers: LayerType[];
  requiredProperties: (keyof NodeProperties)[];
  optionalProperties: (keyof NodeProperties)[];
  defaultProperties: Partial<NodeProperties>;
}

export type NodeCategory =
  | 'actors'
  | 'application'
  | 'data'
  | 'gcp_compute'
  | 'gcp_network'
  | 'gcp_storage'
  | 'security'
  | 'other';
