# Legal Buddy Web App Structure

```
Legal Buddy Web App
└── 📁 legal-buddy
    ├── 📁 analysis_output # Contains the analysis output files.
    │   ├── 📄 analysis_progress.json
    │   ├── 📄 app_structure.md
    │   ├── 📄 codebase_analysis.json
    │   └── 📄 codebase_analysis.log
    ├── 📁 prisma
    │   └── 📄 schema.prisma
    ├── 📁 public # Static assets directory containing SVG files and other public resources.
    │   ├── 📄 file.svg
    │   ├── 📄 globe.svg
    │   ├── 📄 next.svg
    │   ├── 📄 vercel.svg
    │   └── 📄 window.svg
    ├── 📁 scripts
    │   └── 📄 setup-storage.ts
    ├── 📁 src # Source code directory containing all application code.
    │   ├── 📁 app # Next.js App Router directory containing pages and API routes.
    │   │   ├── 📁 (auth)
    │   │   │   ├── 📁 login
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 signup
    │   │   │   │   └── 📄 page.tsx
    │   │   │   └── 📄 layout.tsx
    │   │   ├── 📁 (dashboard)
    │   │   ├── 📁 (landing)
    │   │   │   ├── 📁 about
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 contact
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 features
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 pricing
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📄 layout.tsx
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 admin
    │   │   │   └── 📁 activity
    │   │   │       ├── 📄 ActivityTable.tsx
    │   │   │       └── 📄 page.tsx
    │   │   ├── 📁 api
    │   │   │   └── 📁 auth
    │   │   │       ├── 📁 signup
    │   │   │       │   └── 📄 route.ts
    │   │   │       └── 📁 test
    │   │   │           └── 📄 route.ts
    │   │   ├── 📁 calendar
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 cases
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 dashboard
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 documents
    │   │   │   ├── 📁 analysis
    │   │   │   │   └── 📄 page.tsx
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 financial
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 fonts
    │   │   │   ├── 📄 GeistMonoVF.woff
    │   │   │   └── 📄 GeistVF.woff
    │   │   ├── 📁 learning
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 network
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 resources
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📄 favicon.ico
    │   │   ├── 📄 globals.css
    │   │   └── 📄 layout.tsx
    │   ├── 📁 components # Reusable React components directory.
    │   │   ├── 📁 cases
    │   │   ├── 📁 landing
    │   │   │   ├── 📄 Footer.tsx
    │   │   │   └── 📄 Header.tsx
    │   │   ├── 📁 layout
    │   │   │   └── 📄 ClientLayout.tsx
    │   │   ├── 📁 navigation
    │   │   │   ├── 📄 SideNav.tsx
    │   │   │   └── 📄 TopNavBar.tsx
    │   │   ├── 📁 providers
    │   │   │   ├── 📄 SessionProvider.tsx
    │   │   │   └── 📄 ThemeProvider.tsx
    │   │   ├── 📄 BatchUploadModal.tsx
    │   │   ├── 📄 DocumentAnalysis.tsx
    │   │   ├── 📄 DocumentTimeline.tsx
    │   │   └── 📄 ThemeToggle.tsx
    │   ├── 📁 hooks
    │   │   └── 📄 useDocumentProcessor.ts
    │   ├── 📁 lib
    │   │   ├── 📁 auth
    │   │   │   ├── 📄 config.ts
    │   │   │   └── 📄 tracking.ts
    │   │   ├── 📄 documentProcessing.ts
    │   │   ├── 📄 documents.ts
    │   │   ├── 📄 prisma.ts
    │   │   └── 📄 supabase.ts
    │   ├── 📁 types
    │   │   ├── 📄 document.ts
    │   │   └── 📄 supabase.ts
    │   └── 📄 middleware.ts
    ├── 📁 supabase
    │   ├── 📁 migrations
    │   │   └── 📄 20231213_initial_setup.sql
    │   └── 📄 config.toml
    ├── 📄 .cursorrules # Summary: Contains the UI/UX plan, app structure, file descriptions, and API routes.
    ├── 📄 .env # Contains the ANTHROPIC_API_KEY necessary for authenticating with the specific API.
    ├── 📄 README.md # README.md: Contains information about a Next.js project, including setup instructions.
    ├── 📄 codebase_analysis.py # This file performs code analysis, including checking for validation issues and analyzing imports.
    ├── 📄 docker-compose.yml
    ├── 📄 generate_todo.py
    ├── 📄 next-env.d.ts # Type definitions for Next.js, including references to necessary global image types.
    ├── 📄 next.config.ts
    ├── 📄 package-lock.json
    ├── 📄 package.json # Defines project details, including scripts, dependencies, and devDependencies.
    ├── 📄 postcss.config.mjs # Configuration file for PostCSS, defining plugins including Tailwind CSS.
    ├── 📄 tailwind.config.ts
    └── 📄 tsconfig.json

Legend:
📁 Directory
📄 File
```


## Dependencies

### NPM Packages Required

### Python Packages Required
- aiohttp
- anthropic
- ast
- asyncio
- colorama
- dotenv
- logging
- random
- subprocess
- tqdm

### Import Issues
- D:\Documents\Github\CourtCopy_Saas\legal-buddy\src\app\layout.tsx: Missing local import: ./globals.css
