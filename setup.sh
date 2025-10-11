#!/bin/bash

# Job OS Setup Script
# This script helps you set up Job OS for development or production

set -e

echo "🚀 Job OS Setup Script"
echo "======================"
echo

# Function to print colored output
print_success() {
    echo -e "\033[32m✓ $1\033[0m"
}

print_error() {
    echo -e "\033[31m✗ $1\033[0m"
}

print_info() {
    echo -e "\033[34mℹ $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠ $1\033[0m"
}

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "package.json" ]; then
    print_error "Please run this script from the Job OS project directory"
    exit 1
fi

print_info "Setting up Job OS project..."
echo

# Create necessary directories if they don't exist
print_info "Creating project structure..."
mkdir -p assets/images/screenshots
mkdir -p assets/icons
mkdir -p docs/screenshots
mkdir -p backup
print_success "Project structure created"

# Check for Node.js (optional)
if command -v node >/dev/null 2>&1; then
    print_success "Node.js found: $(node --version)"
    
    # Install development dependencies if package.json exists
    if [ -f "package.json" ] && command -v npm >/dev/null 2>&1; then
        print_info "Installing npm dependencies..."
        npm install --only=dev 2>/dev/null || true
        print_success "Dependencies installed"
    fi
else
    print_warning "Node.js not found. This is optional for static hosting."
fi

# Check for Python (for local server)
if command -v python3 >/dev/null 2>&1; then
    print_success "Python 3 found: $(python3 --version)"
elif command -v python >/dev/null 2>&1; then
    print_success "Python found: $(python --version)"
else
    print_warning "Python not found. You won't be able to use the local development server."
fi

# Check for Git
if command -v git >/dev/null 2>&1; then
    print_success "Git found: $(git --version)"
    
    # Initialize git repo if not already initialized
    if [ ! -d ".git" ]; then
        print_info "Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: Job OS setup" >/dev/null 2>&1 || true
        print_success "Git repository initialized"
    fi
else
    print_warning "Git not found. Version control is recommended."
fi

echo
print_info "Validating project files..."

# Check required files
required_files=("index.html" "README.md" "package.json" "LICENSE")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file found"
    else
        print_error "$file missing"
    fi
done

# Check Firebase configuration
if grep -q "AIzaSyDpjQmxmNFH_jF74HdwVcsf5xJHR-fKsWM" index.html; then
    print_warning "Using default Firebase config. Please update with your project details!"
    echo "   Update the userProvidedConfig object in index.html"
else
    print_success "Firebase configuration appears to be customized"
fi

echo
print_info "Setup complete! Next steps:"
echo
echo "1. 🔥 Set up Firebase:"
echo "   - Go to https://console.firebase.google.com"
echo "   - Create a new project"
echo "   - Enable Authentication (Anonymous)"
echo "   - Enable Firestore Database"
echo "   - Enable Cloud Storage"
echo "   - Update Firebase config in index.html"
echo
echo "2. 🌐 Test locally:"
echo "   - Run: python3 -m http.server 8000"
echo "   - Or: npm start"
echo "   - Open: http://localhost:8000"
echo
echo "3. 🚀 Deploy:"
echo "   - Netlify: Drag & drop project folder"
echo "   - Vercel: Connect GitHub repository"
echo "   - Firebase Hosting: firebase deploy"
echo "   - GitHub Pages: Push to GitHub and enable Pages"
echo
echo "4. 📖 Documentation:"
echo "   - User Guide: docs/user-guide.md"
echo "   - Deployment Guide: docs/deployment-guide.md"
echo

print_success "Job OS is ready! Happy job hunting! 🎯"