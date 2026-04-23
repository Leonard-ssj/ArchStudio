// ============================================================
// Zod Schemas - Validation schemas for JSON import/export
// ============================================================

import { z } from 'zod';

// ---- Base enums ----

export const LayerTypeSchema = z.enum(['application', 'infrastructure', 'data']);

export const ReviewStatusSchema = z.enum(['draft', 'in_review', 'approved', 'rejected']);

export const SeveritySchema = z.enum(['error', 'warning', 'info']);

export const SemanticNodeTypeSchema = z.enum([
  'user', 'external_system',
  'api_service', 'backend_service', 'frontend_app',
  'database', 'cache', 'queue',
  'gcp_vm', 'gcp_cloud_run', 'gcp_gke', 'gcp_load_balancer',
  'gcp_vpc', 'gcp_subnet', 'gcp_firewall',
  'gcp_storage', 'gcp_pubsub',
  'network',
  'secret_manager', 'iam', 'service_account',
  'generic', 'annotation',
]);

export const EdgeRelationTypeSchema = z.enum([
  'calls', 'depends_on', 'reads_from', 'writes_to',
  'publishes_to', 'subscribes_from', 'routes_to',
  'authenticates_with', 'contains', 'connects_to', 'generic',
]);

// ---- Node schemas ----

export const NodePropertiesSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  environment: z.enum(['production', 'staging', 'development', 'testing']).optional(),
  owner: z.string().optional(),
  criticality: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'deprecated', 'planned', 'decommissioned']).optional(),
  region: z.string().optional(),
  gcpProject: z.string().optional(),
  ipAddress: z.string().optional(),
  subnet: z.string().optional(),
  hostname: z.string().optional(),
  vpc: z.string().optional(),
  zone: z.string().optional(),
  machineType: z.string().optional(),
  technology: z.string().optional(),
  protocol: z.string().optional(),
  port: z.number().optional(),
  version: z.string().optional(),
  runtime: z.string().optional(),
  engine: z.string().optional(),
  replicationMode: z.enum(['single', 'multi-region', 'read-replica']).optional(),
  storageClass: z.string().optional(),
  retentionDays: z.number().optional(),
  relatedInfraNodeId: z.string().optional(),
  relatedAppNodeId: z.string().optional(),
  relatedDataNodeId: z.string().optional(),
}).passthrough(); // Allow additional custom properties

export const CrossLayerReferenceSchema = z.object({
  sourceNodeId: z.string(),
  sourceLayer: LayerTypeSchema,
  targetNodeId: z.string(),
  targetLayer: LayerTypeSchema,
  referenceType: z.enum(['runs_on', 'stores_data_in', 'depends_on', 'secured_by']),
  status: z.enum(['resolved', 'broken', 'missing']),
});

export const ValidationResultSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  severity: SeveritySchema,
  message: z.string(),
  nodeId: z.string().optional(),
  edgeId: z.string().optional(),
  layer: LayerTypeSchema.optional(),
  suggestion: z.string().optional(),
});

export const ArchNodeDataSchema = z.object({
  semanticType: SemanticNodeTypeSchema,
  label: z.string(),
  description: z.string(),
  properties: NodePropertiesSchema,
  layer: LayerTypeSchema,
  crossLayerRefs: z.array(CrossLayerReferenceSchema),
  validationErrors: z.array(ValidationResultSchema),
});

export const ArchNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: ArchNodeDataSchema,
  width: z.number().optional(),
  height: z.number().optional(),
});

// ---- Edge schemas ----

export const ArchEdgeDataSchema = z.object({
  relationType: EdgeRelationTypeSchema,
  label: z.string().optional(),
  description: z.string().optional(),
  protocol: z.string().optional(),
  port: z.number().optional(),
  isAsync: z.boolean().optional(),
  isBidirectional: z.boolean().optional(),
});

export const ArchEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  animated: z.boolean().optional(),
  data: ArchEdgeDataSchema.optional(),
  label: z.string().optional(),
});

// ---- Diagram & System schemas ----

export const ReviewEventSchema = z.object({
  id: z.string(),
  fromStatus: ReviewStatusSchema,
  toStatus: ReviewStatusSchema,
  action: z.string(),
  timestamp: z.string(),
  actor: z.string(),
  comment: z.string().optional(),
});

export const DiagramMetadataSchema = z.object({
  version: z.string(),
  lastEditedBy: z.string(),
  notes: z.string().optional(),
});

export const DiagramModelSchema = z.object({
  id: z.string(),
  systemId: z.string(),
  layer: LayerTypeSchema,
  name: z.string().min(1, 'Diagram name is required'),
  description: z.string(),
  nodes: z.array(ArchNodeSchema),
  edges: z.array(ArchEdgeSchema),
  metadata: DiagramMetadataSchema,
  reviewStatus: ReviewStatusSchema,
  reviewHistory: z.array(ReviewEventSchema),
  validationResults: z.array(ValidationResultSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SystemMetadataSchema = z.object({
  version: z.string(),
  createdBy: z.string(),
  organization: z.string().optional(),
  domain: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const SystemModelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'System name is required'),
  description: z.string(),
  owner: z.string(),
  metadata: SystemMetadataSchema,
  diagrams: z.array(DiagramModelSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ArchStudioExportSchema = z.object({
  formatVersion: z.literal('1.0'),
  exportedAt: z.string(),
  system: SystemModelSchema,
});
