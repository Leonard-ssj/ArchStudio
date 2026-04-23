'use client'
import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card text-card-foreground shadow-xl mx-4',
            maxWidthClasses[maxWidth]
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <DialogPrimitive.Title className="text-sm font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="p-1 rounded hover:bg-accent text-muted-foreground">
              <X size={16} />
            </DialogPrimitive.Close>
          </div>

          <div className="p-4 text-foreground">{children}</div>
          {actions && (
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-border bg-muted/40 rounded-b-lg">
              {actions}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
