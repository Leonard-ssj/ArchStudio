'use client'
import React, { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { getNodeDefinitionsForLayer, getNodeDefinitionsByCategory } from '@/config/node-definitions'
import { SemanticNodeType, NodeCategory } from '@/types'
import { ChevronDown, ChevronRight } from 'lucide-react'

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  actors: 'Actors',
  application: 'Application',
  data: 'Data',
  gcp_compute: 'GCP Compute',
  gcp_network: 'GCP Network',
  gcp_storage: 'GCP Storage',
  security: 'Security',
  other: 'Other',
}

export function ComponentPalette() {
  const language = useUiStore((s) => s.language)
  const activeLayer = useEditorStore((s) => s.activeLayer)
  const allowed = getNodeDefinitionsForLayer(activeLayer)
  const byCategory = getNodeDefinitionsByCategory()
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggle = (cat: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })

  const onDragStart = (e: React.DragEvent, type: SemanticNodeType) => {
    e.dataTransfer.setData('application/archstudio-node-type', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const categories = Object.entries(byCategory) as [NodeCategory, (typeof allowed)[number][]][]

  return (
    <aside className="w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t(language, 'editor.components')}</p>
        <p className="text-[10px] text-gray-400">{t(language, 'editor.dragToCanvas')}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {categories.map(([category, defs]) => {
          const filteredDefs = defs.filter((d) => allowed.some((a) => a.semanticType === d.semanticType))
          if (filteredDefs.length === 0) return null
          const isCollapsed = collapsed.has(category)
          return (
            <div key={category}>
              <button
                onClick={() => toggle(category)}
                className="w-full flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                {CATEGORY_LABELS[category]}
              </button>
              {!isCollapsed && (
                <div className="pb-1">
                  {filteredDefs.map((def) => (
                    <div
                      key={def.semanticType}
                      draggable
                      onDragStart={(e) => onDragStart(e, def.semanticType)}
                      className="mx-2 mb-1 px-2.5 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-grab hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 transition-colors group"
                      title={def.description}
                    >
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 truncate">
                        {def.displayName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
