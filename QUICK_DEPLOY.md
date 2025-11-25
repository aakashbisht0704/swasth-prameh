# Quick Deployment Guide

## 🚀 Fast Track Deployment

### 1. Database Setup (5 minutes)

**In Supabase Dashboard:**

1. **SQL Editor** → Run `sql/create-support-system.sql`
2. **SQL Editor** → Run `sql/add-investigation-column.sql`
3. **Database** → **Replication** → Enable for:
   - `support_chats`
   - `support_messages`
4. **SQL Editor** → Create admin:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 2. Code Deployment (2 minutes)

**Option A: GitHub Actions (Automatic)**
```bash
git add .
git commit -m "Deploy support system and investigation step"
git push origin main
# GitHub Actions will deploy automatically
```

**Option B: Manual (SSH to Server)**
```bash
ssh user@your-server
cd /path/to/swasth-prameh
git pull origin main
docker compose down
docker compose build --no-cache web
docker compose up -d
docker compose logs -f web
```

### 3. Verify (2 minutes)

1. Visit `https://swasthprameh.com`
2. Sign in → Check chat bubble appears
3. Click chat → Send test message
4. Sign in as admin → Go to `/admin`
5. Verify all tabs work

## ✅ Done!

Total time: ~10 minutes

## 🐛 If Something Breaks

```bash
# Check logs
docker compose logs web | tail -50

# Restart
docker compose restart web

# Rollback (if needed)
git checkout HEAD~1
docker compose build --no-cache web
docker compose up -d web
```

