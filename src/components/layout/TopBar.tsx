'use client'
import React, { useRef } from 'react'
import { useEditor } from '@/features/diagram-editor/hooks/useEditor'
import { useSystemStore } from '@/store/system-store'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { WorkflowBadge } from '@/features/workflow/WorkflowBadge'
import { WorkflowActions } from '@/features/workflow/WorkflowActions'
import { Button } from '@/components/ui/Button'
import { downloadSystemJson } from '@/features/import-export/export-json'
import { parseImportedJson, readFileAsText } from '@/features/import-export/import-json'
import { LayerType, WorkflowAction, ReviewStatus } from '@/types'
import { buildReviewEvent, getNextStatus } from '@/features/workflow/workflow-machine'
import { Download, Upload, ArrowLeft, PanelLeft, PanelRight, PanelBottom } from 'lucide-react'
import Link from 'next/link'

export function TopBar() {
  const language = useUiStore((s) => s.language)
  const { system, currentDiagram, activeLayer, setActiveLayer } = useEditor()
  const updateSystem = useSystemStore((s) => s.updateSystem)
  const importSystem = useSystemStore((s) => s.importSystem)
  const isPaletteOpen = useEditorStore((s) => s.isPaletteOpen)
  const isPropertiesPanelOpen = useEditorStore((s) => s.isPropertiesPanelOpen)
  const isValidationPanelOpen = useEditorStore((s) => s.isValidationPanelOpen)
  const togglePalette = useEditorStore((s) => s.togglePalette)
  const togglePropertiesPanel = useEditorStore((s) => s.togglePropertiesPanel)
  const toggleValidationPanel = useEditorStore((s) => s.toggleValidationPanel)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = React.useState<string | null>(null)
  const layers: { id: LayerType; label: string }[] = [
    { id: 'application', label: t(language, 'editor.application') },
    { id: 'infrastructure', label: t(language, 'editor.infrastructure') },
    { id: 'data', label: t(language, 'editor.data') },
  ]

  const handleExport = () => {
    if (!system) return
    downloadSystemJson(system)
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await readFileAsText(file)
    const result = parseImportedJson(text)
    if (result.success) {
      importSystem(result.system)
      setImportError(null)
    } else {
      setImportError(result.errors[0])
    }
    e.target.value = ''
  }

  const handleTransition = (action: WorkflowAction, comment?: string) => {
    if (!system || !currentDiagram) return
    const nextStatus = getNextStatus(currentDiagram.reviewStatus, action)
    if (!nextStatus) return
    const event = buildReviewEvent(currentDiagram.reviewStatus, nextStatus, action, 'You', comment)
    const updatedSystem = {
      ...system,
      updatedAt: new Date().toISOString(),
      diagrams: system.diagrams.map((d) =>
        d.layer === activeLayer
          ? {
              ...d,
              reviewStatus: nextStatus as ReviewStatus,
              reviewHistory: [...(d.reviewHistory ?? []), event],
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    }
    updateSystem(updatedSystem)
  }

  return (
    <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3 shrink-0">
      <Link href="/" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <ArrowLeft size={16} />
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{system?.name ?? 'ArchStudio'}</span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{system?.owner}</span>
      </div>

      {/* Layer Tabs */}
      <nav className="flex items-center bg-gray-100 dark:bg-gray-800 rounded p-0.5 gap-0.5">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={[
              'px-3 py-1 rounded text-xs font-medium transition-colors',
              activeLayer === layer.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
            ].join(' ')}
          >
            {layer.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <button
          onClick={togglePalette}
          title={t(language, 'editor.palette')}
          className={`p-1 rounded border ${isPaletteOpen ? 'border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400' : 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}
        >
          <PanelLeft size={14} />
        </button>
        <button
          onClick={togglePropertiesPanel}
          title={t(language, 'editor.inspector')}
          className={`p-1 rounded border ${isPropertiesPanelOpen ? 'border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400' : 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}
        >
          <PanelRight size={14} />
        </button>
        <button
          onClick={toggleValidationPanel}
          title={t(language, 'editor.issues')}
          className={`p-1 rounded border ${isValidationPanelOpen ? 'border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400' : 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'}`}
        >
          <PanelBottom size={14} />
        </button>
      </div>

      {/* Workflow */}
      {currentDiagram && (
        <div className="flex items-center gap-2 ml-1">
          <WorkflowBadge status={currentDiagram.reviewStatus} />
          <WorkflowActions
            currentStatus={currentDiagram.reviewStatus}
            onTransition={handleTransition}
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {importError && (
          <span className="text-[10px] text-red-500 max-w-[200px] truncate">{importError}</span>
        )}
        <Button size="sm" variant="ghost" leftIcon={<Upload size={12} />} onClick={() => fileInputRef.current?.click()}>
          {t(language, 'editor.import')}
        </Button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        <Button size="sm" variant="secondary" leftIcon={<Download size={12} />} onClick={handleExport}>
          {t(language, 'editor.export')}
        </Button>
      </div>
    </header>
  )
}
