'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t, tNodeType } from '@/lib/i18n'
import { getNodeDefinitionsForLayer, getNodeDefinitionsByCategory } from '@/config/node-definitions'
import { SemanticNodeType, NodeCategory } from '@/types'
import {
  ChevronDown, ChevronRight,
  User, Globe, Server, Layers, Database, HardDrive, MessageSquare,
  Cloud, Container, Network, Shield, Lock, Key, Box, StickyNote,
  Cpu, LayoutGrid, Flame, Warehouse, Radio, AlertCircle,
  Webhook, Monitor, Zap, ArrowRightLeft, Play, Split, GitBranch,
  FolderOpen, Wifi, KeyRound, ShieldCheck, UserCog,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  User, Globe, Server, Layers, Database, HardDrive, MessageSquare,
  Cloud, Container, Network, Shield, Lock, Key, Box, StickyNote,
  Cpu, LayoutGrid, Flame, Warehouse, Radio, AlertCircle,
  Webhook, Monitor, Zap, ArrowRightLeft, Play, Split, GitBranch,
  FolderOpen, Wifi, KeyRound, ShieldCheck, UserCog,
}

function getIcon(iconName: string): React.ElementType {
  return ICON_MAP[iconName] ?? Box
}

function isAssetIcon(iconName: string) {
  return iconName.startsWith('/')
}

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
                  {filteredDefs.map((def) => {
                    const Icon = getIcon(def.icon)
                    return (
                      <div
                        key={def.semanticType}
                        draggable
                        onDragStart={(e) => onDragStart(e, def.semanticType)}
                        className="mx-2 mb-1 px-2.5 py-1.5 rounded border border-border bg-muted/40 cursor-grab hover:bg-accent/70 hover:border-primary/40 transition-colors group"
                        title={def.description}
                      >
                        <p className="text-xs font-medium text-foreground group-hover:text-primary truncate flex items-center gap-1.5">
                          {isAssetIcon(def.icon) ? (
                            <Image
                              src={def.icon}
                              alt={def.displayName}
                              width={14}
                              height={14}
                              className="w-3.5 h-3.5 shrink-0 object-contain"
                            />
                          ) : (
                            <Icon size={13} className="shrink-0" />
                          )}
                          <span className="truncate">{tNodeType(language, def.semanticType, def.displayName)}</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
