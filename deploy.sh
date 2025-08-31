#!/bin/bash

# Quantum Video Downloader - GitHub Pages Deployment Script
# This script helps deploy the application to GitHub Pages

echo "🚀 Quantum Video Downloader - GitHub Pages Deployment"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin https://github.com/yourusername/Video_Downloader.git"
    exit 1
fi

# Check if we have the required files
echo "📁 Checking required files..."

required_files=("index.html" "static/css/style.css" "static/js/particles.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files found"

# Get current branch
current_branch=$(git branch --show-current)
echo "🌿 Current branch: $current_branch"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

# Get remote URL
remote_url=$(git config --get remote.origin.url)
if [ -z "$remote_url" ]; then
    echo "❌ No remote repository configured. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/Video_Downloader.git"
    exit 1
fi

echo "🔗 Remote repository: $remote_url"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin $current_branch

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Go to your GitHub repository: $remote_url"
    echo "2. Click 'Settings' tab"
    echo "3. Scroll down to 'Pages' section"
    echo "4. Under 'Source', select 'Deploy from a branch'"
    echo "5. Choose '$current_branch' branch and '/(root)' folder"
    echo "6. Click 'Save'"
    echo ""
    echo "🌐 Your site will be available at:"
    echo "   https://yourusername.github.io/Video_Downloader/"
    echo ""
    echo "⚠️  Note: This will run in demo mode (no actual downloads)"
    echo "   For full functionality, run locally with: python3 app.py"
else
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo ""
echo "📚 For detailed instructions, see: GITHUB_PAGES_SETUP.md"
