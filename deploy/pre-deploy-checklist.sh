#!/bin/bash

# Pre-Deployment Checklist Script
# Run this before deploying to verify everything is ready

set -e

echo "🔍 Pre-Deployment Checklist"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Are you in the project root?"
    exit 1
fi

echo "✅ Project directory found"
echo ""

# Check for required SQL files
echo "📄 Checking SQL migration files..."
if [ -f "sql/create-support-system.sql" ]; then
    echo "  ✅ sql/create-support-system.sql"
else
    echo "  ❌ sql/create-support-system.sql missing"
    exit 1
fi

if [ -f "sql/add-investigation-column.sql" ]; then
    echo "  ✅ sql/add-investigation-column.sql"
else
    echo "  ❌ sql/add-investigation-column.sql missing"
    exit 1
fi

echo ""

# Check for required environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    echo "  ✅ .env file exists"
    
    # Check critical variables
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "GROQ_API_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env 2>/dev/null; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo "  ✅ All required variables present"
    else
        echo "  ⚠️  Missing variables:"
        for var in "${missing_vars[@]}"; do
            echo "     - $var"
        done
    fi
else
    echo "  ⚠️  .env file not found (will use environment or docker-compose env_file)"
fi

echo ""

# Check for new files
echo "📦 Checking for new components..."
new_files=(
    "src/components/support/ChatBubble.tsx"
    "src/components/support/ChatMessage.tsx"
    "src/components/admin/ChatsDashboard.tsx"
    "src/app/api/support/create/route.ts"
    "src/types/support.ts"
)

missing_files=()
for file in "${new_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "  ✅ All new components present"
else
    echo "  ⚠️  Missing files:"
    for file in "${missing_files[@]}"; do
        echo "     - $file"
    fi
fi

echo ""

# Check Docker setup
echo "🐳 Checking Docker setup..."
if command -v docker &> /dev/null; then
    echo "  ✅ Docker installed"
    
    if docker compose version &> /dev/null; then
        echo "  ✅ Docker Compose available"
    else
        echo "  ❌ Docker Compose not available"
        exit 1
    fi
else
    echo "  ❌ Docker not installed"
    exit 1
fi

echo ""

# Check Git status
echo "📝 Checking Git status..."
if [ -d ".git" ]; then
    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️  Uncommitted changes detected"
        echo "     Consider committing before deployment"
    else
        echo "  ✅ Working directory clean"
    fi
    
    current_branch=$(git branch --show-current)
    echo "  📌 Current branch: $current_branch"
    
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        echo "  ⚠️  Not on main/master branch"
    fi
else
    echo "  ⚠️  Not a git repository"
fi

echo ""
echo "============================"
echo "✅ Pre-deployment check complete"
echo ""
echo "📋 Next Steps:"
echo "1. Run database migrations in Supabase Dashboard"
echo "2. Enable Realtime in Supabase"
echo "3. Create admin user"
echo "4. Deploy code (git push or manual deployment)"
echo ""

