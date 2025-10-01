# CardCraft AI - AI-Powered Business Card Design Platform

## Overview

CardCraft AI is a full-stack SaaS application for creating and designing professional business cards with AI-powered generation capabilities. The platform features a sophisticated drag-and-drop canvas editor, professional template library with 15+ templates, and comprehensive design tools for creating customizable business cards. Users can choose from professional templates across 7 categories, generate designs through AI prompts, or manually create cards using an advanced visual editor with support for text, shapes, images, QR codes, and background customization.

## Recent Changes (October 2025)

### Template System ✅ COMPLETED
- **Professional Template Library**: Added 15 professionally designed templates across 7 categories:
  - Business (2 templates)
  - Creative (2 templates)
  - Minimal (3 templates)
  - Modern (3 templates)
  - Professional (2 templates)
  - Tech (2 templates)
  - Artistic (2 templates)
- **Template Gallery Page**: New browsable gallery with search, category filtering, and responsive grid layout
- **Template-to-Editor Flow**: Complete workflow from template selection to editor with pre-populated design data
  - URL routing with query parameters for template selection
  - AdvancedCanvasEditor initializes with template width, height, backgroundColor, and elements
  - Canvas compatibility supports both `content` and `text` properties for element data

### User Experience Improvements ✅ COMPLETED
- **Enhanced Homepage**: Replaced placeholder text with 4 professional example cards showcasing different styles
- **Improved Dashboard**: Added beautiful empty state with 3 quick-start options:
  - Browse Templates (access to 15+ templates)
  - Generate with AI (AI-powered creation)
  - Start from Scratch (blank canvas)
- **Popular Templates Preview**: Dashboard shows first 4 templates with quick access to gallery
- **Navigation Updates**: Added Templates link to main sidebar navigation

### Technical Fixes ✅ COMPLETED
- **Syntax Errors**: Fixed useState initialization in AdvancedCanvasEditor for canvasSize
- **TypeScript Errors**: Added explicit types to forEach parameters (string, number)
- **Runtime Compatibility**: Canvas drawCanvas function handles both element.content and element.text
- **Build Status**: No LSP diagnostics, clean compilation, HMR working correctly
- **Application Status**: Hackathon-ready and demo-worthy

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React** with **TypeScript** for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TailwindCSS** for utility-first styling with custom design system
- **shadcn/ui** component library built on Radix UI primitives

**Design System:**
- Custom theme inspired by Google's Stitch design language
- Minimal, clean aesthetic with emphasis on whitespace
- Support for light/dark mode with CSS custom properties
- Comprehensive color palette system with semantic tokens
- Responsive layout system using Tailwind spacing units

**State Management:**
- **TanStack Query (React Query)** for server state management and caching
- Local component state with React hooks
- Custom undo/redo system with history tracking (100-step limit)
- Session-based authentication state

**Key UI Features:**
- Advanced canvas editor with real-time property editing
- Multi-element support (text, shapes, images, QR codes)
- Layer management with z-index control and visibility toggles
- Background customization (solid colors, gradients, images with transforms)
- 18 premium font families with advanced typography controls
- Tabbed interface for organizing editor tools (Elements, Text, Design, Layers, Export)
- Preset canvas sizes for business cards and posters

### Backend Architecture

**Server Framework:**
- **Express.js** with TypeScript
- Session-based authentication with express-session
- RESTful API design pattern
- HTTP request/response logging middleware

**API Structure:**
- `/api/auth/*` - Authentication endpoints (Google OAuth, login, logout, session management)
- `/api/cards/*` - Business card CRUD operations and AI generation
- `/api/admin/*` - Admin dashboard endpoints (users, cards, statistics)
- `/api/test-keys` - API key validation endpoint

**Authentication Flow:**
- Google OAuth 2.0 integration for social login
- Email/password authentication support
- Role-based access control (user/admin roles)
- Session persistence with secure cookies
- Protected routes with middleware validation

### Data Storage

**Database Technology:**
- **PostgreSQL** as primary relational database
- Database accessed via **Drizzle ORM** for type-safe queries
- **Neon Database** serverless PostgreSQL provider
- Connection pooling through `@neondatabase/serverless`

**Schema Design:**

**Users Table:**
- Unique identifiers with UUID primary keys
- Google OAuth integration (googleId, avatar)
- Role-based permissions (user/admin)
- Timestamp tracking (createdAt, lastLogin)

**Business Cards Table:**
- Foreign key relationship to users
- AI generation metadata (prompt, style, generated text)
- Card content fields (name, title, company, contact info)
- Design properties (colors, fonts, layout)
- Canvas elements stored as JSONB for flexible structure
- Image URLs for thumbnails and exports
- Canvas dimensions (width, height)
- Timestamps for creation and updates

**AI Usage Table:**
- Tracking AI API calls and tokens
- User activity monitoring
- Performance analytics

**In-Memory Storage:**
- `MemStorage` class provides fallback for development
- Map-based data structures for users, cards, and AI usage
- Implements full IStorage interface for consistency

### External Dependencies

**AI Services:**
- **Cerebras AI** (primary) - LLaMA 3.1-8b model for business card content generation
- **HuggingFace LLaMA** (secondary/fallback) - Alternative AI provider
- AI endpoints: `/v1/chat/completions` for text generation

**Image Management:**
- **Cloudinary** for image uploads and storage
- Upload preset: 'cardcraft_preset'
- Image transformations and optimization
- QR code generation via QR Server API (`api.qrserver.com`)

**Authentication:**
- **Google OAuth 2.0** for social login
- Client ID and secret configuration
- Redirect URI handling for callback flow

**Environment Variables Required:**
```
DATABASE_URL - PostgreSQL connection string
GOOGLE_CLIENT_ID - Google OAuth client ID
GOOGLE_CLIENT_SECRET - Google OAuth secret
CLOUDINARY_CLOUD_NAME - Cloudinary account name
CLOUDINARY_API_KEY - Cloudinary API key
CEREBRAS_API_KEY - Cerebras AI API key
HUGGINGFACE_API_KEY - HuggingFace API key (optional)
SUPABASE_URL - Supabase project URL
SUPABASE_KEY - Supabase anonymous key
SECRET_KEY - Session encryption secret
```

**Development Tools:**
- **Drizzle Kit** for database migrations and schema management
- **esbuild** for production backend bundling
- **cross-env** for environment variable management
- Replit-specific plugins for development experience

**Frontend Libraries:**
- React Hook Form with Zod validation
- HexColorPicker for color selection
- date-fns for date formatting
- Lucide React for icon system
- class-variance-authority for component variants