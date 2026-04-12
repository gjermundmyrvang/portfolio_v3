# Markdown CMS

A minimal, self-hosted CMS for managing markdown-based content. Built with Next.js, TypeScript, Tailwind CSS, and Supabase. Write content in markdown, publish it anywhere, not just blogs.

---

## Features

- Write and edit post content in markdown syntax
- Admin-only access via Supabase Auth and Row Level Security
- Posts with title, slug, summary, featured flag, and auto-updated timestamps
- Image uploads inserted directly into markdown
- Clean, minimal UI built with Tailwind CSS

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) account (free tier works)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/gjermundmyrvang/md-cms
cd md-cms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your Supabase credentials (see [Environment Variables](#environment-variables) below).

### 4. Set up your Supabase project

Follow the [Supabase Setup](#supabase-setup) section below to create the required tables, functions, and policies.

### 5. Add yourself as an admin

After setting up the schema, go to your Supabase dashboard → **Table Editor** → `admins` table and insert a row with your Supabase Auth user ID:

```sql
insert into public.admins (user_id) values ('<your-auth-user-uuid>');
```

You can find your user ID under **Authentication → Users** in the Supabase dashboard.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find both values in your Supabase project under **Project Settings → API**.

| Variable                        | Description                   |
| ------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anon key |

---

## Supabase Setup

Run the following SQL statements in your Supabase project under **SQL Editor**. Run them in the order they appear.

### 1. Create tables

```sql
create table public.admins (
  user_id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  constraint admins_pkey primary key (user_id),
  constraint admins_user_id_fkey foreign key (user_id) references auth.users(id)
);

create table public.posts (
  id uuid not null default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content_md text not null default '',
  featured boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint posts_pkey primary key (id)
);
```

### 2. Create the `is_admin` helper function

This function checks whether the currently authenticated user is in the `admins` table. It is used by RLS policies to gate write access.

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = auth.uid()
  );
$$;
```

### 3. Enable Row Level Security and add policies

**Admins table** — no direct access by default, but authenticated users can check if they are an admin:

```sql
alter table public.admins enable row level security;

create policy "admins table no access"
on public.admins
for all
to anon, authenticated
using (false)
with check (false);

create policy "authenticated can read admins"
on public.admins
for select
to authenticated
using (true);
```

**Posts table** — public read access, admin-only writes:

```sql
alter table public.posts enable row level security;

create policy "public can read posts"
on public.posts
for select
to anon, authenticated
using (true);

create policy "admin can insert posts"
on public.posts
for insert
to authenticated
with check (public.is_admin());

create policy "admin can update posts"
on public.posts
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin can delete posts"
on public.posts
for delete
to authenticated
using (public.is_admin());
```

### 4. Add the `updated_at` trigger

This automatically updates the `updated_at` column on every post edit:

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();
```

---

## Database Schema

### `public.posts`

| Column       | Type          | Description                           |
| ------------ | ------------- | ------------------------------------- |
| `id`         | `uuid`        | Primary key, auto-generated           |
| `title`      | `text`        | Post title                            |
| `slug`       | `text`        | URL-friendly unique identifier        |
| `summary`    | `text`        | Short description (optional)          |
| `content_md` | `text`        | Full post content in markdown         |
| `featured`   | `boolean`     | Whether the post is featured          |
| `created_at` | `timestamptz` | Creation timestamp                    |
| `updated_at` | `timestamptz` | Last updated timestamp (auto-managed) |

### `public.admins`

| Column       | Type          | Description                 |
| ------------ | ------------- | --------------------------- |
| `user_id`    | `uuid`        | References `auth.users(id)` |
| `created_at` | `timestamptz` | When the admin was added    |

---

## Adding More Admins

To grant another user admin access, insert their Supabase Auth user ID into the `admins` table:

```sql
insert into public.admins (user_id) values ('<user-uuid>');
```

To revoke access:

```sql
delete from public.admins where user_id = '<user-uuid>';
```

---

## Project Structure

```
└── 📁simpleblogtutorial
    └── 📁public
        └── next.svg                      # Static assets
    └── 📁src
        └── 📁app                         # Next.js App Router root
            └── 📁admin                   # Protected admin section
                └── 📁posts
                    └── 📁[slug]
                        └── 📁edit
                            └── page.tsx  # Edit existing post
                    └── 📁new
                        └── page.tsx      # Create new post
                ├── layout.tsx            # Admin layout (auth guard)
                └── page.tsx              # Admin dashboard
            └── 📁login
                └── page.tsx              # Login page
            └── 📁posts
                └── 📁[slug]
                    └── page.tsx          # Public post detail page
            ├── globals.css               # Global styles (Tailwind)
            ├── layout.tsx                # Root layout (fonts, metadata)
            └── page.tsx                  # Homepage / post listing
        └── 📁components
            ├── footer.tsx                # Site footer
            ├── markdown.tsx              # Renders post markdown content
            ├── post-form.tsx             # Shared create/edit post form
            └── post-list.tsx             # Renders list of post cards
        └── 📁hooks
            ├── use-md-shortcuts.ts       # Keyboard shortcuts for markdown editor
            └── usePosts.ts               # Fetches and manages posts state
        └── 📁lib
            └── cache-posts.ts            # Server-side post caching logic
        └── 📁supabase
            └── client.ts                 # Supabase client initialization
        └── 📁types
            └── posts.ts                  # Post TypeScript types/interfaces
    ├── .env.example                      # Required env vars (Supabase URL, anon key)
    ├── .gitignore
    ├── next.config.ts                    # Next.js configuration
    ├── package.json                      # Dependencies and scripts
    ├── README.md                         # Project documentation
    └── tsconfig.json                     # TypeScript configuration
```

---

## License

MIT
