'use client'
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Dialog({ open, onClose, title, children, actions, maxWidth = 'md' }: DialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={['relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full mx-4', maxWidthClasses[maxWidth]].join(' ')}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 text-gray-800 dark:text-gray-100">{children}</div>
        {actions && (
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
