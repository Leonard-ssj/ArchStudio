// ============================================================
// Layer Types - Architectural layer definitions
// ============================================================

export type LayerType = 'application' | 'infrastructure' | 'data';

// Future extensible layers (not in MVP)
// export type ExtendedLayerType = LayerType | 'security' | 'integration' | 'business';

export interface LayerConfig {
  id: LayerType;
  name: string;
  description: string;
  color: string;
  lightColor: string;
  icon: string; // lucide icon name
  allowedNodeTypes: string[]; // SemanticNodeType[]
}
