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
import { downloadDiagramPng, downloadDiagramSvg, downloadSystemJson } from '@/features/import-export/export-json'
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
  const [exportError, setExportError] = React.useState<string | null>(null)
  const layers: { id: LayerType; label: string }[] = [
    { id: 'application', label: t(language, 'editor.application') },
    { id: 'infrastructure', label: t(language, 'editor.infrastructure') },
    { id: 'data', label: t(language, 'editor.data') },
  ]

  const handleExport = () => {
    if (!system) return
    downloadSystemJson(system)
  }

  const getCanvasElement = () => document.querySelector('[data-diagram-canvas="true"]') as HTMLElement | null

  const handleExportPng = async () => {
    if (!system) return
    const canvasEl = getCanvasElement()
    if (!canvasEl) return
    try {
      setExportError(null)
      await downloadDiagramPng(canvasEl, `${system.name.replace(/\s+/g, '-').toLowerCase()}-${activeLayer}`)
    } catch {
      setExportError(t(language, 'editor.exportFailed'))
    }
  }

  const handleExportSvg = async () => {
    if (!system) return
    const canvasEl = getCanvasElement()
    if (!canvasEl) return
    try {
      setExportError(null)
      await downloadDiagramSvg(canvasEl, `${system.name.replace(/\s+/g, '-').toLowerCase()}-${activeLayer}`)
    } catch {
      setExportError(t(language, 'editor.exportFailed'))
    }
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
    <header className="h-auto min-h-12 bg-card border-b border-border flex flex-wrap items-center px-2 sm:px-3 py-1.5 gap-1.5 sm:gap-2 shrink-0">
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
      </Link>

      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <span className="text-sm font-semibold text-foreground truncate max-w-[150px] sm:max-w-[220px]">{system?.name ?? 'ArchStudio'}</span>
        <span className="text-border">|</span>
        <span className="text-xs text-muted-foreground truncate max-w-[90px] sm:max-w-[140px]">{system?.owner || t(language, 'editor.ownerUnknown')}</span>
      </div>

      {/* Layer Tabs */}
      <nav className="order-3 sm:order-none w-full sm:w-auto flex items-center bg-muted rounded-md p-0.5 gap-0.5 overflow-x-auto">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={[
              'px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap',
              activeLayer === layer.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
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
          className={`p-1 rounded border ${isPaletteOpen ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
        >
          <PanelLeft size={14} />
        </button>
        <button
          onClick={togglePropertiesPanel}
          title={t(language, 'editor.inspector')}
          className={`p-1 rounded border ${isPropertiesPanelOpen ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
        >
          <PanelRight size={14} />
        </button>
        <button
          onClick={toggleValidationPanel}
          title={t(language, 'editor.issues')}
          className={`p-1 rounded border ${isValidationPanelOpen ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
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

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {importError && (
          <span className="hidden md:inline text-[10px] text-destructive max-w-[240px] truncate">{t(language, 'editor.importError')}: {importError}</span>
        )}
        {exportError && (
          <span className="hidden md:inline text-[10px] text-destructive max-w-[180px] truncate">{exportError}</span>
        )}
        <Button size="sm" variant="ghost" className="px-2 sm:px-2.5" leftIcon={<Upload size={12} />} onClick={() => fileInputRef.current?.click()}>
          {t(language, 'editor.import')}
        </Button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        <Button size="sm" variant="ghost" className="px-2 sm:px-2.5" onClick={handleExportSvg}>
          {t(language, 'editor.exportSvg')}
        </Button>
        <Button size="sm" variant="ghost" className="px-2 sm:px-2.5" onClick={handleExportPng}>
          {t(language, 'editor.exportPng')}
        </Button>
        <Button size="sm" variant="secondary" className="px-2 sm:px-2.5" leftIcon={<Download size={12} />} onClick={handleExport}>
          {t(language, 'editor.export')}
        </Button>
      </div>
    </header>
  )
}
