# Deployment Checklist - Support System & Investigation Step

## 🗄️ Step 1: Database Migrations (CRITICAL - Do First!)

### 1.1 Run Support System Migration
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open and execute: `sql/create-support-system.sql`
3. Verify all tables created:
   - `user_profiles` (with role column)
   - `support_chats`
   - `support_messages`
   - `support_attachments`
   - `support_activity_log`
4. Check RLS policies are enabled
5. Verify indexes are created

### 1.2 Run Investigation Migration
1. In **Supabase SQL Editor**
2. Execute: `sql/add-investigation-column.sql`
3. Verify `onboarding.investigation` JSONB column exists

### 1.3 Enable Realtime (REQUIRED for Support Chat)
1. Go to **Supabase Dashboard** → **Database** → **Replication**
2. Enable replication for:
   - ✅ `support_chats`
   - ✅ `support_messages`
3. Click **Save**

### 1.4 Create Admin User
1. Sign up a user via your app (or Supabase Auth UI)
2. In **Supabase SQL Editor**, run:
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```
3. Verify the role was updated:
   ```sql
   SELECT id, email, role FROM user_profiles WHERE role = 'admin';
   ```

## 📦 Step 2: Code Deployment

### Option A: Automated Deployment (GitHub Actions)

If you have GitHub Actions set up:

1. **Commit and push all changes:**
   ```bash
   git add .
   git commit -m "Add support chat system and investigation step"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Trigger deployment workflow
   - Pull latest code
   - Rebuild Docker containers
   - Restart services

3. **Monitor deployment:**
   - Go to GitHub → Actions tab
   - Watch the deployment workflow
   - Check for any errors

### Option B: Manual Deployment (SSH to Server)

1. **SSH into your VPS:**
   ```bash
   ssh root@your-server-ip
   # or
   ssh user@your-server-ip
   ```

2. **Navigate to project directory:**
   ```bash
   cd /root/swasth-prameh
   # or
   cd /home/$USER/swasthprameh
   ```

3. **Pull latest code:**
   ```bash
   git pull origin main
   ```

4. **Run database migrations (if not done via Supabase UI):**
   ```bash
   # Note: Usually done via Supabase Dashboard, but if you have psql access:
   # psql -h your-supabase-host -U postgres -d postgres -f sql/create-support-system.sql
   ```

5. **Rebuild and restart containers:**
   ```bash
   # Stop containers
   docker compose down

   # Rebuild (this will include new code)
   docker compose build --no-cache web && docker compose up -d && docker compose ps && docker compose logs -f web

   # Start containers
   docker compose up -d

   # Check status
   docker compose ps

   # View logs
   docker compose logs -f web
   ```

### Option C: Using Deploy Script

If you have the deploy script:

```bash
cd /root/swasth-prameh
./deploy.sh
```

Or:
```bash
cd /home/$USER/swasthprameh
bash deploy/deploy.sh
```

## ✅ Step 3: Post-Deployment Verification

### 3.1 Verify Application is Running
```bash
# Check container status
docker compose ps

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:8002/health

# Check website
curl -I https://swasthprameh.com
```

### 3.2 Test Support Chat System

1. **As Regular User:**
   - Sign in to the app
   - Look for chat bubble icon (bottom-right)
   - Click to open chat
   - Send a test message
   - Verify message appears

2. **As Admin:**
   - Sign in with admin account
   - Go to `/admin`
   - Verify you can see:
     - Chats tab
     - Users tab
     - Activity Log tab
   - Assign a chat to yourself
   - Reply to user
   - Verify user receives message

3. **Test Realtime:**
   - Open chat in two browser windows
   - Send message from one
   - Verify it appears in the other without refresh

### 3.3 Test Investigation Step

1. **Complete Onboarding:**
   - Sign in as new user
   - Go through onboarding
   - Verify Investigation step appears after Prakriti
   - Complete all Investigation steps
   - Verify data saves to `onboarding.investigation`

2. **Check Dashboard:**
   - Go to dashboard
   - Verify Lifestyle section shows investigation data
   - Check AI summary includes investigation context

### 3.4 Check Logs for Errors

```bash
# Web container logs
docker compose logs web | tail -100

# ML container logs
docker compose logs ml | tail -100

# Check for errors
docker compose logs web | grep -i error
docker compose logs ml | grep -i error
```

## 🔧 Step 4: Environment Variables Check

Verify these are set in your `.env` file on the server:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LLM Server
LLM_SERVER_URL=http://ml:8002
NEXT_PUBLIC_LLM_SERVER_URL=http://ml:8002

# Groq
GROQ_API_KEY=your-groq-key
GROQ_MODEL=llama-3.1-8b-instant

# Site URL
NEXT_PUBLIC_SITE_URL=https://swasthprameh.com
```

## 🐛 Troubleshooting

### Support Chat Not Showing
- ✅ Check user is authenticated
- ✅ Verify `SupportChatProvider` in layout
- ✅ Check browser console for errors
- ✅ Verify Realtime is enabled in Supabase

### Admin Panel Access Denied
- ✅ Verify user role is 'admin' in `user_profiles`
- ✅ Check RLS policies
- ✅ Verify authentication token

### Investigation Step Not Appearing
- ✅ Verify migration ran successfully
- ✅ Check `onboarding.investigation` column exists
- ✅ Clear browser cache
- ✅ Check browser console for errors

### Realtime Not Working
- ✅ Verify Realtime enabled in Supabase Dashboard
- ✅ Check network tab for WebSocket connection
- ✅ Verify RLS policies allow access
- ✅ Check Supabase Realtime logs

### Database Errors
- ✅ Verify all migrations ran
- ✅ Check RLS policies are correct
- ✅ Verify foreign key constraints
- ✅ Check Supabase logs

## 📊 Quick Health Check Script

Create and run this on your server:

```bash
#!/bin/bash
echo "🔍 Health Check"
echo "=============="

# Check containers
echo "📦 Containers:"
docker compose ps

# Check health endpoints
echo ""
echo "🏥 Health Endpoints:"
curl -s http://localhost:3000/api/health && echo " ✅ Web" || echo " ❌ Web"
curl -s http://localhost:8002/health && echo " ✅ ML" || echo " ❌ ML"

# Check website
echo ""
echo "🌐 Website:"
curl -sI https://swasthprameh.com | head -1

echo ""
echo "✅ Health check complete"
```

## 🎯 Deployment Order Summary

1. ✅ **Database Migrations** (Supabase Dashboard)
   - Run `sql/create-support-system.sql`
   - Run `sql/add-investigation-column.sql`
   - Enable Realtime
   - Create admin user

2. ✅ **Code Deployment** (Server)
   - Pull latest code
   - Rebuild containers
   - Restart services

3. ✅ **Verification** (Testing)
   - Test support chat
   - Test investigation step
   - Test admin panel
   - Check logs

## 📝 Notes

- **Database migrations must run BEFORE code deployment**
- **Realtime must be enabled for support chat to work**
- **Admin user must be created before testing admin panel**
- **All environment variables must be set correctly**
- **Allow 5-10 minutes for Supabase changes to propagate**

## 🚨 Rollback Plan

If something goes wrong:

```bash
# Rollback to previous version
cd /root/swasth-prameh
git checkout HEAD~1
docker compose build --no-cache web
docker compose up -d web
```

Or restore from backup:
```bash
# If you have backups
docker compose down
# Restore database from backup
docker compose up -d
```

