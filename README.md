# ArchStudio - Semantic Architecture Editor

A visual semantic editor for enterprise architecture modeling with validation, cross-layer consistency checks, and review workflows.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Stack

- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **React Flow** (@xyflow/react) - visual canvas
- **Zustand** - state management
- **Tailwind CSS** - styling
- **Zod** - schema validation for import/export

## Project Structure

```
src/
  app/                    → Next.js pages and layouts
  components/ui/          → Reusable UI components
  components/layout/      → App shell (TopBar, Sidebar)
  features/
    diagram-editor/       → Canvas, palette, properties panel, custom nodes
    rules-engine/         → Validation rules and engine
    workflow/             → Review status workflow
    import-export/        → JSON import/export with Zod validation
    cross-layer/          → Cross-layer consistency checks
  store/                  → Zustand stores
  types/                  → TypeScript domain types
  config/                 → Node definitions, layer configs, rule configs
  mock-data/              → Example system with intentional errors
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript type verification |

## Key Concepts

- **System**: A complete architectural system (e.g., "E-Commerce Platform")
- **Diagram**: One diagram per architectural layer per system
- **Layer**: application, infrastructure, or data
- **Semantic Node**: A typed component with required properties based on its type
- **Cross-Layer Reference**: Links between nodes in different layers
- **Validation**: Rule-based checks for errors, warnings, and completeness
- **Workflow**: Draft → In Review → Approved/Rejected lifecycle

## Development with Claude Code

This project includes a `CLAUDE.md` file with full context for Claude Code. Open the project folder in your IDE with the Claude extension, and Claude will understand the entire domain model, validation rules, and architecture.
