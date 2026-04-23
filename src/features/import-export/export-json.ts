import { SystemModel, ArchStudioExportFormat } from '@/types'

export function exportSystemToJson(system: SystemModel): string {
  const payload: ArchStudioExportFormat = {
    formatVersion: '1.0',
    exportedAt: new Date().toISOString(),
    system,
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadSystemJson(system: SystemModel): void {
  const json = exportSystemToJson(system)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${system.name.replace(/\s+/g, '-').toLowerCase()}-archstudio.json`
  a.click()
  URL.revokeObjectURL(url)
}
