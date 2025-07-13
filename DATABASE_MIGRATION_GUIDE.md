# 🗄️ Database Migration Guide

## Overview

This guide walks you through applying the complete database schema for the Crowe Logic AI platform.

## 📋 Migration Files

1. **001_initial_schema.sql** - Base tables (profiles, chat_sessions, chat_messages)
2. **002_complete_schema.sql** - Complete schema with ML jobs, file uploads, projects, and more
3. **003_realtime_tables.sql** - Real-time collaboration tables (notifications, collaboration sessions)

## 🚀 How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   ```
   https://app.supabase.com
   ```

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Apply Migrations in Order**
   - First, copy and paste contents of `001_initial_schema.sql`
   - Click "Run" 
   - Then, copy and paste contents of `002_complete_schema.sql`
   - Click "Run"

4. **Verify Tables Created**
   - Go to "Table Editor" in sidebar
   - You should see all these tables:
     - profiles
     - chat_sessions
     - chat_messages
     - ml_jobs
     - file_uploads
     - workspace_files
     - projects
     - research_data
     - activity_log

### Option 2: Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login and Link Project**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Apply Migrations**
   ```bash
   supabase db push
   ```

### Option 3: Direct SQL Connection

1. **Get Connection String**
   - Go to Settings → Database in Supabase
   - Copy the connection string

2. **Use psql or Any PostgreSQL Client**
   ```bash
   psql "YOUR_CONNECTION_STRING" -f supabase/migrations/001_initial_schema.sql
   psql "YOUR_CONNECTION_STRING" -f supabase/migrations/002_complete_schema.sql
   ```

## 🔍 Verify Migration Success

Run this query to check all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- activity_log
- chat_messages
- chat_sessions
- collaboration_participants
- collaboration_sessions
- file_uploads
- ml_jobs
- notifications
- profiles
- projects
- research_data
- shared_documents
- workspace_files

## 🛡️ Verify RLS Policies

Check that Row Level Security is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

## 📦 Storage Buckets

The migration creates three storage buckets:
- `uploads` - General file uploads
- `vision-analysis` - Images for ML vision analysis
- `workspace` - IDE workspace files

Verify in Dashboard → Storage.

## 🚨 Troubleshooting

### "uuid-ossp extension not found"
Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### "storage schema does not exist"
This means storage isn't enabled. Enable it in Dashboard → Settings → Storage.

### "permission denied"
Make sure you're using the service role key for migrations, not the anon key.

## 📊 Sample Data

To add sample data for testing:

```sql
-- Sample project
INSERT INTO public.projects (user_id, name, description, type)
VALUES (auth.uid(), 'Oyster Mushroom Research', 'Optimizing substrate for Pleurotus ostreatus', 'research');

-- Sample ML job
INSERT INTO public.ml_jobs (user_id, service, status, parameters, result)
VALUES (
  auth.uid(), 
  'yield-prediction', 
  'completed',
  '{"species": "oyster", "substrate_weight": 10, "temperature": 22, "humidity": 85, "co2_level": 800}'::jsonb,
  '{"predicted_yield_kg": 2.5, "efficiency_percent": 85, "harvest_date": "2025-01-20"}'::jsonb
);
```

## ✅ Migration Complete!

Your database is now ready for the Crowe Logic AI platform with:
- User authentication and profiles
- Chat session management
- ML job tracking
- File upload management
- Project organization
- Research data storage
- Activity logging
- Full RLS security 