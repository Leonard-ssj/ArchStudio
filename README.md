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
- **shadcn-style UI base** (Button, Dialog, Badge, Input, Card)
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

## End-to-End Flow

1. Open `/` and create or select a system.
2. Enter the editor route `/:systemId`.
3. Pick a layer (`application`, `infrastructure`, `data`) in the top bar.
4. Drag semantic nodes from palette to canvas and connect them.
5. Edit node metadata in the properties panel.
6. Run validation and inspect errors/warnings in validation panel.
7. Move diagram through workflow states (draft → in_review → approved/rejected).
8. Export JSON (canonical source of truth) or import validated JSON.

## QA Smoke Checklist

- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run dev`
- Home page loads with styles and can create a new system.
- Editor page loads and allows drag/drop + edge creation.
- Validation run marks issues in panel and on nodes.
- Import/export JSON roundtrip works.

## Vercel Deployment

### Automatic Deploy (Recommended)

1. Push repository to GitHub.
2. In Vercel: **Add New Project** -> import the GitHub repo.
3. Keep default preset: **Next.js**.
4. Set Production Branch to `main`.
5. Every push to `main` triggers automatic production deployment.
6. Pull Requests trigger preview deployments automatically.

### Build Settings

- Install Command: `npm ci`
- Build Command: `npm run build` (or `npm run vercel-build`)
- Output Directory: `.next` (default for Next.js)
- Node version: `22.x` (aligned with `package.json` engines and `.nvmrc`)

## Troubleshooting

- **Error `Cannot find module './vendor-chunks/...js'`**:
  - Stop dev server.
  - Remove `.next` folder.
  - Start again with `npm run dev` or `npm run build`.
  - This is usually a stale/corrupted Next.js cache issue.

## Development with Claude Code

This project includes a `CLAUDE.md` file with full context for Claude Code. Open the project folder in your IDE with the Claude extension, and Claude will understand the entire domain model, validation rules, and architecture.
