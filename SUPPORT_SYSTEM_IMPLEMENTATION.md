# Support Chat System Implementation

## Overview
A complete support chat system has been implemented with realtime capabilities, admin panel, and role-based access control.

## Database Schema

### Migration Files
1. **`sql/create-support-system.sql`** - Complete schema with:
   - `user_profiles` table with role column
   - `support_chats` table
   - `support_messages` table with moderation support
   - `support_attachments` table
   - `support_activity_log` table
   - RLS policies for all tables
   - Triggers for automatic unread count updates
   - Indexes for performance

2. **`sql/seed-admin-user.sql`** - Instructions for creating admin users

## API Endpoints

All endpoints require authentication via Bearer token.

### User Endpoints
- `POST /api/support/create` - Create a new support chat
- `GET /api/support/user-chats` - List user's chats (with pagination)
- `GET /api/support/[chatId]` - Get chat with messages
- `POST /api/support/[chatId]/message` - Send a message
- `PATCH /api/support/[chatId]/read` - Mark messages as read

### Admin/Support Endpoints
- `GET /api/support/unassigned` - List unassigned chats
- `POST /api/support/assign` - Assign chat to support agent
- `DELETE /api/support/message/[messageId]` - Delete message (soft delete)

## Frontend Components

### Chat Widget
- **`src/components/support/ChatBubble.tsx`** - Main floating chat widget
  - Collapsible/expandable
  - Unread badge indicator
  - Auto-creates chat on first use
  - Realtime message updates

- **`src/components/support/ChatMessage.tsx`** - Individual message component
  - Role-based styling (user/support/admin/system)
  - Read receipts
  - Timestamps

- **`src/components/support/SupportChatProvider.tsx`** - Provider wrapper
  - Only shows for authenticated users
  - Added to root layout

### React Hooks
- **`src/hooks/useSupportChats.ts`** - Manage chat list with realtime
- **`src/hooks/useSupportMessages.ts`** - Manage messages with realtime
- **`src/hooks/useAssignChat.ts`** - Assign chat to support agent

## Admin Panel

### Pages
- **`src/app/admin/page.tsx`** - Main admin dashboard
  - Protected route (admin only)
  - Tabs for Chats, Users, Activity Log

### Components (To be created)
- **`src/components/admin/ChatsDashboard.tsx`** - Chat management
- **`src/components/admin/UsersList.tsx`** - User management
- **`src/components/admin/ActivityLog.tsx`** - Activity log viewer

## TypeScript Types

**`src/types/support.ts`** - Complete type definitions for:
- UserProfile
- SupportChat
- SupportMessage
- SupportAttachment
- SupportActivityLog
- Request/Response types

## Features Implemented

### ✅ Core Features
- [x] Database schema with RLS
- [x] API endpoints (all CRUD operations)
- [x] Realtime subscriptions (Supabase Realtime)
- [x] Chat widget (floating, collapsible)
- [x] Message sending with optimistic updates
- [x] Unread count tracking
- [x] Role-based access control
- [x] Soft delete for messages
- [x] Activity logging
- [x] Rate limiting (10 messages/minute)

### ✅ Security
- [x] RLS policies on all tables
- [x] Server-side role checks
- [x] Authentication required for all endpoints
- [x] Users can only access their own chats
- [x] Support/admin can access all chats

### ✅ UX Features
- [x] Optimistic UI updates
- [x] Auto-scroll to latest message
- [x] Unread badge on chat icon
- [x] Loading states
- [x] Error handling
- [x] Keyboard shortcuts (Enter to send)

## Remaining Work

### Admin Panel Components
Need to create:
1. **ChatsDashboard** - List all chats, filter, assign, view messages
2. **UsersList** - List users, change roles, view profiles
3. **ActivityLog** - View activity log with filters

### Additional Features
- [ ] File attachments (UI + storage)
- [ ] Message editing
- [ ] Message flagging UI
- [ ] Email notifications
- [ ] Chat search
- [ ] Message reactions

## Setup Instructions

### 1. Run Database Migration
```sql
-- Execute in Supabase SQL Editor
-- File: sql/create-support-system.sql
```

### 2. Create Admin User
```sql
-- After creating a user via Supabase Auth UI
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### 3. Environment Variables
Ensure these are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Enable Realtime
In Supabase Dashboard:
- Go to Database → Replication
- Enable replication for:
  - `support_chats`
  - `support_messages`

## Testing Checklist

### User Flow
- [ ] Sign in as regular user
- [ ] Click chat bubble icon
- [ ] Chat auto-creates
- [ ] Send messages
- [ ] Verify messages appear in realtime
- [ ] Close and reopen chat
- [ ] Verify unread count updates

### Support Flow
- [ ] Sign in as support/admin
- [ ] Go to `/admin`
- [ ] View unassigned chats
- [ ] Assign chat to yourself
- [ ] Reply to user
- [ ] Verify user receives message in realtime

### Admin Flow
- [ ] Sign in as admin
- [ ] View all chats
- [ ] Assign chat to support agent
- [ ] Delete a message
- [ ] View activity log
- [ ] Change user role

### Security Tests
- [ ] User cannot access another user's chat
- [ ] User cannot delete support messages
- [ ] Support can access all chats
- [ ] Admin can change user roles
- [ ] Rate limiting works (10 msg/min)

## Performance Considerations

- Messages paginated (50 per page)
- Indexes on frequently queried columns
- Realtime subscriptions cleaned up on unmount
- Optimistic updates for better UX
- Unread count calculated efficiently via triggers

## Privacy & Compliance

- Messages stored with soft delete (retention policy: 1 year)
- Activity log for audit trail
- No sensitive PHI should be stored in chat messages
- RLS ensures data isolation between users

## Next Steps

1. Create admin panel components (ChatsDashboard, UsersList, ActivityLog)
2. Add file attachment support
3. Implement email notifications
4. Add message search functionality
5. Create support agent dashboard
6. Add analytics and reporting

