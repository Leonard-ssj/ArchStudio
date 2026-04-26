'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSystemStore } from '@/store/system-store'
import { SystemModel } from '@/types'
import { Plus, Layers, Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { useUiStore } from '@/store/ui-store'
import { t } from '@/lib/i18n'
import { createSystemFromTemplate, SYSTEM_TEMPLATES, SystemTemplateId } from '@/mock-data/system-templates'

function SystemCard({ system }: { system: SystemModel }) {
  const language = useUiStore((s) => s.language)
  const diagramCount = system.diagrams.length
  const updatedAt = new Date(system.updatedAt).toLocaleDateString()

  return (
    <Link
      href={`/${encodeURIComponent(system.id)}`}
      className="group block"
    >
      <Card className="h-full border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 truncate">
                {system.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{system.description}</p>
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
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded text-[10px]">{tag}</span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}

function NewSystemDialog({ open, onClose, onCreate }: {
  open: boolean
  onClose: () => void
  onCreate: (name: string, owner: string, description: string, templateId: SystemTemplateId) => void
}) {
  const language = useUiStore((s) => s.language)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [description, setDescription] = useState('')
  const [templateId, setTemplateId] = useState<SystemTemplateId>('blank')

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name, owner, description, templateId)
    setName(''); setOwner(''); setDescription(''); setTemplateId('blank')
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
          <Input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Payment Platform"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t(language, 'landing.owner')}</label>
          <Input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g. Platform Team"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t(language, 'landing.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this system..."
            className="w-full border border-input bg-background text-foreground rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-20 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value as SystemTemplateId)}
            className="w-full border border-input bg-background text-foreground rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SYSTEM_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>{template.label}</option>
            ))}
          </select>
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

  const handleCreate = (name: string, owner: string, description: string, templateId: SystemTemplateId) => {
    const newSystem: SystemModel = createSystemFromTemplate(templateId, name, owner, description)
    addSystem(newSystem)
  }

  return (
    <section className="h-full min-h-0 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
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
          <div className="text-center py-16 sm:py-20 border-2 border-dashed border-border rounded-xl">
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
    </section>
  )
}
