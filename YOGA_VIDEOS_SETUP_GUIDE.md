# Yoga Videos Setup Guide

## Issue: No Videos Showing

If you can't see any videos on the page, it's likely because:
1. The `yoga_vids` bucket doesn't exist yet
2. The bucket exists but is empty (no videos uploaded)
3. The bucket exists but is not public

## Solution: Create and Configure the Bucket

### Step 1: Create the Bucket in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**
4. Name it exactly: `yoga_vids`
5. Check **Make public** (important for videos to be accessible)
6. Click **Create bucket**

### Step 2: Upload Videos

1. Click on the `yoga_vids` bucket you just created
2. Click **Upload file** button
3. Upload your video files (any format: .mp4, .mov, .webm, etc.)
4. Your videos will appear immediately

### Step 3: Verify It Works

1. Go to your dashboard → Yoga Videos tab
2. You should now see your uploaded videos
3. Click "Start Now!!!" to play a video

## File Naming (Optional but Recommended)

For better organization, name your files like:
- `beginner-morning-sun-salutation.mp4`
- `intermediate-diabetes-therapeutic.mp4`
- `advanced-evening-meditation.mp4`

**Or use any format:**
- `video-1.mov` ✅ Works fine
- `my-video.mp4` ✅ Works fine  
- `morning-flow.mov` ✅ Works fine

The component will automatically:
- Extract difficulty from filename (or default to "beginner")
- Extract category (or default to "general")
- Format the title nicely

## Troubleshooting

### Check Browser Console

Open browser DevTools (F12) → Console tab, you should see:
```
Attempting to fetch videos from yoga_vids bucket...
Files from bucket: [...]
Found X files in bucket
```

### Common Errors

**"yoga_vids bucket does not exist"**
- Solution: Create the bucket as described above

**"Permission denied"**
- Solution: Make the bucket public (checked when creating)

**"No videos found"**
- Solution: Upload at least one video file to the bucket

## Testing

After setting up, test with a simple video:
1. Upload any test video to `yoga_vids` bucket
2. Name it anything: `test-video.mp4`
3. Refresh the Yoga Videos page
4. You should see "Test Video" card with "Start Now!!!" button
5. Click to play - video should open in full-screen modal

