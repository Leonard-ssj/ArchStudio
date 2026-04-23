'use client'
import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { ArchNodeData } from '@/types'
import { getNodeDefinition } from '@/config/node-definitions'
import { useUiStore } from '@/store/ui-store'
import { t, tNodeType } from '@/lib/i18n'
import {
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

function ArchNodeComponent({ data: rawData, selected }: NodeProps) {
  const language = useUiStore((s) => s.language)
  const data = rawData as unknown as ArchNodeData
  const def = getNodeDefinition(data.semanticType)
  const Icon = getIcon(def?.icon ?? 'Box')
  const color = def?.color ?? '#6B7280'
  const hasErrors = data.validationErrors?.some((e) => e.severity === 'error')
  const hasWarnings = data.validationErrors?.some((e) => e.severity === 'warning')

  const isAnnotation = data.semanticType === 'annotation'
  const isDatabase = data.semanticType === 'database'
  const isQueueLike = data.semanticType === 'queue' || data.semanticType === 'gcp_pubsub'

  if (isAnnotation) {
    return (
      <div
        className={`bg-yellow-50 border-2 border-dashed border-yellow-300 rounded px-3 py-2 min-w-[120px] max-w-[200px] text-xs text-yellow-800 ${selected ? 'ring-2 ring-blue-500' : ''}`}
      >
        <Handle type="source" position={Position.Bottom} className="!bg-yellow-400" />
        <Handle type="target" position={Position.Top} className="!bg-yellow-400" />
        <StickyNote size={12} className="inline mr-1" />
        {data.label || tNodeType(language, 'annotation', 'Note')}
      </div>
    )
  }

  return (
    <div
      className={[
        'bg-white rounded-lg border-2 shadow-sm transition-shadow min-w-[140px] max-w-[200px] relative',
        isDatabase ? 'pt-1 pb-1 rounded-md' : '',
        isQueueLike ? 'rounded-2xl' : '',
        selected ? 'ring-2 ring-blue-500 ring-offset-1' : '',
        hasErrors ? 'border-red-400' : hasWarnings ? 'border-yellow-400' : 'border-gray-200',
        'hover:shadow-md',
      ].join(' ')}
    >
      {isDatabase && (
        <>
          <div className="absolute left-2 right-2 -top-2 h-3 rounded-[999px] border-2 border-inherit bg-white" />
          <div className="absolute left-2 right-2 -bottom-2 h-3 rounded-[999px] border-2 border-inherit bg-white" />
        </>
      )}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400" />

      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-t-md"
        style={{ backgroundColor: color + '18', borderBottom: `1px solid ${color}30` }}
      >
        <Icon size={13} style={{ color }} className="shrink-0" />
        <span className="text-xs font-semibold truncate" style={{ color }}>
          {tNodeType(language, data.semanticType, def?.displayName ?? data.semanticType)}
        </span>
        {(hasErrors || hasWarnings) && (
          <AlertCircle
            size={11}
            className={`ml-auto shrink-0 ${hasErrors ? 'text-red-500' : 'text-yellow-500'}`}
          />
        )}
      </div>

      {/* Label */}
      <div className="px-2.5 py-1.5">
        <p className="text-xs font-medium text-gray-800 truncate">
          {data.label || <span className="text-red-400 italic">{t(language, 'editor.label')}?</span>}
        </p>
        {data.properties?.environment && (
          <p className="text-[10px] text-gray-400 mt-0.5">{data.properties.environment}</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400" />
    </div>
  )
}

export const ArchNodeMemo = memo(ArchNodeComponent)

export const nodeTypes = {
  archNode: ArchNodeMemo,
}
