import { SystemModel, ArchStudioExportFormat } from '@/types'
import { toPng, toSvg } from 'html-to-image'

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

function downloadDataUrl(dataUrl: string, fileName: string): void {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = fileName
  a.click()
}

export async function downloadDiagramPng(canvasEl: HTMLElement, baseName: string): Promise<void> {
  const dataUrl = await toPng(canvasEl, {
    cacheBust: true,
    backgroundColor: 'transparent',
    pixelRatio: 2,
  })
  downloadDataUrl(dataUrl, `${baseName}.png`)
}

export async function downloadDiagramSvg(canvasEl: HTMLElement, baseName: string): Promise<void> {
  const dataUrl = await toSvg(canvasEl, {
    cacheBust: true,
    backgroundColor: 'transparent',
  })
  downloadDataUrl(dataUrl, `${baseName}.svg`)
}
