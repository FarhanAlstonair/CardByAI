# CardCraft AI - AI-Powered Business Card Design Platform

## Overview

CardCraft AI is a full-stack SaaS application for creating and designing professional business cards with AI-powered generation capabilities. The platform features a sophisticated drag-and-drop canvas editor, template management system, and comprehensive design tools for creating customizable business cards. Users can generate designs through AI prompts or manually create cards using an advanced visual editor with support for text, shapes, images, QR codes, and background customization.

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