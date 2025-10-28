# Fix Chat Database Errors

## Problem
You're seeing empty error objects `{}` when:
1. Fetching messages in ChatWidget
2. Inserting messages in Assistant page

This indicates the `chat_messages` table either doesn't exist or has missing columns.

## Solution

### Step 1: Fix the chat_messages table
Run the SQL script in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `sql/chat-messages-fix.sql`
5. Click "Run" or press `Ctrl+Enter`

**Note:** This will drop and recreate the table, so any existing chat messages will be lost.

### Step 2: Verify the table was created
Run this query to verify:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;
```

You should see columns:
- id (uuid)
- user_id (uuid)
- admin_id (uuid)
- message (text)
- sender_type (text)
- is_read (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### Step 3: Test the assistant page again
1. Go to `/dashboard`
2. Click "Get AI Recommendations"
3. The chat should now save messages without errors

## What was fixed in the code:
- ✅ Added `userId` prop to `ChatWidget` in dashboard
- ✅ Added detailed error logging in assistant page
- ✅ Added database connection test
- ✅ Made `ChatWidget` conditional on user existence

## If you still see errors:
Check the console for detailed error information. The enhanced logging will show:
- error.code
- error.message
- error.details
- error.hint

This will help identify any remaining issues.

