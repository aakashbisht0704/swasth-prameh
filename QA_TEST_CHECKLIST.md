# Support Chat System - QA Test Checklist

## Setup & Prerequisites
- [ ] Database migration executed successfully
- [ ] At least one admin user created
- [ ] At least one support user created
- [ ] Realtime enabled in Supabase for `support_chats` and `support_messages`
- [ ] Environment variables configured

## User Flow Tests

### Chat Creation
- [ ] User can click chat bubble icon
- [ ] Chat automatically creates on first click
- [ ] Chat widget opens and displays correctly
- [ ] User can send initial message
- [ ] Message appears immediately (optimistic update)
- [ ] Message persists after refresh

### Message Sending
- [ ] User can type and send messages
- [ ] Enter key sends message
- [ ] Send button works
- [ ] Empty messages cannot be sent
- [ ] Messages appear in correct order (oldest first)
- [ ] Auto-scroll to latest message works
- [ ] Loading state shows while sending

### Realtime Updates
- [ ] New messages appear without refresh
- [ ] Unread count updates in realtime
- [ ] Chat list updates when new chat created
- [ ] Multiple browser tabs stay in sync

### Chat Widget UI
- [ ] Chat bubble icon shows unread badge
- [ ] Widget can be minimized
- [ ] Widget can be closed
- [ ] Widget reopens with correct chat
- [ ] Messages display with correct styling
- [ ] User messages on right, support on left
- [ ] Timestamps display correctly
- [ ] Read receipts show for user messages

## Support/Admin Flow Tests

### Admin Panel Access
- [ ] Admin can access `/admin` route
- [ ] Non-admin users redirected from `/admin`
- [ ] Unauthenticated users redirected to `/auth`

### Chat Management
- [ ] Admin can view all chats
- [ ] Admin can filter chats by status
- [ ] Admin can see unread counts
- [ ] Admin can assign chat to support agent
- [ ] Assignment updates in realtime
- [ ] Support agent receives notification (toast)

### Message Management
- [ ] Support can reply to user messages
- [ ] Admin can delete messages (soft delete)
- [ ] Deleted messages don't appear in chat
- [ ] Deleted messages logged in activity log

### User Management
- [ ] Admin can view all users
- [ ] Admin can search users
- [ ] Admin can filter users by role
- [ ] Admin can change user roles
- [ ] Role changes persist
- [ ] Role changes logged in activity log

### Activity Log
- [ ] Activity log shows all actions
- [ ] Actions include user information
- [ ] Actions include timestamps
- [ ] Actions include metadata
- [ ] Log is paginated (500 entries)

## Security Tests

### Access Control
- [ ] User cannot access another user's chat
- [ ] User cannot view admin panel
- [ ] User cannot change roles
- [ ] User cannot delete support messages
- [ ] Support can access all chats
- [ ] Admin can access all chats
- [ ] RLS policies enforce correctly

### Rate Limiting
- [ ] User cannot send more than 10 messages/minute
- [ ] Rate limit error message displays
- [ ] Rate limit resets after 1 minute

### Data Validation
- [ ] Empty messages rejected
- [ ] Invalid chat IDs return 404
- [ ] Invalid user IDs return 403
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

## Performance Tests

### Loading States
- [ ] Loading indicators show during fetch
- [ ] No flickering on data load
- [ ] Smooth scrolling performance

### Pagination
- [ ] Messages paginated (50 per page)
- [ ] Chat list paginated (20 per page)
- [ ] Load more works correctly

### Realtime Performance
- [ ] No lag in message delivery
- [ ] Multiple simultaneous messages handled
- [ ] Subscriptions cleaned up on unmount

## Edge Cases

### Error Handling
- [ ] Network errors handled gracefully
- [ ] API errors show user-friendly messages
- [ ] Realtime connection failures handled
- [ ] Optimistic updates rollback on error

### Empty States
- [ ] Empty chat list shows message
- [ ] Empty message list shows message
- [ ] No users found shows message

### Concurrent Actions
- [ ] Multiple tabs handle correctly
- [ ] Simultaneous message sends work
- [ ] Chat assignment race conditions handled

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive

## Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Focus management correct
- [ ] Color contrast sufficient

## Integration Tests

### With Existing Features
- [ ] Chat widget doesn't interfere with other UI
- [ ] Chat works on all pages
- [ ] Chat persists across page navigation
- [ ] Chat doesn't break existing features

## Manual Test Script

1. **As Regular User:**
   ```
   1. Sign in
   2. Click chat bubble
   3. Send 3 messages
   4. Close chat
   5. Reopen chat
   6. Verify messages still there
   ```

2. **As Support Agent:**
   ```
   1. Sign in as support
   2. Go to /admin
   3. View unassigned chats
   4. Assign chat to yourself
   5. Reply to user
   6. Verify user receives message
   ```

3. **As Admin:**
   ```
   1. Sign in as admin
   2. Go to /admin
   3. Change a user's role
   4. View activity log
   5. Delete a message
   6. Verify all actions logged
   ```

## Known Issues / Limitations

- File attachments not yet implemented
- Email notifications not yet implemented
- Message editing not yet implemented
- Chat search not yet implemented

## Performance Benchmarks

- Chat widget load: < 500ms
- Message send: < 200ms (optimistic)
- Realtime delivery: < 1s
- Admin panel load: < 1s

