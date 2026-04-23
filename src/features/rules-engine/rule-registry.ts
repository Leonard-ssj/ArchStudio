import { ValidationRule } from '@/types'
import { requiredLabelRule } from './rules/required-label'
import { requiredMetadataRule } from './rules/required-metadata'
import { requiredPropertiesRule } from './rules/required-properties'
import { appInfraReferenceRule } from './rules/app-infra-reference'
import { infraRequiredFieldsRule } from './rules/infra-required-fields'
import { crossLayerBrokenRefRule } from './rules/cross-layer-broken-ref'
import { invalidEdgeRule } from './rules/invalid-edge'
import { isolatedNodesRule } from './rules/isolated-nodes'
import { duplicateLabelsRule } from './rules/duplicate-labels'
import { missingOwnerCriticalityRule } from './rules/missing-owner-criticality'

export const ACTIVE_RULES: ValidationRule[] = [
  requiredLabelRule,
  requiredMetadataRule,
  requiredPropertiesRule,
  appInfraReferenceRule,
  infraRequiredFieldsRule,
  crossLayerBrokenRefRule,
  invalidEdgeRule,
  isolatedNodesRule,
  duplicateLabelsRule,
  missingOwnerCriticalityRule,
]
