'use client'
import React, { useState } from 'react'
import { ReviewStatus, WorkflowAction } from '@/types'
import { getAvailableTransitions } from '@/config/workflow-transitions'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'

interface WorkflowActionsProps {
  currentStatus: ReviewStatus
  onTransition: (action: WorkflowAction, comment?: string) => void
}

const actionVariant: Record<WorkflowAction, 'primary' | 'secondary' | 'danger' | 'ghost'> = {
  submit_for_review: 'primary',
  approve: 'primary',
  reject: 'danger',
  return_to_draft: 'secondary',
  reopen: 'secondary',
}

const confirmMessages: Record<WorkflowAction, { en: string; es: string }> = {
  submit_for_review: {
    en: 'Submit this diagram for review?',
    es: 'Deseas enviar este diagrama a revision?',
  },
  approve: {
    en: 'Approve this diagram?',
    es: 'Deseas aprobar este diagrama?',
  },
  reject: {
    en: 'Reject this diagram? You can add a comment explaining why.',
    es: 'Deseas rechazar este diagrama? Puedes agregar un comentario.',
  },
  return_to_draft: {
    en: 'Return this diagram to draft?',
    es: 'Deseas devolver este diagrama a borrador?',
  },
  reopen: {
    en: 'Reopen this approved diagram for editing?',
    es: 'Deseas reabrir este diagrama aprobado para editar?',
  },
}

export function WorkflowActions({ currentStatus, onTransition }: WorkflowActionsProps) {
  const language = useUiStore((s) => s.language)
  const transitions = getAvailableTransitions(currentStatus)
  const [pending, setPending] = useState<WorkflowAction | null>(null)
  const [comment, setComment] = useState('')

  const handleConfirm = () => {
    if (!pending) return
    onTransition(pending, comment || undefined)
    setPending(null)
    setComment('')
  }

  if (transitions.length === 0) return null

  return (
    <>
      <div className="flex items-center gap-2">
        {transitions.map((transition) => (
          <Button
            key={transition.action}
            size="sm"
            variant={actionVariant[transition.action]}
            onClick={() => {
              if (transition.confirmMessage) {
                setPending(transition.action)
              } else {
                onTransition(transition.action)
              }
            }}
          >
            {t(language, `workflow.${transition.action}`)}
          </Button>
        ))}
      </div>

      <Dialog
        open={pending !== null}
        onClose={() => { setPending(null); setComment('') }}
        title={t(language, 'workflow.confirmAction')}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => { setPending(null); setComment('') }}>{t(language, 'landing.cancel')}</Button>
            <Button variant="primary" size="sm" onClick={handleConfirm}>{t(language, 'workflow.confirm')}</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {pending ? confirmMessages[pending][language] : ''}
        </p>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded text-sm p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t(language, 'workflow.optionalComment')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Dialog>
    </>
  )
}
