'use client'
import React, { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t, tNodeType } from '@/lib/i18n'
import { getNodeDefinitionsForLayer, getNodeDefinitionsByCategory } from '@/config/node-definitions'
import { SemanticNodeType, NodeCategory } from '@/types'
import { ChevronDown, ChevronRight } from 'lucide-react'

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  actors: 'editor.actors',
  application: 'editor.application',
  data: 'editor.data',
  gcp_compute: 'editor.gcp_compute',
  gcp_network: 'editor.gcp_network',
  gcp_storage: 'editor.gcp_storage',
  security: 'editor.security',
  other: 'editor.other',
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
    <aside className="absolute md:static inset-y-0 left-0 z-20 w-[78vw] max-w-60 md:w-56 lg:w-60 shrink-0 bg-card border-r border-border flex flex-col overflow-y-auto shadow-md md:shadow-none">
      <div className="px-3 py-2 border-b border-border/80">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t(language, 'editor.components')}</p>
        <p className="text-[10px] text-muted-foreground">{t(language, 'editor.dragToCanvas')}</p>
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
                className="w-full flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hover:bg-accent/60 transition-colors"
              >
                {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
                {t(language, CATEGORY_LABELS[category])}
              </button>
              {!isCollapsed && (
                <div className="pb-1">
                  {filteredDefs.map((def) => (
                    <div
                      key={def.semanticType}
                      draggable
                      onDragStart={(e) => onDragStart(e, def.semanticType)}
                      className="mx-2 mb-1 px-2.5 py-1.5 rounded border border-border bg-muted/40 cursor-grab hover:bg-accent/70 hover:border-primary/40 transition-colors group"
                      title={def.description}
                    >
                      <p className="text-xs font-medium text-foreground group-hover:text-primary truncate">
                        {tNodeType(language, def.semanticType, def.displayName)}
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
