import React from 'react'

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-background">
      {children}
    </div>
  )
}
