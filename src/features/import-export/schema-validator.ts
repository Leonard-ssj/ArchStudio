import { ArchStudioExportSchema } from '@/types/schema'
import { ArchStudioExportFormat } from '@/types'

type ImportResult =
  | { success: true; data: ArchStudioExportFormat }
  | { success: false; errors: string[] }

export function validateImportedJson(raw: unknown): ImportResult {
  const result = ArchStudioExportSchema.safeParse(raw)
  if (result.success) {
    return { success: true, data: result.data as ArchStudioExportFormat }
  }
  const errors = result.error.errors.map(
    (e) => `${e.path.join('.')} — ${e.message}`
  )
  return { success: false, errors }
}
