# Support Chat System - Complete Implementation Guide

## 🎯 Overview

A complete, production-ready support chat system with:
- ✅ Realtime messaging via Supabase Realtime
- ✅ Role-based access control (user/support/admin)
- ✅ Admin panel for chat and user management
- ✅ Activity logging and moderation
- ✅ Floating chat widget (works across all pages)
- ✅ Rate limiting and security

## 📋 Quick Start

### 1. Database Setup

Run the migration in Supabase SQL Editor:
```sql
-- File: sql/create-support-system.sql
-- This creates all tables, RLS policies, indexes, and triggers
```

### 2. Enable Realtime

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Enable replication for:
   - `support_chats`
   - `support_messages`

### 3. Create Admin User

After creating a user via Supabase Auth UI:
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

Or via the app (after first admin is created):
- Go to `/admin` → Users tab
- Change user role to "admin"

### 4. Environment Variables

Ensure these are set in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🏗️ Architecture

### Database Schema

```
user_profiles (extends auth.users)
├── id (FK to auth.users)
├── role (user|support|admin)
└── profile fields

support_chats
├── id
├── user_id (FK)
├── assigned_to (FK, nullable)
├── status (open|closed|pending)
└── unread_count

support_messages
├── id
├── chat_id (FK)
├── sender_id (FK, nullable)
├── sender_role
├── message
├── is_read
├── deleted_at (soft delete)
└── flagged (moderation)

support_attachments
└── (for future file uploads)

support_activity_log
└── (audit trail)
```

### API Routes

All routes require Bearer token authentication:

- `POST /api/support/create` - Create chat
- `GET /api/support/user-chats` - List user's chats
- `GET /api/support/[chatId]` - Get chat + messages
- `POST /api/support/[chatId]/message` - Send message
- `PATCH /api/support/[chatId]/read` - Mark as read
- `GET /api/support/unassigned` - Admin: unassigned chats
- `POST /api/support/assign` - Admin: assign chat
- `DELETE /api/support/message/[messageId]` - Delete message

### Frontend Components

**Chat Widget:**
- `ChatBubble.tsx` - Floating widget
- `ChatMessage.tsx` - Message display
- `SupportChatProvider.tsx` - Wrapper (added to layout)

**Admin Panel:**
- `/admin` - Main dashboard
- `ChatsDashboard.tsx` - Chat management
- `UsersList.tsx` - User management
- `ActivityLog.tsx` - Activity viewer

**Hooks:**
- `useSupportChats.ts` - Chat list with realtime
- `useSupportMessages.ts` - Messages with realtime
- `useAssignChat.ts` - Chat assignment

## 🔒 Security Features

### Row Level Security (RLS)

- Users can only see their own chats
- Support/admin can see all chats
- Messages filtered by chat access
- Role checks on all admin actions

### Rate Limiting

- 10 messages per minute per user
- Prevents spam and abuse

### Soft Deletes

- Messages marked as deleted, not removed
- Audit trail maintained
- `deleted_at` and `deleted_by` tracked

## 🚀 Usage

### For Users

1. Click the chat bubble icon (bottom-right)
2. Chat auto-creates on first use
3. Type and send messages
4. Messages appear in realtime
5. Unread count shows on icon

### For Support Agents

1. Sign in with support/admin role
2. Go to `/admin`
3. View unassigned chats
4. Assign chat to yourself
5. Reply to users
6. Messages delivered in realtime

### For Admins

1. Access `/admin` dashboard
2. Manage all chats
3. Assign chats to support agents
4. Manage user roles
5. View activity log
6. Delete/flag messages

## 🧪 Testing

See `QA_TEST_CHECKLIST.md` for comprehensive test cases.

Quick smoke test:
1. User creates chat → sends message
2. Support assigns chat → replies
3. User receives message in realtime
4. Admin views activity log

## 📊 Features

### ✅ Implemented
- [x] Realtime messaging
- [x] Role-based access
- [x] Admin panel
- [x] Chat assignment
- [x] Unread counts
- [x] Activity logging
- [x] Soft deletes
- [x] Rate limiting
- [x] Optimistic UI updates

### 🔜 Future Enhancements
- [ ] File attachments
- [ ] Email notifications
- [ ] Message editing
- [ ] Chat search
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Chat transcripts export

## 🐛 Troubleshooting

### Chat widget not showing
- Check user is authenticated
- Verify `SupportChatProvider` in layout
- Check browser console for errors

### Realtime not working
- Verify Realtime enabled in Supabase
- Check network tab for WebSocket connection
- Ensure RLS policies allow access

### Admin panel access denied
- Verify user role is 'admin' in `user_profiles`
- Check RLS policies
- Verify authentication token

### Messages not appearing
- Check Supabase Realtime logs
- Verify chat_id matches
- Check RLS policies on `support_messages`

## 📝 Notes

- Messages retained for 1 year (configurable)
- No sensitive PHI should be stored in chats
- All actions logged for audit
- RLS ensures data isolation
- Optimistic updates for better UX

## 🔗 Related Files

- `sql/create-support-system.sql` - Database schema
- `src/types/support.ts` - TypeScript types
- `SUPPORT_SYSTEM_IMPLEMENTATION.md` - Detailed docs
- `QA_TEST_CHECKLIST.md` - Test cases

