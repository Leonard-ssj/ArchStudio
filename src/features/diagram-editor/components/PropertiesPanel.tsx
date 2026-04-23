'use client'
import React from 'react'
import { useEditor } from '../hooks/useEditor'
import { useDiagramActions } from '../hooks/useDiagramActions'
import { getNodeDefinition } from '@/config/node-definitions'
import { NodeProperties } from '@/types'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEditorStore } from '@/store/editor-store'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'

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
      className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">— none —</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function PropertiesPanel() {
  const language = useUiStore((s) => s.language)
  const { selectedNode } = useEditor()
  const { updateNodeData, deleteNode } = useDiagramActions()
  const clearSelection = useEditorStore((s) => s.clearSelection)

  if (!selectedNode) {
    return (
      <aside className="w-64 bg-white border-l border-gray-200 flex items-center justify-center">
        <p className="text-xs text-gray-400 text-center px-4">
          {t(language, 'editor.propertiesHint')}
        </p>
      </aside>
    )
  }

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
    <aside className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{def?.displayName ?? data.semanticType}</p>
          <p className="text-[10px] text-gray-400">{selectedNode.id}</p>
        </div>
        <button onClick={clearSelection} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Label */}
        <Field label="Label *">
          <TextInput
            value={data.label}
            onChange={(v) => updateNodeData(selectedNode.id, { label: v })}
            placeholder="Node label"
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={data.description ?? ''}
            onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
            placeholder="What does this component do?"
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
          />
        </Field>

        {/* Owner */}
        <Field label="Owner">
          <TextInput value={asString(props.owner)} onChange={(v) => updateProp('owner', v)} placeholder="Team or person" />
        </Field>

        {/* Criticality */}
        <Field label="Criticality">
          <SelectInput value={asString(props.criticality)} onChange={(v) => updateProp('criticality', v)} options={CRITICALITY_OPTIONS} />
        </Field>

        {/* Environment */}
        <Field label="Environment">
          <SelectInput value={asString(props.environment)} onChange={(v) => updateProp('environment', v)} options={ENV_OPTIONS} />
        </Field>

        {/* Status */}
        <Field label="Status">
          <TextInput value={asString(props.status)} onChange={(v) => updateProp('status', v)} placeholder="e.g. active, deprecated" />
        </Field>

        {/* Type-specific fields */}
        {uniqueExtraFields.length > 0 && (
          <div className="pt-1 border-t border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {def?.displayName} Properties
            </p>
            <div className="space-y-3">
              {uniqueExtraFields.map((field) => (
                <Field key={field} label={field}>
                  <TextInput
                    value={asString(props[field])}
                    onChange={(v) => updateProp(field, v)}
                    placeholder={field}
                  />
                </Field>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <Field label="Tags">
          <TextInput
            value={Array.isArray(props.tags) ? (props.tags as string[]).join(', ') : asString(props.tags)}
            onChange={(v) => updateProp('tags', parseTags(v))}
            placeholder="tag1, tag2"
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100">
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
