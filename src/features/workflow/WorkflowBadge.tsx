import React from 'react'
import { ReviewStatus } from '@/types'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'

interface WorkflowBadgeProps {
  status: ReviewStatus
}

const statusConfig: Record<ReviewStatus, { labelKey: string; className: string }> = {
  draft: {
    labelKey: 'workflow.draft',
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
  },
  in_review: {
    labelKey: 'workflow.in_review',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  },
  approved: {
    labelKey: 'workflow.approved',
    className: 'bg-green-100 text-green-800 border border-green-300',
  },
  rejected: {
    labelKey: 'workflow.rejected',
    className: 'bg-red-100 text-red-700 border border-red-300',
  },
}

export function WorkflowBadge({ status }: WorkflowBadgeProps) {
  const language = useUiStore((s) => s.language)
  const cfg = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}
    >
      {t(language, cfg.labelKey)}
    </span>
  )
}
