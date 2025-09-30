# 📦 Installation & Setup

## Install Dependencies
```bash
npm install @supabase/supabase-js
```

## Environment Variables
Add to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup
1. Create new Supabase project
2. Run the SQL from `supabase-schema.sql`
3. Get URL and anon key from Settings > API
4. Add to environment variables

## Run Application
```bash
npm run dev
```

## Features Implemented
✅ Drag & drop canvas editor
✅ Text, shapes, images, QR codes
✅ Real-time property editing
✅ Project save/load (Supabase)
✅ PNG export
✅ Responsive Stitch-inspired UI
✅ User authentication
✅ Project management dashboard

## Next Steps (Post-MVP)
- Fabric.js integration for advanced editing
- Cloudinary image uploads
- PDF export with print settings
- Template marketplace
- Team collaboration
- Subscription billing