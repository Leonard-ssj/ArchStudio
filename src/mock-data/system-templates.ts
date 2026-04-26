import { ArchEdge, ArchNode, EdgeRelationType, LayerType, SemanticNodeType, SystemModel } from '@/types'

export type SystemTemplateId =
  | 'blank'
  | 'microservices_gcp'
  | 'event_driven'
  | 'enterprise_integration'
  | 'data_platform'

export const SYSTEM_TEMPLATES: Array<{ id: SystemTemplateId; label: string }> = [
  { id: 'blank', label: 'Blank' },
  { id: 'microservices_gcp', label: 'Microservices GCP' },
  { id: 'event_driven', label: 'Event-Driven' },
  { id: 'enterprise_integration', label: 'Enterprise Integration' },
  { id: 'data_platform', label: 'Data Platform' },
]

function n(id: string, layer: LayerType, semanticType: SemanticNodeType, label: string, x: number, y: number, properties: Record<string, unknown> = {}): ArchNode {
  return {
    id,
    type: 'archNode',
    position: { x, y },
    data: {
      semanticType,
      label,
      description: '',
      properties: { label, ...properties },
      layer,
      crossLayerRefs: [],
      validationErrors: [],
    },
  }
}

function e(id: string, source: string, target: string, relationType: EdgeRelationType, label?: string): ArchEdge {
  return { id, source, target, type: 'archEdge', data: { relationType }, label }
}

function baseSystem(id: string, name: string, owner: string, description: string, now: string): SystemModel {
  return {
    id,
    name,
    description,
    owner: owner || 'Architecture Team',
    createdAt: now,
    updatedAt: now,
    metadata: {
      version: '1.0.0',
      createdBy: owner || 'Architecture Team',
      organization: '',
      domain: '',
      tags: [],
    },
    diagrams: [
      { id: `diag-app-${id}`, systemId: id, layer: 'application', name: 'Application Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner || 'Architecture Team', notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
      { id: `diag-infra-${id}`, systemId: id, layer: 'infrastructure', name: 'Infrastructure Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner || 'Architecture Team', notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
      { id: `diag-data-${id}`, systemId: id, layer: 'data', name: 'Data Layer', description: '', nodes: [], edges: [], metadata: { version: '1.0.0', lastEditedBy: owner || 'Architecture Team', notes: '' }, reviewStatus: 'draft', reviewHistory: [], validationResults: [], createdAt: now, updatedAt: now },
    ],
  }
}

export function createSystemFromTemplate(
  templateId: SystemTemplateId,
  name: string,
  owner: string,
  description: string
): SystemModel {
  const now = new Date().toISOString()
  const id = `sys-${Date.now()}`
  const system = baseSystem(id, name, owner, description, now)
  if (templateId === 'blank') return system

  const app = system.diagrams.find((d) => d.layer === 'application')!
  const infra = system.diagrams.find((d) => d.layer === 'infrastructure')!
  const data = system.diagrams.find((d) => d.layer === 'data')!

  if (templateId === 'microservices_gcp') {
    app.nodes = [n('a1', 'application', 'frontend_app', 'Web App', 120, 180), n('a2', 'application', 'api_service', 'API Gateway', 320, 180), n('a3', 'application', 'backend_service', 'Order Service', 520, 140), n('a4', 'application', 'backend_service', 'Payment Service', 520, 240)]
    app.edges = [e('ae1', 'a1', 'a2', 'calls'), e('ae2', 'a2', 'a3', 'routes_to'), e('ae3', 'a2', 'a4', 'routes_to')]
    infra.nodes = [n('i1', 'infrastructure', 'gcp_load_balancer', 'LB', 180, 180), n('i2', 'infrastructure', 'gcp_cloud_run', 'Cloud Run API', 380, 180), n('i3', 'infrastructure', 'gcp_cloud_run', 'Cloud Run Services', 620, 180), n('i4', 'infrastructure', 'gcp_vpc', 'VPC', 380, 70)]
    infra.edges = [e('ie1', 'i1', 'i2', 'routes_to'), e('ie2', 'i2', 'i3', 'connects_to'), e('ie3', 'i4', 'i2', 'contains')]
    data.nodes = [n('d1', 'data', 'database', 'Postgres', 320, 180), n('d2', 'data', 'cache', 'Redis', 520, 180)]
    data.edges = [e('de1', 'd2', 'd1', 'reads_from')]
  }

  if (templateId === 'event_driven') {
    app.nodes = [n('ea1', 'application', 'api_service', 'Ingestion API', 160, 180), n('ea2', 'application', 'backend_service', 'Event Processor', 400, 180), n('ea3', 'application', 'backend_service', 'Notification Service', 640, 180)]
    app.edges = [e('eae1', 'ea1', 'ea2', 'publishes_to'), e('eae2', 'ea2', 'ea3', 'publishes_to')]
    infra.nodes = [n('ei1', 'infrastructure', 'gcp_pubsub', 'Pub/Sub', 340, 170), n('ei2', 'infrastructure', 'gcp_cloud_run', 'Workers', 560, 170)]
    infra.edges = [e('eie1', 'ei1', 'ei2', 'subscribes_from')]
    data.nodes = [n('ed1', 'data', 'gcp_storage', 'Event Lake', 300, 180), n('ed2', 'data', 'database', 'Read Model DB', 520, 180)]
    data.edges = [e('ede1', 'ed1', 'ed2', 'writes_to')]
  }

  if (templateId === 'enterprise_integration') {
    app.nodes = [n('ia1', 'application', 'external_system', 'ERP', 100, 180), n('ia2', 'application', 'api_service', 'Integration API', 340, 180), n('ia3', 'application', 'external_system', 'CRM', 620, 120), n('ia4', 'application', 'external_system', 'Core Banking', 620, 240)]
    app.edges = [e('iae1', 'ia1', 'ia2', 'calls'), e('iae2', 'ia2', 'ia3', 'routes_to'), e('iae3', 'ia2', 'ia4', 'routes_to')]
    infra.nodes = [n('ii1', 'infrastructure', 'gcp_load_balancer', 'API LB', 200, 180), n('ii2', 'infrastructure', 'gcp_gke', 'Integration Cluster', 440, 180), n('ii3', 'infrastructure', 'gcp_firewall', 'Firewall', 700, 180)]
    infra.edges = [e('iie1', 'ii1', 'ii2', 'routes_to'), e('iie2', 'ii3', 'ii2', 'depends_on')]
    data.nodes = [n('id1', 'data', 'queue', 'Integration Queue', 280, 180), n('id2', 'data', 'database', 'Canonical DB', 520, 180)]
    data.edges = [e('ide1', 'id1', 'id2', 'writes_to')]
  }

  if (templateId === 'data_platform') {
    app.nodes = [n('da1', 'application', 'backend_service', 'Ingestion Service', 180, 180), n('da2', 'application', 'backend_service', 'Transformation Service', 440, 180), n('da3', 'application', 'frontend_app', 'BI Portal', 700, 180)]
    app.edges = [e('dae1', 'da1', 'da2', 'publishes_to'), e('dae2', 'da2', 'da3', 'reads_from')]
    infra.nodes = [n('di1', 'infrastructure', 'gcp_gke', 'Data Compute', 280, 180), n('di2', 'infrastructure', 'gcp_storage', 'Data Lake Storage', 540, 180)]
    infra.edges = [e('die1', 'di1', 'di2', 'writes_to')]
    data.nodes = [n('dd1', 'data', 'gcp_storage', 'Raw Zone', 180, 180), n('dd2', 'data', 'database', 'Warehouse', 420, 180), n('dd3', 'data', 'cache', 'Serving Cache', 680, 180)]
    data.edges = [e('dde1', 'dd1', 'dd2', 'writes_to'), e('dde2', 'dd2', 'dd3', 'reads_from')]
  }

  return system
}
