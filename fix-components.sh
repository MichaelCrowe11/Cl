#!/bin/bash

# Crowe Logic - Component Export Validator & Fixer
echo "🔧 Crowe Logic Component Validator"
echo "================================="

# Check and fix component exports
echo "🧩 Validating Component Exports..."

# CroweLogo Component Check
if [ ! -f "components/crowe-logo.tsx" ]; then
    echo "❌ CroweLogo component missing"
    exit 1
fi

# Check for proper exports
echo "📋 Component Export Status:"
grep -l "export.*CroweLogo" components/crowe-logo.tsx && echo "✅ CroweLogo: Exported" || echo "❌ CroweLogo: Missing export"

# Fix common import issues
echo "🔧 Fixing Import Issues..."

# Update any broken imports in navigation
find components -name "*.tsx" -exec grep -l "from.*crowe-logo" {} \; | while read file; do
    echo "📝 Updating imports in $file"
    sed -i 's|from ".*crowe-logo"|from "./crowe-logo"|g' "$file"
done

# Verify key components exist
echo "🔍 Component Verification:"
components=(
    "components/crowe-logo.tsx"
    "components/navigation/main-nav.tsx"
    "components/navigation/navbar.tsx"
    "components/ui/sidebar.tsx"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component: EXISTS"
    else
        echo "❌ $component: MISSING"
    fi
done

echo ""
echo "🎯 Next Steps:"
echo "   1. Run: pnpm dev (for development)"
echo "   2. Run: pnpm build (for production)"
echo "   3. Check: http://localhost:3000"
echo ""
