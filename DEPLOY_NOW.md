# Quick Deployment Commands

## 🚀 Step 1: Commit & Push (Local)

```bash
git add .
git commit -m "Fix RLS recursion, add email column, integrate Investigation into Prakriti"
git push origin main
```

## 🗄️ Step 2: Run SQL Fix (Supabase Dashboard - DO THIS FIRST!)

**CRITICAL:** Run this BEFORE deploying code!

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy and paste the contents of `sql/fix-user-profiles-rls-recursion.sql`
3. Click **Run**
4. Wait 10-30 seconds for schema cache to update

## 📦 Step 3: Deploy Code (Server)

SSH into your server and run:

```bash
cd /root/swasth-prameh
git pull origin main
docker compose build --no-cache web && docker compose up -d
docker compose logs -f web
```

## ✅ Step 4: Verify

1. **Test Login:**
   - Sign in with email
   - Should work without errors

2. **Test Onboarding:**
   - Go through onboarding
   - Investigation should appear before Prakriti questions
   - Complete both sections
   - Verify data saves

## 🐛 If Issues

Check logs:
```bash
docker compose logs web | tail -50
```

Check database:
```sql
-- Verify email column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'email';

-- Verify policies
SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles';
```

