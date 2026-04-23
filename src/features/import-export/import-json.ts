import { SystemModel } from '@/types'
import { validateImportedJson } from './schema-validator'

type ParseResult =
  | { success: true; system: SystemModel }
  | { success: false; errors: string[] }

export function parseImportedJson(jsonText: string): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(jsonText)
  } catch {
    return { success: false, errors: ['Invalid JSON — could not parse the file'] }
  }

  const validated = validateImportedJson(raw)
  if (!validated.success) {
    return { success: false, errors: validated.errors }
  }
  return { success: true, system: validated.data.system as SystemModel }
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
