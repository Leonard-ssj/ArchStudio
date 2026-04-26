'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSystemStore } from '@/store/system-store'
import { TopBar } from '@/components/layout/TopBar'
import { ComponentPalette } from '@/features/diagram-editor/components/ComponentPalette'
import { DiagramCanvas } from '@/features/diagram-editor/components/DiagramCanvas'
import { PropertiesPanel } from '@/features/diagram-editor/components/PropertiesPanel'
import { ValidationPanel } from '@/features/diagram-editor/components/ValidationPanel'
import { JsonLivePanel } from '@/features/diagram-editor/components/JsonLivePanel'
import { useEditorStore } from '@/store/editor-store'

export default function EditorPage() {
  const params = useParams()
  const systemId = params?.systemId as string
  const setActiveSystem = useSystemStore((s) => s.setActiveSystem)
  const isPaletteOpen = useEditorStore((s) => s.isPaletteOpen)
  const isPropertiesPanelOpen = useEditorStore((s) => s.isPropertiesPanelOpen)
  const isValidationPanelOpen = useEditorStore((s) => s.isValidationPanelOpen)
  const isJsonPanelOpen = useEditorStore((s) => s.isJsonPanelOpen)
  const setPaletteOpen = useEditorStore((s) => s.setPaletteOpen)
  const setPropertiesPanelOpen = useEditorStore((s) => s.setPropertiesPanelOpen)

  useEffect(() => {
    if (systemId) setActiveSystem(decodeURIComponent(systemId))
  }, [systemId, setActiveSystem])

  return (
    <div className="h-full min-h-0 flex flex-col">
      <TopBar />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {(isPaletteOpen || isPropertiesPanelOpen) && (
          <button
            aria-label="Close side panels"
            className="md:hidden absolute inset-0 z-10 bg-black/25"
            onClick={() => {
              setPaletteOpen(false)
              setPropertiesPanelOpen(false)
            }}
          />
        )}
        {isPaletteOpen && <ComponentPalette />}
        <section className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <DiagramCanvas />
          {isValidationPanelOpen && <ValidationPanel />}
        </section>
        {isPropertiesPanelOpen && <PropertiesPanel />}
        {isJsonPanelOpen && <JsonLivePanel />}
      </div>
    </div>
  )
}
