// ============================================================
// System & Diagram Models - Core domain types
// ============================================================

import { LayerType } from './layers';
import { ArchNode } from './nodes';
import { ArchEdge } from './edges';
import { ReviewStatus, ReviewEvent } from './workflow';
import { ValidationResult } from './validation';

/**
 * Metadata for a system.
 */
export interface SystemMetadata {
  version: string;
  createdBy: string;
  organization?: string;
  domain?: string;
  tags?: string[];
}

/**
 * Metadata for a diagram.
 */
export interface DiagramMetadata {
  version: string;
  lastEditedBy: string;
  notes?: string;
}

/**
 * A single architectural diagram associated with a specific layer.
 */
export interface DiagramModel {
  id: string;
  systemId: string;
  layer: LayerType;
  name: string;
  description: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  metadata: DiagramMetadata;
  reviewStatus: ReviewStatus;
  reviewHistory: ReviewEvent[];
  validationResults: ValidationResult[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/**
 * A complete architectural system containing multiple layer diagrams.
 * This is the top-level entity and the root of the JSON export.
 */
export interface SystemModel {
  id: string;
  name: string;
  description: string;
  owner: string;
  metadata: SystemMetadata;
  diagrams: DiagramModel[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/**
 * The canonical JSON schema for import/export.
 * This is the serialized format of SystemModel.
 */
export interface ArchStudioExportFormat {
  formatVersion: '1.0';
  exportedAt: string; // ISO
  system: SystemModel;
}
