#!/usr/bin/env bash
# =================================================================
# Anvexaa AI - Push All Code & Data to GitHub
# =================================================================

echo "======================================================"
echo "🚀 Uploading Anvexaa AI Code & Data to GitHub..."
echo "======================================================"

# 1. Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing local git repository..."
    git init
    git branch -M main
fi

# 2. Add all files
echo "📂 Adding all project files (main.py, bulk.py, numbers.csv, etc.)..."
git add .

# 3. Commit
echo "📝 Creating commit..."
git commit -m "Anvexaa AI WhatsApp Auto-Bot, Bulk Sender & Contacts" || echo "Already committed."

# 4. Ask for GitHub Remote URL if not set
REMOTE_EXISTS=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_EXISTS" ]; then
    echo ""
    echo "Enter your GitHub Repository URL (e.g. https://github.com/username/anvexaa-bot.git):"
    read -p "GitHub Repo URL: " REPO_URL
    
    if [ -n "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
    else
        echo "❌ No URL entered. Aborting push."
        exit 1
    fi
else
    echo "🔗 Found existing remote: $REMOTE_EXISTS"
fi

# 5. Push to GitHub
echo "🚀 Pushing to GitHub (main branch)..."
git branch -M main
git push -u origin main

echo ""
echo "✅ All code and data uploaded successfully to GitHub!"
echo "======================================================"
