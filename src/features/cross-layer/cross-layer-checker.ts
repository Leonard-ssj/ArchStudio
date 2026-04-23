import { DiagramModel, CrossLayerReference } from '@/types'
import { getAllNodesMap } from './reference-resolver'

export function resolveCrossLayerRefs(diagrams: DiagramModel[]): CrossLayerReference[] {
  const allNodes = getAllNodesMap(diagrams)
  const refs: CrossLayerReference[] = []

  for (const diagram of diagrams) {
    for (const node of diagram.nodes) {
      for (const ref of node.data.crossLayerRefs ?? []) {
        const targetExists = allNodes.has(ref.targetNodeId)
        refs.push({
          ...ref,
          status: targetExists ? 'resolved' : 'broken',
        })
      }
    }
  }
  return refs
}

export function getBrokenRefs(diagrams: DiagramModel[]): CrossLayerReference[] {
  return resolveCrossLayerRefs(diagrams).filter((r) => r.status === 'broken')
}
