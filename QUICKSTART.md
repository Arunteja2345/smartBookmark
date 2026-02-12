# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free)
- A Google Cloud account (for OAuth)

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Set Up Supabase
Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Quick summary:**
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema (in SUPABASE_SETUP.md)
3. Configure Google OAuth
4. Get your API credentials

## Step 3: Configure Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Deploy to Vercel
```bash
# Option 1: Via Vercel Dashboard
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

# Option 2: Via CLI
npm install -g vercel
vercel
```

## Step 6: Update OAuth Redirect URLs
After deployment, add your Vercel URL to:
- Google Cloud Console (authorized redirect URIs)
- Supabase Dashboard (Authentication → URL Configuration)

## 🎉 Done!
Your Smart Bookmark App is live!

## Need Help?
- See [README.md](./README.md) for full documentation
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase setup
