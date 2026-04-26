'use client'
import React from 'react'
import { useEditor } from '../hooks/useEditor'
import { useDiagramActions } from '../hooks/useDiagramActions'
import { getNodeDefinition } from '@/config/node-definitions'
import { ArchEdge, NodeProperties } from '@/types'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t, tNodeType } from '@/lib/i18n'

const COMMON_FIELDS = ['description', 'environment', 'owner', 'criticality', 'status', 'tags'] as const
const CRITICALITY_OPTIONS = ['low', 'medium', 'high', 'critical']
const ENV_OPTIONS = ['development', 'staging', 'production']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-input bg-background text-foreground rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
    />
  )
}

function SelectInput({
  value,
  onChange,
  options,
  noneLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  noneLabel: string
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-input bg-background text-foreground rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">- {noneLabel} -</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function PropertiesPanel() {
  const language = useUiStore((s) => s.language)
  const { selectedNode, selectedEdge } = useEditor()
  const { updateNodeData, deleteNode, deleteEdge, updateEdgeData, updateEdge } = useDiagramActions()
  const clearSelection = useEditorStore((s) => s.clearSelection)

  if (!selectedNode && !selectedEdge) return null

  if (selectedEdge) {
    const data = (selectedEdge.data ?? {}) as Record<string, unknown>
    const asString = (value: unknown): string => (typeof value === 'string' ? value : '')
    const asNumber = (value: unknown): string => (typeof value === 'number' && Number.isFinite(value) ? String(value) : '')
    const updateEdgeProp = (key: string, val: unknown) => updateEdgeData(selectedEdge.id, { [key]: val })

    return (
      <aside className="absolute md:static inset-y-0 right-0 z-20 w-[82vw] max-w-72 md:w-64 lg:w-72 shrink-0 bg-card border-l border-border flex flex-col overflow-hidden shadow-md md:shadow-none">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/80">
          <div>
            <p className="text-xs font-semibold text-foreground">Line / Edge</p>
            <p className="text-[10px] text-muted-foreground">{selectedEdge.id}</p>
          </div>
          <button onClick={clearSelection} className="p-1 rounded hover:bg-accent text-muted-foreground">
            <X size={13} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          <Field label="Label">
            <TextInput
              value={asString(data.label ?? selectedEdge.label)}
              onChange={(v) => {
                updateEdgeProp('label', v)
                updateEdge(selectedEdge.id, { label: v } as Partial<ArchEdge>)
              }}
              placeholder="Request flow"
            />
          </Field>
          <Field label="Relation Type">
            <SelectInput
              value={asString(data.relationType ?? 'generic')}
              onChange={(v) => updateEdgeProp('relationType', v)}
              options={['generic', 'calls', 'depends_on', 'reads_from', 'writes_to', 'publishes_to', 'subscribes_from', 'routes_to', 'authenticates_with', 'contains', 'connects_to']}
              noneLabel="none"
            />
          </Field>
          <Field label="Line Type">
            <SelectInput
              value={asString(data.lineType ?? 'smoothstep')}
              onChange={(v) => updateEdgeProp('lineType', v)}
              options={['smoothstep', 'bezier', 'straight']}
              noneLabel="smoothstep"
            />
          </Field>
          <Field label="Pattern">
            <SelectInput
              value={asString(data.linePattern ?? 'solid')}
              onChange={(v) => updateEdgeProp('linePattern', v)}
              options={['solid', 'dashed', 'dotted']}
              noneLabel="solid"
            />
          </Field>
          <Field label="Stroke Width">
            <TextInput
              value={asNumber(data.strokeWidth)}
              onChange={(v) => {
                const num = Number(v)
                if (Number.isFinite(num)) updateEdgeProp('strokeWidth', num)
              }}
              placeholder="1.6"
            />
          </Field>
          <Field label="Stroke Color">
            <TextInput
              value={asString(data.strokeColor)}
              onChange={(v) => updateEdgeProp('strokeColor', v)}
              placeholder="#94A3B8"
            />
          </Field>
          <Field label="Protocol">
            <TextInput
              value={asString(data.protocol)}
              onChange={(v) => updateEdgeProp('protocol', v)}
              placeholder="HTTPS"
            />
          </Field>
          <Field label="Port">
            <TextInput
              value={asNumber(data.port)}
              onChange={(v) => {
                const num = Number(v)
                if (Number.isFinite(num)) updateEdgeProp('port', num)
              }}
              placeholder="443"
            />
          </Field>
        </div>
        <div className="px-3 py-2 border-t border-border/80">
          <Button
            variant="danger"
            size="sm"
            className="w-full justify-center"
            leftIcon={<Trash2 size={12} />}
            onClick={() => {
              deleteEdge(selectedEdge.id)
              clearSelection()
            }}
          >
            Delete Edge
          </Button>
        </div>
      </aside>
    )
  }

  if (!selectedNode) return null
  const def = getNodeDefinition(selectedNode.data.semanticType)
  const data = selectedNode.data
  const props = data.properties as Record<string, unknown>
  const asString = (value: unknown): string => (typeof value === 'string' ? value : '')

  const updateProp = (key: string, val: unknown) =>
    updateNodeData(selectedNode.id, {
      properties: { ...data.properties, [key]: val } as NodeProperties,
    })

  const parseTags = (input: string) =>
    input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

  const allExtraFields = [
    ...(def?.requiredProperties ?? []).filter((f) => f !== 'label'),
    ...(def?.optionalProperties ?? []),
  ].filter((f): f is string => typeof f === 'string' && !(COMMON_FIELDS as readonly string[]).includes(f))

  const uniqueExtraFields = Array.from(new Set(allExtraFields))

  return (
    <aside className="absolute md:static inset-y-0 right-0 z-20 w-[82vw] max-w-72 md:w-64 lg:w-72 shrink-0 bg-card border-l border-border flex flex-col overflow-hidden shadow-md md:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/80">
        <div>
          <p className="text-xs font-semibold text-foreground">{tNodeType(language, data.semanticType, def?.displayName ?? data.semanticType)}</p>
          <p className="text-[10px] text-muted-foreground">{selectedNode.id}</p>
        </div>
        <button onClick={clearSelection} className="p-1 rounded hover:bg-accent text-muted-foreground">
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Label */}
        <Field label={`${t(language, 'editor.label')} *`}>
          <TextInput
            value={data.label}
            onChange={(v) => updateNodeData(selectedNode.id, { label: v })}
            placeholder={t(language, 'editor.nodeLabelPlaceholder')}
          />
        </Field>

        {/* Description */}
        <Field label={t(language, 'editor.description')}>
          <textarea
            value={data.description ?? ''}
            onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
            placeholder={t(language, 'editor.nodeDescriptionPlaceholder')}
            className="w-full border border-input rounded px-2 py-1 text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring h-16 resize-none"
          />
        </Field>

        {/* Owner */}
        <Field label={t(language, 'editor.owner')}>
          <TextInput value={asString(props.owner)} onChange={(v) => updateProp('owner', v)} placeholder={t(language, 'editor.ownerPlaceholder')} />
        </Field>

        {/* Criticality */}
        <Field label={t(language, 'editor.criticality')}>
          <SelectInput value={asString(props.criticality)} onChange={(v) => updateProp('criticality', v)} options={CRITICALITY_OPTIONS} noneLabel={t(language, 'editor.none')} />
        </Field>

        {/* Environment */}
        <Field label={t(language, 'editor.environment')}>
          <SelectInput value={asString(props.environment)} onChange={(v) => updateProp('environment', v)} options={ENV_OPTIONS} noneLabel={t(language, 'editor.none')} />
        </Field>

        {/* Status */}
        <Field label={t(language, 'editor.status')}>
          <TextInput value={asString(props.status)} onChange={(v) => updateProp('status', v)} placeholder={t(language, 'editor.statusPlaceholder')} />
        </Field>

        {/* Type-specific fields */}
        {uniqueExtraFields.length > 0 && (
          <div className="pt-1 border-t border-border/80">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {tNodeType(language, data.semanticType, def?.displayName ?? data.semanticType)} {t(language, 'editor.nodeProperties')}
            </p>
            <div className="space-y-3">
              {uniqueExtraFields.map((field) => (
                <Field key={field} label={field}>
                  <TextInput
                    value={asString(props[field])}
                    onChange={(v) => {
                      if (field === 'width' || field === 'height') {
                        const num = Number(v)
                        updateProp(field, Number.isFinite(num) ? num : v)
                        return
                      }
                      updateProp(field, v)
                    }}
                    placeholder={field}
                  />
                </Field>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <Field label={t(language, 'editor.tags')}>
          <TextInput
            value={Array.isArray(props.tags) ? (props.tags as string[]).join(', ') : asString(props.tags)}
            onChange={(v) => updateProp('tags', parseTags(v))}
            placeholder={t(language, 'editor.tagsPlaceholder')}
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border/80">
        <Button
          variant="danger"
          size="sm"
          className="w-full justify-center"
          leftIcon={<Trash2 size={12} />}
          onClick={() => {
            deleteNode(selectedNode.id)
            clearSelection()
          }}
        >
          {t(language, 'editor.deleteNode')}
        </Button>
      </div>
    </aside>
  )
}
