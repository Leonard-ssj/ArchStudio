# CLAUDE.md - ArchStudio: Editor Visual Semantico de Arquitectura Empresarial

## PRODUCTO

ArchStudio es un **editor visual semantico de arquitectura empresarial**. NO es un draw.io generico. Es una herramienta donde cada nodo tiene tipo semantico, propiedades requeridas segun su naturaleza, y reglas de validacion por capa. El diagrama es un **modelo semantico**, no solo un dibujo.

### Valor diferencial
1. **Estructura**: cada nodo es un componente tipado con propiedades obligatorias segun su tipo
2. **Validacion**: motor de reglas que detecta errores, warnings e inconsistencias
3. **Coherencia cross-layer**: si un servicio en Application referencia infraestructura, esa infra debe existir en la capa Infrastructure
4. **Workflow de revision**: estados draft -> in_review -> approved -> rejected
5. **Export/Import JSON**: el JSON canonico ES la fuente de verdad, el canvas es solo representacion visual
6. **Escalabilidad futura**: preparado para backend, DB, versionado, catalogos, Gemini/IA

### Contexto de negocio
El equipo de Arquitectura y Data documenta sistemas empresariales mediante diagramas organizados por capas. Necesitan una herramienta que guie al usuario, valide la arquitectura, y mantenga coherencia entre capas.

---

## STACK TECNICO

- **Next.js 14+** con App Router
- **TypeScript** estricto
- **React Flow** (@xyflow/react) como motor del canvas visual
- **Tailwind CSS** para estilos
- **Zustand** para estado global del editor
- **Zod** para validacion de esquemas JSON en import/export
- **lucide-react** para iconos
- Sin backend, sin DB, sin auth - todo frontend-only con mocks y localStorage opcional

---

## ARQUITECTURA DEL PROYECTO

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout
    page.tsx                    # Landing / lista de sistemas
    (editor)/[systemId]/        # Editor principal (ruta dinamica)
      page.tsx
      layout.tsx

  components/
    ui/                         # Componentes base reutilizables (Button, Badge, Dialog, etc.)
    layout/                     # TopBar, Sidebar wrappers

  features/
    diagram-editor/
      components/               # DiagramCanvas, ComponentPalette, PropertiesPanel, ValidationPanel
      nodes/                    # Custom nodes de React Flow (uno por tipo semantico)
      edges/                    # Custom edges
      panels/                   # Paneles laterales e inferiores
      hooks/                    # useEditor, useDiagramActions, useNodeSelection

    rules-engine/               # Motor de validacion
      rules/                    # Reglas individuales por categoria
      index.ts                  # runValidation(), ValidationResult[]
      rule-registry.ts          # Registro de reglas activas

    workflow/                   # Workflow mock de revision
      workflow-machine.ts       # Transiciones de estado
      WorkflowBadge.tsx
      WorkflowActions.tsx

    import-export/              # Import/export JSON
      export-json.ts
      import-json.ts
      schema-validator.ts       # Validacion con Zod del JSON importado

    cross-layer/                # Logica de coherencia entre capas
      cross-layer-checker.ts
      reference-resolver.ts

  lib/                          # Utilidades de bajo nivel
  hooks/                        # Hooks globales (useLocalStorage, etc.)
  store/                        # Zustand stores
    editor-store.ts             # Store principal del editor
    system-store.ts             # Store de sistemas/proyectos
  types/                        # Tipos TypeScript del dominio
    index.ts                    # Barrel export
    system.ts                   # SystemModel, DiagramModel
    nodes.ts                    # NodeType, SemanticNodeType, NodeProperties
    edges.ts                    # EdgeType, EdgeData
    layers.ts                   # LayerType, LayerConfig
    validation.ts               # ValidationResult, ValidationRule, Severity
    workflow.ts                 # ReviewStatus, WorkflowTransition
    schema.ts                   # Zod schemas para import/export
  mock-data/                    # Datos mock y sistemas de ejemplo
    example-system.ts           # Sistema completo con 3 capas y errores intencionales
    node-catalog.ts             # Catalogo de tipos de nodos con sus propiedades
    layer-config.ts             # Configuracion de capas
  utils/                        # Funciones puras utilitarias
  config/                       # Constantes y configuracion
    node-definitions.ts         # Definiciones de cada tipo de nodo semantico
    layer-definitions.ts        # Definiciones de capas
    validation-rules.ts         # Configuracion de reglas
```

---

## MODELO DE DATOS CORE

### SystemModel
Representa un sistema arquitectonico completo (ej: "Sistema de Pagos", "Plataforma CRM"):
```typescript
{
  id: string
  name: string
  description: string
  owner: string
  createdAt: string (ISO)
  updatedAt: string (ISO)
  diagrams: DiagramModel[]        // Un diagrama por capa
  metadata: SystemMetadata
}
```

### DiagramModel
Un diagrama asociado a una capa especifica:
```typescript
{
  id: string
  systemId: string
  layer: LayerType                // 'application' | 'infrastructure' | 'data'
  name: string
  description: string
  nodes: ArchNode[]
  edges: ArchEdge[]
  metadata: DiagramMetadata
  reviewStatus: ReviewStatus      // 'draft' | 'in_review' | 'approved' | 'rejected'
  reviewHistory: ReviewEvent[]
  validationResults: ValidationResult[]
  updatedAt: string
}
```

### ArchNode (nodo semantico)
```typescript
{
  // Campos React Flow
  id: string
  type: string                    // tipo visual React Flow
  position: { x: number, y: number }
  data: {
    // Campos semanticos
    semanticType: SemanticNodeType
    label: string
    description: string
    properties: NodeProperties    // propiedades dinamicas segun tipo
    layer: LayerType
    crossLayerRefs: CrossLayerReference[]
    validationErrors: ValidationResult[]
  }
}
```

### SemanticNodeType (enum)
Los tipos semanticos validos son:
- `user`, `external_system`
- `api_service`, `backend_service`, `frontend_app`
- `database`, `cache`, `queue`
- `gcp_vm`, `gcp_cloud_run`, `gcp_gke`, `gcp_load_balancer`
- `gcp_vpc`, `gcp_subnet`, `gcp_firewall`
- `gcp_storage`, `gcp_pubsub`
- `network`
- `secret_manager`, `iam`, `service_account`
- `generic`, `annotation`

### NodeProperties
Campos dinamicos que dependen del SemanticNodeType. Cada tipo tiene campos requeridos y opcionales definidos en `config/node-definitions.ts`.

Campos comunes: label, description, environment, owner, criticality, tags, status
Campos infra: region, gcpProject, ipAddress, subnet, hostname, vpc
Campos app: technology, protocol, port, relatedInfraNodeId
Campos data: engine, version, replicationMode, relatedAppNodeId

### LayerType
```typescript
type LayerType = 'application' | 'infrastructure' | 'data'
// Extensible a 'security' | 'integration' en futuro
```

### ReviewStatus
```typescript
type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'rejected'
```

### ValidationResult
```typescript
{
  id: string
  ruleId: string
  severity: 'error' | 'warning' | 'info'
  message: string
  nodeId?: string
  edgeId?: string
  layer?: LayerType
  suggestion?: string
}
```

### CrossLayerReference
```typescript
{
  sourceNodeId: string
  sourceLayer: LayerType
  targetNodeId: string
  targetLayer: LayerType
  referenceType: 'runs_on' | 'stores_data_in' | 'depends_on' | 'secured_by'
  status: 'resolved' | 'broken' | 'missing'
}
```

---

## CAPAS ARQUITECTONICAS

### Application
- Contiene: servicios, APIs, frontends, actores, sistemas externos
- Nodos tipicos: user, external_system, api_service, backend_service, frontend_app, queue
- Regla clave: servicios desplegables DEBEN tener referencia a un nodo de Infrastructure

### Infrastructure
- Contiene: VMs, Cloud Run, GKE, VPCs, subnets, firewalls, load balancers
- Nodos tipicos: gcp_vm, gcp_cloud_run, gcp_gke, gcp_load_balancer, gcp_vpc, gcp_subnet, gcp_firewall, network
- Regla clave: cada componente debe tener region, gcpProject y propiedades tecnicas requeridas

### Data
- Contiene: bases de datos, caches, storage, sistemas de mensajeria
- Nodos tipicos: database, cache, gcp_storage, gcp_pubsub
- Regla clave: cada DB/cache debe tener relacion con al menos un Application node

---

## REGLAS DE VALIDACION (10 reglas minimas MVP)

1. **required-label**: Todo nodo DEBE tener label no vacio → error
2. **required-metadata**: Todo diagrama DEBE tener name y description → error
3. **required-properties**: Campos obligatorios segun tipo de nodo → error
4. **app-infra-reference**: En Application, nodos desplegables (backend_service, api_service, frontend_app) DEBEN tener relatedInfraNodeId → warning
5. **infra-required-fields**: En Infrastructure, nodos GCP deben tener region y gcpProject → error
6. **cross-layer-broken-ref**: Si existe una referencia cruzada y el nodo target no existe → error
7. **invalid-edge**: Edges entre tipos incompatibles (ej: annotation -> database) → error
8. **isolated-nodes**: Nodos sin ninguna conexion (edge) → warning
9. **duplicate-labels**: Labels duplicados dentro de la misma capa → warning
10. **missing-owner-criticality**: Nodos clave sin owner o criticality → warning

### Como implementar una regla
Cada regla es una funcion pura:
```typescript
type ValidationRule = {
  id: string
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  layer?: LayerType | 'all'
  evaluate: (context: ValidationContext) => ValidationResult[]
}
```

El motor itera todas las reglas registradas y acumula resultados. Los resultados se almacenan en el store y se muestran en el ValidationPanel.

---

## WORKFLOW DE REVISION

Transiciones permitidas:
- draft → in_review (accion: "Enviar a revision")
- in_review → approved (accion: "Aprobar")
- in_review → rejected (accion: "Rechazar")
- rejected → draft (accion: "Volver a borrador")
- approved → draft (accion: "Reabrir")

Todo es mock local. No hay usuarios ni permisos reales.

---

## IMPORT/EXPORT JSON

### Export
- Serializa el SystemModel completo a JSON
- Incluye todos los diagramas, nodos, edges, metadata, validaciones
- Genera archivo descargable

### Import
- Acepta JSON con formato SystemModel
- Valida con Zod schema antes de importar
- Muestra errores de esquema si el JSON es invalido
- Carga el sistema en el store

### Formato JSON canonico
El JSON exportado ES la fuente de verdad. El canvas de React Flow es solo una representacion visual editable de este modelo.

---

## CONVENCIONES DE CODIGO

### Nombres
- Componentes React: PascalCase (DiagramCanvas.tsx)
- Hooks: camelCase con prefijo use (useEditor.ts)
- Store: kebab-case (editor-store.ts)
- Tipos: PascalCase (SystemModel, ArchNode)
- Utilidades: camelCase (formatDate.ts)
- Archivos de config: kebab-case (node-definitions.ts)

### Patron de componentes
- Componentes funcionales con TypeScript
- Props tipadas con interface Props {}
- Export default para componentes de pagina
- Named exports para componentes reutilizables

### Estado
- Zustand para estado global (store del editor, sistema activo, capa activa)
- React state local para UI ephimera (dropdowns, modals, tooltips)
- NO usar React Context salvo para providers de tema

### Estilos
- Tailwind CSS exclusivamente
- NO CSS modules, NO styled-components
- Colores semanticos via Tailwind config si es necesario
- Tema oscuro como extension futura (no MVP)

### React Flow
- Custom nodes en src/features/diagram-editor/nodes/
- Cada tipo semantico tiene su custom node component
- Los nodos reciben data con toda la informacion semantica
- miniMap, Controls y Background habilitados

---

## SISTEMA DE EJEMPLO PRECARGADO

El mock-data incluye un sistema "E-Commerce Platform" con:
- **Application layer**: Frontend App, API Gateway, Order Service, Payment Service, Notification Service, User (actor), External Payment Provider
- **Infrastructure layer**: GCP Cloud Run (x2), GCP Load Balancer, GCP VPC, GCP Subnet, GCP Firewall
- **Data layer**: PostgreSQL DB, Redis Cache, GCP Pub/Sub, GCP Storage

### Errores intencionales para demo de validacion:
- Un backend_service SIN relatedInfraNodeId (warning)
- Un nodo GCP VM sin region ni gcpProject (error)
- Un nodo sin label (error)
- Un edge invalido entre annotation y database (error)
- Nodos aislados sin conexiones (warning)
- Labels duplicados en misma capa (warning)
- Un crossLayerRef con targetNodeId que no existe (error)

---

## UX/UI LAYOUT

```
+------------------------------------------------------------------+
|  TopBar: sistema actual | capa activa | estado | acciones         |
+----------+-----------------------------------+-------------------+
| Palette  |                                   | Properties Panel  |
| (sidebar |        React Flow Canvas          | (inspector del    |
|  izq)    |                                   |  nodo seleccion.) |
|          |                                   |                   |
| - tipos  |                                   | - label           |
|   de     |                                   | - description     |
|   nodos  |                                   | - propiedades     |
|   drag & |                                   | - refs cruzadas   |
|   drop   |                                   | - tags            |
+----------+-----------------------------------+-------------------+
|  ValidationPanel: errores | warnings | info | contador           |
+------------------------------------------------------------------+
```

- TopBar: nombre del sistema, tabs/selector de capa, badge de ReviewStatus, botones de workflow, import/export
- Sidebar izquierda (Palette): catalogo de nodos arrastrables agrupados por categoria
- Canvas central: React Flow con minimap, controles de zoom
- Panel derecho (Properties): inspector del nodo seleccionado con campos editables
- Panel inferior (Validation): lista de errores/warnings con click para navegar al nodo

---

## PUNTOS DE EXTENSION FUTURA (NO implementar en MVP)

- Backend API con NestJS o Express
- Base de datos PostgreSQL + Prisma
- Autenticacion con NextAuth
- Versionado de diagramas (Git-like)
- Catalogo empresarial de componentes
- Chatbot con Gemini para consultar la arquitectura
- Templates de diagramas
- Colaboracion en tiempo real
- Notificaciones de workflow
- Audit log

---

## COMANDOS

```bash
npm run dev        # Inicia en desarrollo (http://localhost:3000)
npm run build      # Build de produccion
npm run lint       # Linting
npm run type-check # Verificacion de tipos
```

---

## NOTAS PARA CLAUDE CODE

- Este es un MVP frontend-only. NO crear endpoints API, NO conectar bases de datos.
- La fuente de verdad es el modelo JSON, no el canvas visual.
- Cada tipo de nodo semantico tiene propiedades DISTINTAS. Consultar config/node-definitions.ts.
- Las reglas de validacion son funciones puras que reciben contexto y devuelven resultados.
- El workflow de revision es mock - no hay usuarios ni permisos.
- React Flow usa @xyflow/react (v12+), NO la version legacy react-flow-renderer.
- Usar zustand con slices pattern si el store crece mucho.
- localStorage es opcional para persistir entre recargas, no obligatorio.
- El idioma de la UI es ingles. Comentarios en codigo en ingles.
- Tailwind CSS con la paleta por defecto + grises neutros para look enterprise.
