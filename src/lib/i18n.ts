import { Language } from '@/store/ui-store'

type TranslationMap = Record<string, { en: string; es: string }>

const TEXTS: TranslationMap = {
  'global.appName': { en: 'ArchStudio', es: 'ArchStudio' },
  'global.home': { en: 'Home', es: 'Inicio' },
  'global.language': { en: 'Language', es: 'Idioma' },
  'global.theme': { en: 'Theme', es: 'Tema' },
  'global.light': { en: 'Light', es: 'Claro' },
  'global.dark': { en: 'Dark', es: 'Oscuro' },
  'global.english': { en: 'English', es: 'Ingles' },
  'global.spanish': { en: 'Spanish', es: 'Espanol' },

  'landing.subtitle': { en: 'Semantic Architecture Editor', es: 'Editor Semantico de Arquitectura' },
  'landing.newSystem': { en: 'New System', es: 'Nuevo Sistema' },
  'landing.noSystems': { en: 'No systems yet', es: 'Aun no hay sistemas' },
  'landing.createFirst': { en: 'Create your first system', es: 'Crea tu primer sistema' },
  'landing.layers': { en: 'layers', es: 'capas' },
  'landing.owner': { en: 'Owner', es: 'Owner' },
  'landing.systemName': { en: 'System Name', es: 'Nombre del Sistema' },
  'landing.description': { en: 'Description', es: 'Descripcion' },
  'landing.cancel': { en: 'Cancel', es: 'Cancelar' },
  'landing.create': { en: 'Create', es: 'Crear' },

  'editor.application': { en: 'Application', es: 'Aplicacion' },
  'editor.infrastructure': { en: 'Infrastructure', es: 'Infraestructura' },
  'editor.data': { en: 'Data', es: 'Datos' },
  'editor.import': { en: 'Import', es: 'Importar' },
  'editor.export': { en: 'Export', es: 'Exportar' },
  'editor.noDiagram': { en: 'No diagram for this layer yet', es: 'No hay diagrama para esta capa' },
  'editor.validation': { en: 'Validation', es: 'Validacion' },
  'editor.run': { en: 'Run', es: 'Ejecutar' },
  'editor.noIssues': { en: 'No issues found', es: 'Sin issues' },
  'editor.runHint': { en: 'Click "Run" to validate this diagram', es: 'Haz click en "Ejecutar" para validar este diagrama' },
  'editor.filterEmpty': { en: 'No issues match the current filter', es: 'Ningun issue coincide con el filtro actual' },
  'editor.propertiesHint': {
    en: 'Select a node on the canvas to inspect its properties',
    es: 'Selecciona un nodo en el canvas para inspeccionar sus propiedades',
  },
  'editor.deleteNode': { en: 'Delete Node', es: 'Eliminar Nodo' },
  'editor.components': { en: 'Components', es: 'Componentes' },
  'editor.dragToCanvas': { en: 'Drag to canvas', es: 'Arrastra al canvas' },
  'editor.palette': { en: 'Palette', es: 'Paleta' },
  'editor.inspector': { en: 'Inspector', es: 'Inspector' },
  'editor.issues': { en: 'Issues', es: 'Issues' },

  'workflow.draft': { en: 'Draft', es: 'Borrador' },
  'workflow.in_review': { en: 'In Review', es: 'En Revision' },
  'workflow.approved': { en: 'Approved', es: 'Aprobado' },
  'workflow.rejected': { en: 'Rejected', es: 'Rechazado' },
  'workflow.confirmAction': { en: 'Confirm Action', es: 'Confirmar Accion' },
  'workflow.optionalComment': { en: 'Optional comment...', es: 'Comentario opcional...' },
  'workflow.confirm': { en: 'Confirm', es: 'Confirmar' },
  'workflow.submit_for_review': { en: 'Submit for Review', es: 'Enviar a Revision' },
  'workflow.approve': { en: 'Approve', es: 'Aprobar' },
  'workflow.reject': { en: 'Reject', es: 'Rechazar' },
  'workflow.return_to_draft': { en: 'Return to Draft', es: 'Volver a Borrador' },
  'workflow.reopen': { en: 'Reopen', es: 'Reabrir' },
}

export function t(lang: Language, key: string): string {
  return TEXTS[key]?.[lang] ?? key
}
