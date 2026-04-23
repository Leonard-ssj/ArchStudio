'use client'
import React, { useState } from 'react'
import { useValidation } from '../hooks/useValidation'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { ValidationResult, Severity } from '@/types'
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const SEVERITY_CONFIG: Record<Severity, { icon: React.ElementType; color: string; bg: string }> = {
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
}

function ResultRow({ result, onNavigate }: { result: ValidationResult; onNavigate: (id: string) => void }) {
  const cfg = SEVERITY_CONFIG[result.severity]
  const Icon = cfg.icon
  return (
    <button
      onClick={() => result.nodeId && onNavigate(result.nodeId)}
      className={`w-full text-left flex gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 transition-colors ${result.nodeId ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Icon size={13} className={`${cfg.color} mt-0.5 shrink-0`} />
      <div className="min-w-0">
        <p className="text-xs text-gray-700 truncate">{result.message}</p>
        {result.suggestion && (
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{result.suggestion}</p>
        )}
      </div>
    </button>
  )
}

export function ValidationPanel() {
  const language = useUiStore((s) => s.language)
  const { validate, validationResults, isValidating } = useValidation()
  const setSelectedNode = useEditorStore((s) => s.setSelectedNode)
  const isOpen = useEditorStore((s) => s.isValidationPanelOpen)
  const togglePanel = useEditorStore((s) => s.toggleValidationPanel)

  const [filter, setFilter] = useState<Severity | 'all'>('all')

  const errors = validationResults.filter((r) => r.severity === 'error')
  const warnings = validationResults.filter((r) => r.severity === 'warning')
  const infos = validationResults.filter((r) => r.severity === 'info')

  const filtered = filter === 'all' ? validationResults : validationResults.filter((r) => r.severity === filter)

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col" style={{ height: isOpen ? 200 : 36 }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={togglePanel} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
          {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          {t(language, 'editor.validation')}
        </button>

        {/* Counters */}
        <div className="flex items-center gap-2 ml-1">
          {errors.length > 0 && (
            <button onClick={() => setFilter(filter === 'error' ? 'all' : 'error')} className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${filter === 'error' ? 'bg-red-100' : ''}`}>
              <AlertCircle size={10} className="text-red-500" />
              <span className="text-red-600">{errors.length} {language === 'es' ? 'errores' : 'errors'}</span>
            </button>
          )}
          {warnings.length > 0 && (
            <button onClick={() => setFilter(filter === 'warning' ? 'all' : 'warning')} className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${filter === 'warning' ? 'bg-yellow-100' : ''}`}>
              <AlertTriangle size={10} className="text-yellow-500" />
              <span className="text-yellow-600">{warnings.length} {language === 'es' ? 'avisos' : 'warnings'}</span>
            </button>
          )}
          {infos.length > 0 && (
            <button onClick={() => setFilter(filter === 'info' ? 'all' : 'info')} className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${filter === 'info' ? 'bg-blue-100' : ''}`}>
              <Info size={10} className="text-blue-500" />
              <span className="text-blue-600">{infos.length}</span>
            </button>
          )}
          {validationResults.length === 0 && (
            <span className="text-[10px] text-gray-400">{t(language, 'editor.noIssues')}</span>
          )}
        </div>

        <div className="ml-auto">
          <Button
            size="sm"
            variant="ghost"
            isLoading={isValidating}
            leftIcon={<RefreshCw size={10} />}
            onClick={validate}
          >
            {t(language, 'editor.run')}
          </Button>
        </div>
      </div>

      {/* Results list */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-gray-400">
                {validationResults.length === 0 ? t(language, 'editor.runHint') : t(language, 'editor.filterEmpty')}
              </p>
            </div>
          ) : (
            filtered.map((r) => (
              <ResultRow key={r.id} result={r} onNavigate={setSelectedNode} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
