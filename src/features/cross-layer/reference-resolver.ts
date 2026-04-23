import { DiagramModel, ArchNode, LayerType } from '@/types'

export function findNodeById(
  nodeId: string,
  diagrams: DiagramModel[]
): { node: ArchNode; layer: LayerType } | null {
  for (const diagram of diagrams) {
    const node = diagram.nodes.find((n) => n.id === nodeId)
    if (node) return { node, layer: diagram.layer }
  }
  return null
}

export function getAllNodesMap(diagrams: DiagramModel[]): Map<string, ArchNode> {
  const map = new Map<string, ArchNode>()
  for (const diagram of diagrams) {
    for (const node of diagram.nodes) {
      map.set(node.id, node)
    }
  }
  return map
}
