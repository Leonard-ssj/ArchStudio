// ============================================================
// Example System - E-Commerce Platform
// Pre-loaded system with 3 layers and INTENTIONAL ERRORS
// for demonstrating validation capabilities
// ============================================================

import { SystemModel } from '@/types/system';

const NOW = '2026-04-22T10:00:00.000Z';

/**
 * INTENTIONAL ERRORS embedded for validation demo:
 *
 * 1. [ERROR]   notification-svc has empty label "" → required-label
 * 2. [ERROR]   gcp-vm-legacy has no region or gcpProject → infra-required-fields
 * 3. [ERROR]   annotation-1 → pg-db edge → invalid-edge
 * 4. [ERROR]   order-svc has crossLayerRef to non-existent infra node → cross-layer-broken-ref
 * 5. [WARNING] payment-svc has no relatedInfraNodeId → app-infra-reference
 * 6. [WARNING] gcp-fw-1 is isolated (no edges) → isolated-nodes
 * 7. [WARNING] "API Gateway" label appears twice in application layer → duplicate-labels
 * 8. [WARNING] order-svc has no owner or criticality → missing-owner-criticality
 */
export const EXAMPLE_SYSTEM: SystemModel = {
  id: 'sys-ecommerce-001',
  name: 'E-Commerce Platform',
  description: 'Main e-commerce platform with order processing, payments, and notifications',
  owner: 'Architecture Team',
  metadata: {
    version: '1.0.0',
    createdBy: 'Leonardo (mock)',
    organization: 'Acme Corp',
    domain: 'e-commerce',
    tags: ['gcp', 'microservices', 'production'],
  },
  createdAt: NOW,
  updatedAt: NOW,
  diagrams: [
    // ======================================
    // APPLICATION LAYER
    // ======================================
    {
      id: 'diag-app-001',
      systemId: 'sys-ecommerce-001',
      layer: 'application',
      name: 'E-Commerce Application Architecture',
      description: 'Application-level view of the e-commerce platform',
      metadata: { version: '1.0.0', lastEditedBy: 'Leonardo' },
      reviewStatus: 'draft',
      reviewHistory: [],
      validationResults: [],
      createdAt: NOW,
      updatedAt: NOW,
      nodes: [
        {
          id: 'user-1',
          type: 'archNode',
          position: { x: 50, y: 250 },
          data: {
            semanticType: 'user',
            label: 'Customer',
            description: 'End user of the e-commerce platform',
            properties: { label: 'Customer', tags: ['external'] },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'frontend-1',
          type: 'archNode',
          position: { x: 250, y: 250 },
          data: {
            semanticType: 'frontend_app',
            label: 'Web Store',
            description: 'React-based web storefront',
            properties: {
              label: 'Web Store',
              technology: 'React',
              version: '18.3',
              environment: 'production',
              owner: 'Frontend Team',
              criticality: 'critical',
              relatedInfraNodeId: 'cloud-run-1',
            },
            layer: 'application',
            crossLayerRefs: [
              {
                sourceNodeId: 'frontend-1',
                sourceLayer: 'application',
                targetNodeId: 'cloud-run-1',
                targetLayer: 'infrastructure',
                referenceType: 'runs_on',
                status: 'resolved',
              },
            ],
            validationErrors: [],
          },
        },
        {
          id: 'api-gw-1',
          type: 'archNode',
          position: { x: 450, y: 150 },
          data: {
            semanticType: 'api_service',
            label: 'API Gateway',
            description: 'Main API gateway for routing requests',
            properties: {
              label: 'API Gateway',
              technology: 'Kong',
              protocol: 'HTTPS',
              port: 443,
              owner: 'Platform Team',
              criticality: 'critical',
              environment: 'production',
            },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: duplicate label "API Gateway"
          id: 'api-gw-2',
          type: 'archNode',
          position: { x: 450, y: 350 },
          data: {
            semanticType: 'api_service',
            label: 'API Gateway',
            description: 'Secondary API gateway (duplicate label for demo)',
            properties: {
              label: 'API Gateway',
              technology: 'Nginx',
              protocol: 'HTTPS',
              port: 8443,
              owner: 'Platform Team',
            },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: no owner, no criticality → missing-owner-criticality
          // INTENTIONAL ERROR: crossLayerRef to non-existent infra node → cross-layer-broken-ref
          id: 'order-svc',
          type: 'archNode',
          position: { x: 650, y: 150 },
          data: {
            semanticType: 'backend_service',
            label: 'Order Service',
            description: 'Handles order processing and fulfillment',
            properties: {
              label: 'Order Service',
              technology: 'Java Spring Boot',
              runtime: 'JVM 21',
              environment: 'production',
              relatedInfraNodeId: 'cloud-run-nonexistent', // broken ref
            },
            layer: 'application',
            crossLayerRefs: [
              {
                sourceNodeId: 'order-svc',
                sourceLayer: 'application',
                targetNodeId: 'cloud-run-nonexistent',
                targetLayer: 'infrastructure',
                referenceType: 'runs_on',
                status: 'broken',
              },
            ],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: no relatedInfraNodeId → app-infra-reference warning
          id: 'payment-svc',
          type: 'archNode',
          position: { x: 650, y: 350 },
          data: {
            semanticType: 'backend_service',
            label: 'Payment Service',
            description: 'Processes payments via external providers',
            properties: {
              label: 'Payment Service',
              technology: 'Node.js',
              runtime: 'Node 20',
              environment: 'production',
              owner: 'Payments Team',
              criticality: 'critical',
              // No relatedInfraNodeId intentionally
            },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: empty label → required-label
          id: 'notification-svc',
          type: 'archNode',
          position: { x: 850, y: 250 },
          data: {
            semanticType: 'backend_service',
            label: '',
            description: 'Sends emails and push notifications',
            properties: {
              label: '',
              technology: 'Python',
              owner: 'Comms Team',
              criticality: 'medium',
            },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'ext-payment',
          type: 'archNode',
          position: { x: 850, y: 400 },
          data: {
            semanticType: 'external_system',
            label: 'Stripe',
            description: 'External payment processor',
            properties: { label: 'Stripe', protocol: 'HTTPS' },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL: annotation for invalid edge demo
          id: 'annotation-1',
          type: 'archNode',
          position: { x: 850, y: 50 },
          data: {
            semanticType: 'annotation',
            label: 'TODO: Add monitoring',
            description: 'Reminder to add observability',
            properties: { label: 'TODO: Add monitoring' },
            layer: 'application',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
      ],
      edges: [
        { id: 'e-user-fe', source: 'user-1', target: 'frontend-1', data: { relationType: 'calls' }, label: 'browses' },
        { id: 'e-fe-api', source: 'frontend-1', target: 'api-gw-1', data: { relationType: 'calls' }, label: 'HTTPS' },
        { id: 'e-api-order', source: 'api-gw-1', target: 'order-svc', data: { relationType: 'routes_to' } },
        { id: 'e-api-payment', source: 'api-gw-1', target: 'payment-svc', data: { relationType: 'routes_to' } },
        { id: 'e-payment-stripe', source: 'payment-svc', target: 'ext-payment', data: { relationType: 'calls' }, label: 'Stripe API' },
        // INTENTIONAL ERROR: annotation → (no edge to anything meaningful, but we add invalid edge below)
        { id: 'e-invalid-annot', source: 'annotation-1', target: 'order-svc', data: { relationType: 'generic' } },
      ],
    },

    // ======================================
    // INFRASTRUCTURE LAYER
    // ======================================
    {
      id: 'diag-infra-001',
      systemId: 'sys-ecommerce-001',
      layer: 'infrastructure',
      name: 'E-Commerce Infrastructure',
      description: 'GCP infrastructure supporting the e-commerce platform',
      metadata: { version: '1.0.0', lastEditedBy: 'Leonardo' },
      reviewStatus: 'draft',
      reviewHistory: [],
      validationResults: [],
      createdAt: NOW,
      updatedAt: NOW,
      nodes: [
        {
          id: 'cloud-run-1',
          type: 'archNode',
          position: { x: 300, y: 100 },
          data: {
            semanticType: 'gcp_cloud_run',
            label: 'Cloud Run - Frontend',
            description: 'Hosts the web storefront',
            properties: {
              label: 'Cloud Run - Frontend',
              region: 'us-central1',
              gcpProject: 'ecommerce-prod',
              environment: 'production',
              owner: 'Platform Team',
              criticality: 'critical',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'cloud-run-2',
          type: 'archNode',
          position: { x: 300, y: 250 },
          data: {
            semanticType: 'gcp_cloud_run',
            label: 'Cloud Run - Orders',
            description: 'Hosts the order processing service',
            properties: {
              label: 'Cloud Run - Orders',
              region: 'us-central1',
              gcpProject: 'ecommerce-prod',
              environment: 'production',
              owner: 'Platform Team',
              criticality: 'high',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'gcp-lb-1',
          type: 'archNode',
          position: { x: 100, y: 175 },
          data: {
            semanticType: 'gcp_load_balancer',
            label: 'Global Load Balancer',
            description: 'Routes traffic to Cloud Run services',
            properties: {
              label: 'Global Load Balancer',
              gcpProject: 'ecommerce-prod',
              protocol: 'HTTPS',
              port: 443,
              ipAddress: '34.120.1.1',
              owner: 'Platform Team',
              criticality: 'critical',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'gcp-vpc-1',
          type: 'archNode',
          position: { x: 550, y: 100 },
          data: {
            semanticType: 'gcp_vpc',
            label: 'Production VPC',
            description: 'Main VPC for production workloads',
            properties: {
              label: 'Production VPC',
              gcpProject: 'ecommerce-prod',
              region: 'us-central1',
              owner: 'Network Team',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'gcp-subnet-1',
          type: 'archNode',
          position: { x: 550, y: 250 },
          data: {
            semanticType: 'gcp_subnet',
            label: 'Subnet - Services',
            description: 'Subnet for backend services',
            properties: {
              label: 'Subnet - Services',
              gcpProject: 'ecommerce-prod',
              region: 'us-central1',
              ipAddress: '10.0.1.0/24',
              vpc: 'Production VPC',
              owner: 'Network Team',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: isolated node (no edges) → isolated-nodes
          id: 'gcp-fw-1',
          type: 'archNode',
          position: { x: 750, y: 175 },
          data: {
            semanticType: 'gcp_firewall',
            label: 'Allow Internal Traffic',
            description: 'Firewall rule for internal service communication',
            properties: {
              label: 'Allow Internal Traffic',
              gcpProject: 'ecommerce-prod',
              protocol: 'TCP',
              port: 8080,
              vpc: 'Production VPC',
              owner: 'Security Team',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          // INTENTIONAL ERROR: GCP VM without region and gcpProject → infra-required-fields
          id: 'gcp-vm-legacy',
          type: 'archNode',
          position: { x: 100, y: 350 },
          data: {
            semanticType: 'gcp_vm',
            label: 'Legacy VM',
            description: 'Old VM that needs migration',
            properties: {
              label: 'Legacy VM',
              // No region, no gcpProject intentionally
              machineType: 'e2-medium',
              status: 'deprecated',
            },
            layer: 'infrastructure',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
      ],
      edges: [
        { id: 'e-lb-cr1', source: 'gcp-lb-1', target: 'cloud-run-1', data: { relationType: 'routes_to' }, label: 'HTTPS' },
        { id: 'e-lb-cr2', source: 'gcp-lb-1', target: 'cloud-run-2', data: { relationType: 'routes_to' }, label: 'HTTPS' },
        { id: 'e-vpc-sub', source: 'gcp-vpc-1', target: 'gcp-subnet-1', data: { relationType: 'contains' } },
        { id: 'e-cr1-sub', source: 'cloud-run-1', target: 'gcp-subnet-1', data: { relationType: 'connects_to' } },
        { id: 'e-cr2-sub', source: 'cloud-run-2', target: 'gcp-subnet-1', data: { relationType: 'connects_to' } },
      ],
    },

    // ======================================
    // DATA LAYER
    // ======================================
    {
      id: 'diag-data-001',
      systemId: 'sys-ecommerce-001',
      layer: 'data',
      name: 'E-Commerce Data Architecture',
      description: 'Data stores and messaging for the e-commerce platform',
      metadata: { version: '1.0.0', lastEditedBy: 'Leonardo' },
      reviewStatus: 'draft',
      reviewHistory: [],
      validationResults: [],
      createdAt: NOW,
      updatedAt: NOW,
      nodes: [
        {
          id: 'pg-db',
          type: 'archNode',
          position: { x: 200, y: 150 },
          data: {
            semanticType: 'database',
            label: 'Orders DB',
            description: 'PostgreSQL database for orders and users',
            properties: {
              label: 'Orders DB',
              engine: 'PostgreSQL',
              version: '16',
              replicationMode: 'read-replica',
              environment: 'production',
              owner: 'Data Team',
              criticality: 'critical',
              relatedAppNodeId: 'order-svc',
            },
            layer: 'data',
            crossLayerRefs: [
              {
                sourceNodeId: 'pg-db',
                sourceLayer: 'data',
                targetNodeId: 'order-svc',
                targetLayer: 'application',
                referenceType: 'stores_data_in',
                status: 'resolved',
              },
            ],
            validationErrors: [],
          },
        },
        {
          id: 'redis-cache',
          type: 'archNode',
          position: { x: 450, y: 150 },
          data: {
            semanticType: 'cache',
            label: 'Session Cache',
            description: 'Redis cache for user sessions and hot data',
            properties: {
              label: 'Session Cache',
              engine: 'Redis',
              version: '7.2',
              environment: 'production',
              owner: 'Data Team',
              criticality: 'high',
              relatedAppNodeId: 'frontend-1',
            },
            layer: 'data',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'pubsub-orders',
          type: 'archNode',
          position: { x: 200, y: 320 },
          data: {
            semanticType: 'gcp_pubsub',
            label: 'Order Events',
            description: 'Pub/Sub topic for order lifecycle events',
            properties: {
              label: 'Order Events',
              gcpProject: 'ecommerce-prod',
              environment: 'production',
              owner: 'Platform Team',
              criticality: 'high',
              relatedAppNodeId: 'order-svc',
            },
            layer: 'data',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
        {
          id: 'gcs-assets',
          type: 'archNode',
          position: { x: 450, y: 320 },
          data: {
            semanticType: 'gcp_storage',
            label: 'Product Assets',
            description: 'Cloud Storage bucket for product images and media',
            properties: {
              label: 'Product Assets',
              gcpProject: 'ecommerce-prod',
              region: 'us',
              storageClass: 'STANDARD',
              owner: 'Content Team',
              criticality: 'medium',
            },
            layer: 'data',
            crossLayerRefs: [],
            validationErrors: [],
          },
        },
      ],
      edges: [
        { id: 'e-order-db', source: 'pg-db', target: 'pubsub-orders', data: { relationType: 'publishes_to' }, label: 'CDC events' },
        { id: 'e-cache-db', source: 'redis-cache', target: 'pg-db', data: { relationType: 'reads_from' }, label: 'cache-aside' },
      ],
    },
  ],
};
