// ============================================================
// Edge Types - Connections between architectural nodes
// ============================================================

/**
 * Semantic edge types describing the relationship between nodes.
 */
export type EdgeRelationType =
  | 'calls'
  | 'depends_on'
  | 'reads_from'
  | 'writes_to'
  | 'publishes_to'
  | 'subscribes_from'
  | 'routes_to'
  | 'authenticates_with'
  | 'contains'
  | 'connects_to'
  | 'generic';

export interface ArchEdgeData {
  relationType: EdgeRelationType;
  label?: string;
  description?: string;
  protocol?: string;
  port?: number;
  isAsync?: boolean;
  isBidirectional?: boolean;
}

/**
 * Full ArchEdge = React Flow edge shape + semantic data.
 */
export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  type?: string; // React Flow edge type
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  data?: ArchEdgeData;
  label?: string;
  style?: Record<string, unknown>;
}
