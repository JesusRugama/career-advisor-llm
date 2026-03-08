#!/bin/bash

# Install all service dependencies for local development
# This script consolidates dependencies from all services

set -e

echo "📦 Installing Career Advisor Backend Dependencies..."
echo ""

# Check if virtual environment is activated
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "⚠️  Warning: No virtual environment detected."
    echo "   Recommended: Create and activate a venv first:"
    echo "   python -m venv .venv && source .venv/bin/activate"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Installing dependencies from all services..."
echo ""

# Install from each service's requirements.txt
services=(
    "services/users-service"
    "services/conversations-service"
    "services/prompts-service"
    "services/llm-service"
)

for service in "${services[@]}"; do
    if [ -f "$service/requirements.txt" ]; then
        echo "📥 Installing $service dependencies..."
        pip install -q -r "$service/requirements.txt"
    else
        echo "⚠️  Warning: $service/requirements.txt not found, skipping..."
    fi
done

# Install additional dev tools if needed
echo ""
echo "📥 Installing development tools..."
pip install -q fastapi-cli mangum

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Copy env.example to .env and configure"
echo "  2. Run database migrations (see START_HERE.md)"
echo "  3. Start the API: fastapi dev main.py"
