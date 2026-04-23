// ============================================================
// Layer Definitions - Configuration for architectural layers
// ============================================================

import { LayerConfig, LayerType } from '@/types/layers';

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: 'application',
    name: 'Application',
    description: 'Application-level components: services, APIs, frontends, actors, and external systems',
    color: '#3B82F6',
    lightColor: '#DBEAFE',
    icon: 'AppWindow',
    allowedNodeTypes: [
      'user', 'external_system', 'api_service', 'backend_service', 'frontend_app',
      'queue', 'database', 'cache', 'network', 'generic', 'annotation',
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Infrastructure components: VMs, containers, networking, load balancers, and security',
    color: '#F59E0B',
    lightColor: '#FEF3C7',
    icon: 'Server',
    allowedNodeTypes: [
      'gcp_vm', 'gcp_cloud_run', 'gcp_gke', 'gcp_load_balancer',
      'gcp_vpc', 'gcp_subnet', 'gcp_firewall', 'gcp_storage', 'gcp_pubsub',
      'network', 'external_system', 'secret_manager', 'iam', 'service_account',
      'generic', 'annotation',
    ],
  },
  {
    id: 'data',
    name: 'Data',
    description: 'Data layer components: databases, caches, storage, and messaging systems',
    color: '#10B981',
    lightColor: '#D1FAE5',
    icon: 'Database',
    allowedNodeTypes: [
      'database', 'cache', 'queue', 'gcp_storage', 'gcp_pubsub',
      'generic', 'annotation',
    ],
  },
];

export function getLayerConfig(layerId: LayerType): LayerConfig | undefined {
  return LAYER_CONFIGS.find((l) => l.id === layerId);
}
