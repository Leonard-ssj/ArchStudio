// ============================================================
// Workflow Transitions - Allowed state transitions for review
// ============================================================

import { WorkflowTransition } from '@/types/workflow';

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  {
    from: 'draft',
    to: 'in_review',
    action: 'submit_for_review',
    label: 'Submit for Review',
    confirmMessage: 'Submit this diagram for review?',
  },
  {
    from: 'in_review',
    to: 'approved',
    action: 'approve',
    label: 'Approve',
    confirmMessage: 'Approve this diagram?',
  },
  {
    from: 'in_review',
    to: 'rejected',
    action: 'reject',
    label: 'Reject',
    confirmMessage: 'Reject this diagram? You can add a comment explaining why.',
  },
  {
    from: 'rejected',
    to: 'draft',
    action: 'return_to_draft',
    label: 'Return to Draft',
  },
  {
    from: 'approved',
    to: 'draft',
    action: 'reopen',
    label: 'Reopen',
    confirmMessage: 'Reopen this approved diagram for editing?',
  },
];

export function getAvailableTransitions(currentStatus: string): WorkflowTransition[] {
  return WORKFLOW_TRANSITIONS.filter((t) => t.from === currentStatus);
}
