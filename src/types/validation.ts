// ============================================================
// Validation Types - Rules engine and validation results
// ============================================================

import { LayerType } from './layers';
import { ArchNode } from './nodes';
import { ArchEdge } from './edges';
import { DiagramModel } from './system';

export type Severity = 'error' | 'warning' | 'info';

/**
 * Result of a validation rule evaluation.
 */
export interface ValidationResult {
  id: string;
  ruleId: string;
  severity: Severity;
  message: string;
  nodeId?: string;
  edgeId?: string;
  layer?: LayerType;
  suggestion?: string;
}

/**
 * Context passed to each validation rule for evaluation.
 */
export interface ValidationContext {
  diagram: DiagramModel;
  allDiagrams: DiagramModel[]; // all diagrams in the system (for cross-layer checks)
  nodes: ArchNode[];
  edges: ArchEdge[];
  layer: LayerType;
}

/**
 * A validation rule definition.
 * Each rule is a pure function that evaluates a context and returns results.
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  category: ValidationCategory;
  layer: LayerType | 'all'; // which layer this rule applies to
  evaluate: (context: ValidationContext) => ValidationResult[];
}

export type ValidationCategory =
  | 'required_fields'
  | 'cross_layer'
  | 'edge_validity'
  | 'consistency'
  | 'completeness';

/**
 * Summary of validation results for display in the UI.
 */
export interface ValidationSummary {
  totalErrors: number;
  totalWarnings: number;
  totalInfo: number;
  results: ValidationResult[];
  lastValidatedAt: string; // ISO timestamp
}
