// ============================================================
// Workflow Types - Review status and transitions
// ============================================================

export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export interface ReviewEvent {
  id: string;
  fromStatus: ReviewStatus;
  toStatus: ReviewStatus;
  action: WorkflowAction;
  timestamp: string; // ISO
  actor: string; // mock user name
  comment?: string;
}

export type WorkflowAction =
  | 'submit_for_review'
  | 'approve'
  | 'reject'
  | 'return_to_draft'
  | 'reopen';

export interface WorkflowTransition {
  from: ReviewStatus;
  to: ReviewStatus;
  action: WorkflowAction;
  label: string; // display text for the UI button
  confirmMessage?: string;
}
