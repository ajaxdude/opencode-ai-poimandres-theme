# Codebase Structure

**Analysis Date:** 2026-02-09

## Directory Layout

```
opencode-ai-poimandres-theme/
├── .gitignore              # Git ignore patterns
├── LICENSE                 # MIT License
├── README.md               # User documentation
├── assets/                 # Visual assets
│   ├── dots.png           # Theme preview (large)
│   └── dots-small.png     # Theme preview (small)
├── .opencode/             # opencode.ai plugin directory
│   ├── bun.lock           # Bun package lockfile
│   ├── .gitignore         # Plugin-specific gitignore
│   ├── package.json       # Plugin dependency declaration
│   ├── node_modules/      # Plugin dependencies (ignored)
│   └── themes/            # Theme definitions
│       └── poimandres.json  # Main theme configuration
└── .planning/             # Planning directory (GSD artifacts)
    └── codebase/          # Codebase analysis documents
        ├── ARCHITECTURE.md # Architecture documentation
        └── STRUCTURE.md    # This file
```

## Directory Purposes

**Project Root:**
- Purpose: Contains all project files and documentation
- Contains: License, README, assets, plugin configuration
- Key files: `README.md`, `LICENSE`

**assets:**
- Purpose: Visual assets for documentation and theme preview
- Contains: PNG image files
- Key files: `assets/dots.png`, `assets/dots-small.png`

**.opencode:**
- Purpose: opencode.ai plugin directory structure
- Contains: Plugin manifest, theme definition, package management
- Key files: `.opencode/package.json`, `.opencode/themes/poimandres.json`

**.opencode/themes:**
- Purpose: Theme definition files
- Contains: JSON theme configuration files
- Key files: `.opencode/themes/poimandres.json`

**.opencode/node_modules:**
- Purpose: Plugin dependencies (managed by Bun)
- Contains: Installed npm packages
- Committed: No (gitignored)

**.planning:**
- Purpose: GSD planning and analysis artifacts
- Contains: Codebase documentation, phase plans, execution notes
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`

## Key File Locations

**Entry Points:**
- `README.md`: User-facing documentation, installation instructions
- `.opencode/themes/poimandres.json`: Main theme configuration file

**Configuration:**
- `.opencode/package.json`: Plugin dependency declaration
- `.opencode/bun.lock`: Dependency lockfile

**Core Logic:**
- `.opencode/themes/poimandres.json`: Theme color definitions and mappings (sole "logic")

**Documentation:**
- `README.md`: Installation, usage, color palette reference
- `LICENSE`: MIT license text

## Naming Conventions

**Files:**
- Configuration: `{name}.json` (e.g., `poimandres.json`, `package.json`)
- Documentation: `README.md`, `{TOPIC}.md`
- License: `LICENSE`
- Lockfiles: `{manager}.lock` (e.g., `bun.lock`)
- Assets: `{name}.png` (kebab-case)

**Directories:**
- Plugin directory: `.opencode` (hidden directory, dot prefix)
- Theme directory: `themes` (plural, lowercase)
- Planning directory: `.planning` (hidden directory, dot prefix)
- Assets directory: `assets` (plural, lowercase)

**Color Tokens (in theme JSON):**
- Pattern: `poimandres{ColorName}` (camelCase after prefix)
- Examples: `poimandresBrightMint`, `poimandresDarkGray`, `poimandresStrongTurquoise`

**Theme Properties (in theme JSON):**
- Pattern: camelCase (e.g., `inputBackground`, `syntaxKeyword`, `markdownText`)

## Where to Add New Code

**New Theme Variant:**
- Primary code: `.opencode/themes/{new-theme}.json`
- Tests: Not applicable (static configuration, validated by schema)

**New Color Definition:**
- Add to `defs` section in `.opencode/themes/poimandres.json` (lines 3-22)
- Follow naming pattern: `poimandres{ColorName}`

**New UI Element Styling:**
- Add to `theme` section in `.opencode/themes/poimandres.json` (lines 24-248)
- Include both `dark` and `light` variants

**New Visual Assets:**
- Add to `assets/` directory
- Update `README.md` to reference new assets if needed

**Documentation Updates:**
- Edit `README.md` for user-facing changes
- Edit `.planning/codebase/` for architecture/convention changes

## Special Directories

**.opencode:**
- Purpose: opencode.ai plugin configuration and theme definitions
- Generated: No (committed to git)
- Committed: Yes (except `node_modules/`)
- Contains: Plugin manifest, theme files, package management

**.opencode/node_modules:**
- Purpose: Installed plugin dependencies
- Generated: Yes (by Bun package manager)
- Committed: No (gitignored in `.opencode/.gitignore`)

**.planning:**
- Purpose: GSD (Goal-Driven Software Development) planning artifacts
- Generated: Yes (by GSD commands)
- Committed: Yes (version-controlled planning documents)

**assets:**
- Purpose: Visual assets for theme preview and documentation
- Generated: No (created manually)
- Committed: Yes (PNG images are binary assets)

---

*Structure analysis: 2026-02-09*
