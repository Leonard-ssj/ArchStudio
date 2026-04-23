'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSystemStore } from '@/store/system-store'
import { TopBar } from '@/components/layout/TopBar'
import { ComponentPalette } from '@/features/diagram-editor/components/ComponentPalette'
import { DiagramCanvas } from '@/features/diagram-editor/components/DiagramCanvas'
import { PropertiesPanel } from '@/features/diagram-editor/components/PropertiesPanel'
import { ValidationPanel } from '@/features/diagram-editor/components/ValidationPanel'
import { useEditorStore } from '@/store/editor-store'

export default function EditorPage() {
  const params = useParams()
  const systemId = params?.systemId as string
  const setActiveSystem = useSystemStore((s) => s.setActiveSystem)
  const isPaletteOpen = useEditorStore((s) => s.isPaletteOpen)
  const isPropertiesPanelOpen = useEditorStore((s) => s.isPropertiesPanelOpen)
  const isValidationPanelOpen = useEditorStore((s) => s.isValidationPanelOpen)

  useEffect(() => {
    if (systemId) setActiveSystem(decodeURIComponent(systemId))
  }, [systemId, setActiveSystem])

  return (
    <>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {isPaletteOpen && <ComponentPalette />}
        <main className="flex-1 flex flex-col overflow-hidden">
          <DiagramCanvas />
          {isValidationPanelOpen && <ValidationPanel />}
        </main>
        {isPropertiesPanelOpen && <PropertiesPanel />}
      </div>
    </>
  )
}
