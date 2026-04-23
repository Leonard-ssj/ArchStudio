import { ReviewStatus, WorkflowAction, ReviewEvent, WorkflowTransition } from '@/types'
import { getAvailableTransitions } from '@/config/workflow-transitions'

export function getNextStatus(
  current: ReviewStatus,
  action: WorkflowAction
): ReviewStatus | null {
  const transitions = getAvailableTransitions(current)
  const match = transitions.find((t) => t.action === action)
  return match ? match.to : null
}

export function buildReviewEvent(
  from: ReviewStatus,
  to: ReviewStatus,
  action: WorkflowAction,
  actor: string = 'Current User',
  comment?: string
): ReviewEvent {
  return {
    id: `evt-${Date.now()}`,
    fromStatus: from,
    toStatus: to,
    action,
    timestamp: new Date().toISOString(),
    actor,
    comment,
  }
}

export { getAvailableTransitions }
