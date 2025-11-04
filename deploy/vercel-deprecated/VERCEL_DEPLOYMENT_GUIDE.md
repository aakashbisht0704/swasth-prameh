# Vercel Deployment Guide for SwasthPrameh

This guide explains how to deploy your Next.js application with the LLM server on Vercel.

## Overview

Your application consists of two main components:
1. **Next.js Frontend/API**: Main application with dashboard, onboarding, etc.
2. **LLM Server**: Express server handling AI chat and plan generation (`src/llm/server.ts`)

## Prerequisites

1. Vercel account
2. GitHub repository with your code
3. Environment variables ready

## Environment Variables Setup

### Required Environment Variables

Set these in your Vercel project settings:

```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Custom port (defaults to 8002)
PORT=8002
```

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate value
4. Make sure to set them for **Production**, **Preview**, and **Development** environments

## Deployment Configuration

The `vercel.json` file has been configured to:

1. **Build Next.js**: Uses `@vercel/next` builder
2. **Build LLM Server**: Uses `@vercel/node` builder for the Express server
3. **Route Configuration**: 
   - `/api/llm/*` routes go to the LLM server
   - All other routes go to Next.js
4. **Function Settings**: LLM server has 30-second timeout

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `.` (root)
   - Build Command: `npm run vercel-build`
   - Output Directory: `.next`

3. **Set Environment Variables**:
   - Add all required environment variables in project settings

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy both services

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add GROQ_API_KEY
   vercel env add GROQ_MODEL
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

## URL Structure After Deployment

After deployment, your services will be available at:

- **Main Application**: `https://your-project.vercel.app/`
- **LLM Server Endpoints**:
  - `https://your-project.vercel.app/api/llm/chat`
  - `https://your-project.vercel.app/api/llm/generate-plan`

## Testing Your Deployment

1. **Test Main App**:
   ```bash
   curl https://your-project.vercel.app/
   ```

2. **Test LLM Chat**:
   ```bash
   curl -X POST https://your-project.vercel.app/api/llm/chat \
     -H "Content-Type: application/json" \
     -d '{"user_id": "test", "messages": [{"role": "user", "content": "Hello"}]}'
   ```

3. **Test Plan Generation**:
   ```bash
   curl -X POST https://your-project.vercel.app/api/llm/generate-plan \
     -H "Content-Type: application/json" \
     -d '{"user_id": "test", "context": {"prakriti": "vata"}}'
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation works locally
   - Check Vercel build logs for specific errors

2. **Environment Variables**:
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no extra spaces or quotes

3. **LLM Server Not Responding**:
   - Check function timeout settings
   - Verify Groq API key is valid
   - Check server logs in Vercel dashboard

4. **CORS Issues**:
   - The LLM server has CORS enabled for all origins
   - If issues persist, check your frontend API calls

### Debugging

1. **View Logs**:
   - Go to Vercel dashboard → Functions tab
   - Click on your LLM server function
   - View real-time logs

2. **Local Testing**:
   ```bash
   # Test LLM server locally
   npm run llm-server
   
   # Test Next.js app
   npm run dev
   ```

## Performance Considerations

1. **Function Timeout**: LLM server is set to 30 seconds max
2. **Cold Starts**: First request may be slower due to serverless cold starts
3. **Concurrent Requests**: Vercel handles multiple requests automatically

## Security Notes

1. **API Keys**: Never commit API keys to your repository
2. **Environment Variables**: Use Vercel's secure environment variable system
3. **CORS**: Currently set to allow all origins - consider restricting in production

## Next Steps

After successful deployment:

1. Test all functionality thoroughly
2. Set up custom domain if needed
3. Configure monitoring and alerts
4. Set up CI/CD for automatic deployments

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Test locally first to isolate issues
4. Check environment variable configuration
