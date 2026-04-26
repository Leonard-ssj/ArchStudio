'use client'
import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import Image from 'next/image'
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

function isAssetIcon(iconName: string) {
  return iconName.startsWith('/')
}

function isCloudIconNode(semanticType: string) {
  return semanticType.startsWith('gcp_') || semanticType === 'secret_manager' || semanticType === 'iam' || semanticType === 'service_account'
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function ArchNodeComponent({ data: rawData, selected }: NodeProps) {
  const language = useUiStore((s) => s.language)
  const data = rawData as unknown as ArchNodeData
  const def = getNodeDefinition(data.semanticType)
  const iconName = def?.icon ?? 'Box'
  const Icon = getIcon(iconName)
  const color = def?.color ?? '#6B7280'
  const hasErrors = data.validationErrors?.some((e) => e.severity === 'error')
  const hasWarnings = data.validationErrors?.some((e) => e.severity === 'warning')

  const isAnnotation = data.semanticType === 'annotation'
  const isGroup = data.semanticType === 'group'
  const isDatabase = data.semanticType === 'database'
  const isCache = data.semanticType === 'cache'
  const isQueueLike = data.semanticType === 'queue' || data.semanticType === 'gcp_pubsub'
  const isNetwork = data.semanticType === 'network'
  const isCloudNode = isCloudIconNode(data.semanticType)

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

  if (isGroup) {
    const width = asNumber(data.properties?.width, 420)
    const height = asNumber(data.properties?.height, 240)
    return (
      <div
        className={[
          'relative rounded-lg border-2 border-dashed bg-violet-50/25',
          selected ? 'ring-2 ring-violet-500 ring-offset-1' : 'border-violet-400/70',
        ].join(' ')}
        style={{ width, height, transition: 'width 220ms ease, height 220ms ease, border-color 220ms ease' }}
      >
        <div className="absolute top-1 left-2 text-[11px] font-semibold text-violet-700 bg-violet-100/70 px-1.5 py-0.5 rounded">
          {data.label || tNodeType(language, 'group', 'Group')}
        </div>
      </div>
    )
  }

  // Icon-first rendering for cloud resources, similar to architecture boards.
  if (isCloudNode && isAssetIcon(iconName)) {
    return (
      <div className={['relative px-1 py-1 rounded-md', selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''].join(' ')}>
        <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400" />

        <div className="flex flex-col items-center gap-1 min-w-[78px] max-w-[120px]">
          <div
            className={[
              'w-11 h-11 rounded-md flex items-center justify-center shadow-sm border bg-white',
              hasErrors ? 'border-red-400' : hasWarnings ? 'border-yellow-400' : 'border-gray-200',
            ].join(' ')}
            title={def?.description}
          >
            <Image
              src={iconName}
              alt={def?.displayName ?? data.semanticType}
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
          <p className="text-[10px] leading-tight text-center text-gray-800 font-medium break-words">
            {data.label || tNodeType(language, data.semanticType, def?.displayName ?? data.semanticType)}
          </p>
        </div>

        {hasErrors || hasWarnings ? (
          <AlertCircle
            size={11}
            className={`absolute -top-1 -right-1 ${hasErrors ? 'text-red-500' : 'text-yellow-500'}`}
          />
        ) : null}
        <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400" />
      </div>
    )
  }

  const shellClass = isDatabase
    ? 'rounded-md'
    : isQueueLike
      ? 'rounded-[999px]'
      : isCache
        ? 'rounded-full'
        : isNetwork
          ? 'rounded-full border-dashed'
          : 'rounded-lg'

  return (
    <div className={['relative px-1 py-1', selected ? 'ring-2 ring-blue-500 ring-offset-1 rounded-md' : ''].join(' ')}>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400" />
      <div className="flex flex-col items-center gap-1 min-w-[84px] max-w-[130px]">
        <div
          className={[
            'w-12 h-12 flex items-center justify-center shadow-sm border bg-white',
            shellClass,
            hasErrors ? 'border-red-400' : hasWarnings ? 'border-yellow-400' : 'border-gray-300',
          ].join(' ')}
          style={{ boxShadow: `0 0 0 1px ${color}26 inset` }}
          title={def?.description}
        >
          {isAssetIcon(iconName) ? (
            <Image src={iconName} alt={def?.displayName ?? data.semanticType} width={30} height={30} className="w-[30px] h-[30px] object-contain" />
          ) : (
            <Icon size={22} style={{ color }} className="shrink-0" />
          )}
        </div>
        <p className="text-[10px] leading-tight text-center text-gray-800 font-medium break-words">
          {data.label || <span className="text-red-400 italic">{t(language, 'editor.label')}?</span>}
        </p>
      </div>
      {hasErrors || hasWarnings ? (
        <AlertCircle
          size={11}
          className={`absolute -top-1 -right-1 ${hasErrors ? 'text-red-500' : 'text-yellow-500'}`}
        />
      ) : null}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400" />
    </div>
  )
}

export const ArchNodeMemo = memo(ArchNodeComponent)

export const nodeTypes = {
  archNode: ArchNodeMemo,
}
