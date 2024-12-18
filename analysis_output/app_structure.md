# Legal Buddy Web App Structure

```
Legal Buddy Web App
└── 📁 legal-buddy
    ├── 📁 .git
    ├── 📁 .github
    ├── 📁 .vscode # Contains the file extensions.json.
    ├── 📁 analysis_output # Contains the analysis output files.
    │   ├── 📄 analysis_progress.json
    │   ├── 📄 analysis_report.md
    │   ├── 📄 app_structure.md
    │   ├── 📄 codebase_analysis.json
    │   ├── 📄 codebase_analysis.log
    │   ├── 📄 refactor.txt
    │   └── 📄 todo.md
    ├── 📁 backend
    │   ├── 📁 api
    │   │   └── 📄 main.py
    │   ├── 📁 app # Next.js App Router directory containing pages and API routes.
    │   │   ├── 📁 __pycache__
    │   │   ├── 📁 api
    │   │   ├── 📁 core
    │   │   ├── 📁 models
    │   │   ├── 📁 services
    │   │   └── 📄 main.py
    │   ├── 📁 pdf_processor
    │   │   ├── 📁 __pycache__
    │   │   ├── 📄 __init__.py
    │   │   ├── 📄 annotate_data.py
    │   │   ├── 📄 models.py
    │   │   ├── 📄 process_pdfs.py
    │   │   ├── 📄 process_scheduling_orders.py
    │   │   ├── 📄 processor.py
    │   │   ├── 📄 supabase_handler.py
    │   │   └── 📄 train_spacy.py
    │   ├── 📁 supabase
    │   │   ├── 📁 .temp
    │   │   │   └── 📄 cli-latest
    │   │   ├── 📁 migrations
    │   │   ├── 📄 .gitignore # File containing rules for ignoring specific files and directories in the project repository.
    │   │   └── 📄 config.toml
    │   ├── 📁 tests
    │   ├── 📄 .env # Contains the ANTHROPIC_API_KEY necessary for authenticating with the specific API.
    │   ├── 📄 Dockerfile
    │   ├── 📄 requirements.txt
    │   └── 📄 run_processor.py
    ├── 📁 frontend
    │   ├── 📁 .next
    │   ├── 📁 prisma
    │   │   └── 📄 schema.prisma
    │   ├── 📁 public # Static assets directory containing SVG files and other public resources.
    │   │   ├── 📄 file.svg
    │   │   ├── 📄 globe.svg
    │   │   ├── 📄 next.svg
    │   │   ├── 📄 vercel.svg
    │   │   └── 📄 window.svg
    │   ├── 📁 scripts
    │   │   └── 📄 setup-storage.ts
    │   ├── 📁 src # Source code directory containing all application code.
    │   │   ├── 📁 app # Next.js App Router directory containing pages and API routes.
    │   │   │   ├── 📁 (auth)
    │   │   │   │   ├── 📁 login
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   ├── 📁 signup
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   └── 📄 layout.tsx
    │   │   │   ├── 📁 (dashboard)
    │   │   │   ├── 📁 (landing)
    │   │   │   │   ├── 📁 about
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   ├── 📁 contact
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   ├── 📁 features
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   ├── 📁 pricing
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   ├── 📄 layout.tsx
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 admin
    │   │   │   │   └── 📁 activity
    │   │   │   │       ├── 📄 ActivityTable.tsx
    │   │   │   │       └── 📄 page.tsx
    │   │   │   ├── 📁 api
    │   │   │   │   └── 📁 auth
    │   │   │   │       ├── 📁 [...nextauth]
    │   │   │   │       │   └── 📄 route.ts
    │   │   │   │       ├── 📁 signup
    │   │   │   │       │   └── 📄 route.ts
    │   │   │   │       └── 📁 test
    │   │   │   │           └── 📄 route.ts
    │   │   │   ├── 📁 calendar
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 cases
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 context
    │   │   │   │   └── 📄 AppContext.tsx
    │   │   │   ├── 📁 dashboard
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 documents
    │   │   │   │   ├── 📁 analysis
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 financial
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 fonts
    │   │   │   │   ├── 📄 GeistMonoVF.woff
    │   │   │   │   └── 📄 GeistVF.woff
    │   │   │   ├── 📁 learning
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 network
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 resources
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📄 favicon.ico
    │   │   │   ├── 📄 globals.css
    │   │   │   └── 📄 layout.tsx
    │   │   ├── 📁 components # Reusable React components directory.
    │   │   │   ├── 📁 cases
    │   │   │   ├── 📁 documents
    │   │   │   │   ├── 📄 AudioTranscriptSetDetailView.tsx
    │   │   │   │   ├── 📄 AudioTranscriptsTab.tsx
    │   │   │   │   ├── 📄 DocumentList.tsx
    │   │   │   │   ├── 📄 EmailSetDetailView.tsx
    │   │   │   │   ├── 📄 EmailsTab.tsx
    │   │   │   │   ├── 📄 ExtractionPanel.tsx
    │   │   │   │   ├── 📄 InvoiceSetDetailView.tsx
    │   │   │   │   ├── 📄 InvoicesTab.tsx
    │   │   │   │   ├── 📄 LegalFilingSetDetailView.tsx
    │   │   │   │   ├── 📄 LegalFilingsTab.tsx
    │   │   │   │   ├── 📄 TextMessageSetDetailView.tsx
    │   │   │   │   └── 📄 TextMessagesTab.tsx
    │   │   │   ├── 📁 landing
    │   │   │   │   ├── 📄 Footer.tsx
    │   │   │   │   └── 📄 Header.tsx
    │   │   │   ├── 📁 layout
    │   │   │   │   └── 📄 ClientLayout.tsx
    │   │   │   ├── 📁 navigation
    │   │   │   │   ├── 📄 SideNav.tsx
    │   │   │   │   └── 📄 TopNavBar.tsx
    │   │   │   ├── 📁 providers
    │   │   │   │   ├── 📄 SessionProvider.tsx
    │   │   │   │   └── 📄 ThemeProvider.tsx
    │   │   │   ├── 📁 ui
    │   │   │   │   ├── 📄 button.tsx
    │   │   │   │   ├── 📄 dialog.tsx
    │   │   │   │   ├── 📄 input.tsx
    │   │   │   │   └── 📄 tabs.tsx
    │   │   │   ├── 📄 BatchUploadModal.tsx
    │   │   │   ├── 📄 DocumentAnalysis.tsx
    │   │   │   ├── 📄 DocumentTimeline.tsx
    │   │   │   └── 📄 ThemeToggle.tsx
    │   │   ├── 📁 hooks
    │   │   │   └── 📄 useDocumentProcessor.ts
    │   │   ├── 📁 lib
    │   │   │   ├── 📁 auth
    │   │   │   │   ├── 📄 config.ts
    │   │   │   │   └── 📄 tracking.ts
    │   │   │   ├── 📄 documentProcessing.ts
    │   │   │   ├── 📄 documents.ts
    │   │   │   ├── 📄 prisma.ts
    │   │   │   ├── 📄 supabase.ts
    │   │   │   └── 📄 utils.ts
    │   │   ├── 📁 types
    │   │   │   ├── 📄 document.ts
    │   │   │   └── 📄 supabase.ts
    │   │   └── 📄 middleware.ts
    │   ├── 📄 .env # Contains the ANTHROPIC_API_KEY necessary for authenticating with the specific API.
    │   ├── 📄 .eslintrc.json
    │   ├── 📄 Dockerfile
    │   ├── 📄 next-env.d.ts # Type definitions for Next.js, including references to necessary global image types.
    │   ├── 📄 next.config.ts
    │   ├── 📄 package-lock.json
    │   ├── 📄 package.json # Defines project details, including scripts, dependencies, and devDependencies.
    │   ├── 📄 postcss.config.mjs # Configuration file for PostCSS, defining plugins including Tailwind CSS.
    │   ├── 📄 tailwind.config.ts
    │   └── 📄 tsconfig.json
    ├── 📁 supabase
    │   └── 📁 migrations
    ├── 📁 test
    │   └── 📁 scheduling-orders
    │       ├── 📄 Updated Scheduling order Ballys.pdf
    │       └── 📄 gov.uscourts.txed.227625.27.0.pdf
    ├── 📁 tools
    ├── 📁 venv
    ├── 📁 venv311
    ├── 📄 .cursorignore
    ├── 📄 .cursorrules # Summary: Contains the UI/UX plan, app structure, file descriptions, and API routes.
    ├── 📄 .env # Contains the ANTHROPIC_API_KEY necessary for authenticating with the specific API.
    ├── 📄 .gitignore # File containing rules for ignoring specific files and directories in the project repository.
    ├── 📄 README.md # README.md: Contains information about a Next.js project, including setup instructions.
    ├── 📄 ROADMAP.md
    ├── 📄 codebase_analysis.py # This file performs code analysis, including checking for validation issues and analyzing imports.
    ├── 📄 docker-compose.yml
    ├── 📄 generate_todo.py
    ├── 📄 next.config.ts
    ├── 📄 package-lock.json
    └── 📄 package.json # Defines project details, including scripts, dependencies, and devDependencies.

Legend:
📁 Directory
📄 File
```
