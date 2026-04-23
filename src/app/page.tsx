'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSystemStore } from '@/store/system-store'
import { SystemModel } from '@/types'
import { Plus, Layers, Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'

function SystemCard({ system }: { system: SystemModel }) {
  const language = useUiStore((s) => s.language)
  const diagramCount = system.diagrams.length
  const updatedAt = new Date(system.updatedAt).toLocaleDateString()

  return (
    <Link
      href={`/${encodeURIComponent(system.id)}`}
      className="group block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate">
            {system.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{system.description}</p>
        </div>
        <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-400 mt-0.5 ml-2 shrink-0 transition-colors" />
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
        <span className="flex items-center gap-1"><User size={10} />{system.owner}</span>
        <span className="flex items-center gap-1"><Layers size={10} />{diagramCount} {t(language, 'landing.layers')}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{updatedAt}</span>
      </div>
      {system.metadata?.tags?.length ? (
        <div className="flex flex-wrap gap-1 mt-2">
          {system.metadata.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{tag}</span>
          ))}
        </div>
      ) : null}
    </Link>
  )
}

function NewSystemDialog({ open, onClose, onCreate }: {
  open: boolean
  onClose: () => void
  onCreate: (name: string, owner: string, description: string) => void
}) {
  const language = useUiStore((s) => s.language)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name, owner, description)
    setName(''); setOwner(''); setDescription('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t(language, 'landing.newSystem')}
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>{t(language, 'landing.cancel')}</Button>
          <Button variant="primary" size="sm" onClick={handleCreate} disabled={!name.trim()}>{t(language, 'landing.create')}</Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t(language, 'landing.systemName')} *</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Payment Platform"
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t(language, 'landing.owner')}</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g. Platform Team"
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t(language, 'landing.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this system..."
            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          />
        </div>
      </div>
    </Dialog>
  )
}

export default function HomePage() {
  const language = useUiStore((s) => s.language)
  const systems = useSystemStore((s) => s.systems)
  const addSystem = useSystemStore((s) => s.addSystem)
  const [showNew, setShowNew] = useState(false)

  const handleCreate = (name: string, owner: string, description: string) => {
    const now = new Date().toISOString()
    const id = `sys-${Date.now()}`
    const newSystem: SystemModel = {
      id,
      name,
      description,
      owner,
      createdAt: now,
      updatedAt: now,
      diagrams: [
        { id: `diag-app-${id}`, systemId: id, layer: 'application', name: 'Application Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner, notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
        { id: `diag-infra-${id}`, systemId: id, layer: 'infrastructure', name: 'Infrastructure Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner, notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
        { id: `diag-data-${id}`, systemId: id, layer: 'data', name: 'Data Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner, notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
      ],
      metadata: { version: '1.0.0', createdBy: owner, organization: '', domain: '', tags: [] },
    }
    addSystem(newSystem)
  }

  return (
    <main className="h-full min-h-0 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ArchStudio</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t(language, 'landing.subtitle')}</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={14} />}
            onClick={() => setShowNew(true)}
          >
            {t(language, 'landing.newSystem')}
          </Button>
        </div>

        {/* Systems grid */}
        {systems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <Layers size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(language, 'landing.noSystems')}</p>
            <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowNew(true)}>
              {t(language, 'landing.createFirst')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((s) => <SystemCard key={s.id} system={s} />)}
          </div>
        )}
      </div>

      <NewSystemDialog open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
    </main>
  )
}
