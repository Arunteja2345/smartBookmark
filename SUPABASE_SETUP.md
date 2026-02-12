# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the Smart Bookmarks app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in the details:
   - **Name**: smart-bookmarks (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the sidebar
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

4. Create a `.env.local` file in your project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Create the Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** icon in the sidebar
2. Click "New query"
3. Copy and paste the following SQL:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Policy: Users can only see their own bookmarks
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime for bookmarks table
alter publication supabase_realtime add table bookmarks;
```

4. Click "Run" to execute the SQL

## Step 4: Configure Google OAuth

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to expand it
3. Enable the Google provider
4. You'll need to create a Google OAuth app:

### Creating Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmarks
   - User support email: Your email
   - Developer contact: Your email
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback` (replace with your Supabase project URL)
   - For local development: `http://localhost:54321/auth/v1/callback`
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### Add Google Credentials to Supabase

1. Back in Supabase, paste the **Client ID** and **Client Secret** into the Google provider settings
2. Click **Save**

## Step 5: Update Redirect URLs (After Deployment)

After deploying to Vercel, you'll need to add your production URL:

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your Vercel URL to authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback`
4. In Supabase, go to **Authentication** → **URL Configuration**
5. Add your Vercel URL to **Site URL** and **Redirect URLs**

## Verification

Test your setup:
1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. You should be redirected to `/login`
4. Click "Sign in with Google"
5. Complete the Google OAuth flow
6. You should be redirected back to the app
7. Try adding a bookmark!

## Troubleshooting

**"Invalid redirect URL"**: Make sure you've added the correct redirect URLs in both Google Cloud Console and Supabase settings.

**"User not found"**: Check that your RLS policies are correctly set up in the SQL Editor.

**Bookmarks not updating in real-time**: Verify that you ran the `alter publication supabase_realtime add table bookmarks;` command.
