# Legal Buddy - Legal Practice Management SaaS

A comprehensive legal practice management platform built with Next.js, Supabase, and AI integration.

## 🛠 Technical Stack & Architecture

### Core Framework
- **Frontend**: Next.js 14 with App Router
- **Backend**: Supabase
- **Database**: PostgreSQL with Prisma & Supabase
- **State Management**: Redux (planned)
- **Styling**: TailwindCSS with custom theme
- **Authentication**: NextAuth.js with Google OAuth
- **Storage**: Supabase Storage

### Key Dependencies
- next-themes for dark mode
- headlessui/react for UI components
- heroicons/react for icons
- Prisma client for database operations
- Supabase client for storage and real-time features

## 📁 Project Structure

```bash
legal-buddy/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── (landing)/         # Public landing pages
│   │   ├── admin/             # Admin panel routes
│   │   ├── api/               # API routes
│   │   └── [other routes]/    # Feature-specific routes
│   ├── components/
│   │   ├── cases/             # Case management components
│   │   ├── landing/           # Landing page components
│   │   ├── layout/            # Layout components
│   │   ├── navigation/        # Navigation components
│   │   └── providers/         # Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   │   ├── auth/             # Authentication utilities
│   │   ├── documentProcessing.ts
│   │   ├── documents.ts
│   │   ├── prisma.ts
│   │   └── supabase.ts
│   └── types/                 # TypeScript definitions
├── prisma/                    # Database schema
├── public/                    # Static assets
└── supabase/                 # Supabase configurations
```

## 🔧 Implementation Status

### Completed Features
- Basic Next.js App Router setup with TypeScript
- TailwindCSS integration with dark mode support
- NextAuth.js authentication with Google OAuth
- Basic document upload and storage with Supabase
- Layout components with responsive design
- Basic routing structure and navigation

### In Progress
- Document analysis and processing features
- Case management system
- Calendar integration
- User roles and permissions
- Analytics dashboard

### Pending Implementation
- Redux state management
- AI document analysis features
- Court filing system integration
- Advanced security features (2FA, E2E encryption)
- Comprehensive audit logging

## 🚀 Development Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/commonality2u/lglbud.git
cd legal-buddy
npm install
```

2. Configure environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

## 📝 Technical Notes

### Database Schema
- Document management tables with version control
- User profiles with role-based access
- Case management with party relationships
- Activity logging for audit trails

### Authentication Flow
- NextAuth.js with Google OAuth provider
- Custom credentials provider for email/password
- Session management with Supabase
- Planned 2FA implementation

### File Storage
- Supabase storage buckets for documents
- Separate buckets for different content types
- Size limits and file type restrictions
- Signed URLs for secure access

### Security Implementation
- Route protection via middleware
- Planned RBAC implementation
- Database RLS policies
- API route validation

## 🔍 Known Issues & TODOs

See `todo.md` for a comprehensive list of pending tasks and known issues.

## Private Repository Notice

This is a private repository. Access is restricted to authorized team members only.
