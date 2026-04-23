'use client'
import { useCallback } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useSystemStore } from '@/store/system-store'
import { runValidation } from '@/features/rules-engine'
import { ValidationResult } from '@/types'

export function useValidation() {
  const setValidationResults = useEditorStore((s) => s.setValidationResults)
  const setIsValidating = useEditorStore((s) => s.setIsValidating)
  const validationResults = useEditorStore((s) => s.validationResults)
  const isValidating = useEditorStore((s) => s.isValidating)
  const activeLayer = useEditorStore((s) => s.activeLayer)

  const system = useSystemStore((s) => s.getActiveSystem())
  const updateSystem = useSystemStore((s) => s.updateSystem)

  const validate = useCallback(() => {
    if (!system) return
    setIsValidating(true)
    const diagram = system.diagrams.find((d) => d.layer === activeLayer)
    if (!diagram) { setIsValidating(false); return }
    const summary = runValidation(diagram, system.diagrams)
    setValidationResults(summary.results)

    const nodeResultsMap = new Map<string, ValidationResult[]>()
    for (const result of summary.results) {
      if (!result.nodeId) continue
      if (!nodeResultsMap.has(result.nodeId)) nodeResultsMap.set(result.nodeId, [])
      nodeResultsMap.get(result.nodeId)!.push(result)
    }

    const updatedSystem = {
      ...system,
      updatedAt: new Date().toISOString(),
      diagrams: system.diagrams.map((d) => {
        if (d.layer !== activeLayer) return d
        return {
          ...d,
          validationResults: summary.results,
          updatedAt: new Date().toISOString(),
          nodes: d.nodes.map((n) => ({
            ...n,
            data: {
              ...n.data,
              validationErrors: nodeResultsMap.get(n.id) ?? [],
            },
          })),
        }
      }),
    }
    updateSystem(updatedSystem)

    setIsValidating(false)
    return summary
  }, [system, activeLayer, setValidationResults, setIsValidating, updateSystem])

  return { validate, validationResults, isValidating }
}
