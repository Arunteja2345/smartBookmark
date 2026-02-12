# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication, real-time synchronization across devices, and a beautiful glassmorphism UI.

![Smart Bookmarks](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🔐 **Google OAuth Authentication** - No email/password required
- 📱 **Real-time Sync** - Bookmarks update instantly across all your devices
- 🔒 **Private & Secure** - Each user's bookmarks are completely private (Row Level Security)
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- ⚡ **Fast & Responsive** - Built with Next.js 14 App Router
- 🚀 **Easy Deployment** - One-click deploy to Vercel

## 🚀 Live Demo

**Live URL**: [Your Vercel URL will go here after deployment]

## 📋 Requirements

- Node.js 18+ and npm
- A Supabase account (free tier works great)
- A Google Cloud account for OAuth credentials

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smartBookmarksApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up the database schema
- Configure Google OAuth
- Get your API credentials

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel
```

### Post-Deployment Steps

After deploying, you need to update your OAuth redirect URLs:

1. **Google Cloud Console**:
   - Add `https://your-app.vercel.app/api/auth/callback` to authorized redirect URIs

2. **Supabase Dashboard**:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to Site URL and Redirect URLs

## 🎯 Usage

1. **Sign In**: Click "Sign in with Google" on the login page
2. **Add Bookmark**: Enter a URL and title, then click "Add Bookmark"
3. **View Bookmarks**: All your bookmarks are displayed in a beautiful card layout
4. **Delete Bookmark**: Hover over a bookmark and click the "Delete" button
5. **Real-time Sync**: Open the app in multiple tabs or devices - changes sync instantly!

## 🐛 Problems Encountered & Solutions

### Problem 1: npm Package Naming Restrictions

**Issue**: `create-next-app` failed because npm doesn't allow capital letters in package names.

**Solution**: Manually initialized the project with `npm init -y` and installed dependencies separately, then configured the project name as `smart-bookmarks-app` in `package.json`.

### Problem 2: Supabase SSR Cookie Management

**Issue**: Initial implementation didn't properly handle cookies in middleware and server components.

**Solution**: Used `@supabase/ssr` package with separate client configurations for browser (`createBrowserClient`) and server (`createServerClient`). Implemented proper cookie handling in middleware to refresh sessions on each request.

### Problem 3: Real-time Subscriptions Not Working

**Issue**: Bookmarks weren't updating in real-time across tabs initially.

**Solution**: 
1. Added `alter publication supabase_realtime add table bookmarks;` to the SQL schema.
2. Implemented a **manual refresh fallback**: When a bookmark is added in the current tab, the list refreshes immediately even if Realtime is disconnected.
3. Added robust connection handling and status logging for debugging.

### Problem 4: OAuth Redirect Loop

**Issue**: Users were getting stuck in a redirect loop between login and home page.

**Solution**: Implemented proper middleware logic to check authentication state and redirect accordingly. Added exclusions for `/api/auth` routes and static assets in the middleware matcher.

### Problem 5: Row Level Security (RLS) Policies

**Issue**: Initially, users could potentially see other users' bookmarks.

**Solution**: Implemented comprehensive RLS policies in Supabase:
- `auth.uid() = user_id` check on all SELECT, INSERT, and DELETE operations
- Enabled RLS on the bookmarks table
- Added cascade delete to remove bookmarks when user accounts are deleted

## 📁 Project Structure

```
smartBookmarksApp/
├── app/
│   ├── api/auth/callback/     # OAuth callback handler
│   ├── login/                 # Login page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main app page
├── components/
│   ├── AddBookmarkForm.tsx    # Add bookmark form
│   ├── AuthButton.tsx         # Auth button component
│   └── BookmarkList.tsx       # Bookmark list with real-time
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   └── types.ts               # TypeScript types
├── middleware.ts              # Auth middleware
├── SUPABASE_SETUP.md          # Supabase setup guide
└── README.md                  # This file
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own data
- **Google OAuth**: Secure authentication without storing passwords
- **Server-side Session Management**: Cookies are httpOnly and secure
- **Environment Variables**: Sensitive credentials stored securely

## 🤝 Contributing

This is a personal project, but feel free to fork and customize it for your own use!

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://smart-bookmark-gules.vercel.app/)

---

**Made with ❤️ using Next.js and Supabase**
