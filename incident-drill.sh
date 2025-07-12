#!/bin/bash

# Incident Response Drill Script
# Simulates 502 error and measures MTTR (Mean Time To Recovery)

set -e

START_TIME=$(date +%s)
echo "🚨 INCIDENT RESPONSE DRILL INITIATED"
echo "Timestamp: $(date)"
echo "Target MTTR: ≤ 15 minutes"
echo ""

# Simulate 502 error by temporarily breaking API
echo "💥 Simulating 502 error..."
BACKUP_FILE="/tmp/route_backup_$(date +%s).ts"

if [ -f "app/api/ai/route.ts" ]; then
    # Backup original
    cp app/api/ai/route.ts "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
    
    # Inject 502 error
    cat > app/api/ai/route.ts << 'EOF'
export async function POST() {
  return new Response('Bad Gateway', { status: 502 });
}
EOF
    echo "💥 502 error injected into /api/ai"
    
    # Build and check
    echo "🔍 Verifying error condition..."
    npm run build > /dev/null 2>&1 || echo "⚠️  Build may fail due to error injection"
    
    echo ""
    echo "🔴 INCIDENT DETECTED:"
    echo "   - API endpoint returning 502"
    echo "   - Service degraded"
    echo "   - Timer started: $(date)"
    echo ""
    
    echo "⏱️  Response actions:"
    echo "   1. Acknowledge incident"
    echo "   2. Assess impact"
    echo "   3. Implement fix"
    echo "   4. Verify recovery"
    echo ""
    
    read -p "Press ENTER to begin recovery..." -r
    
    echo "🔧 Initiating recovery..."
    
    # Restore original file
    cp "$BACKUP_FILE" app/api/ai/route.ts
    echo "✅ Original service restored"
    
    # Verify recovery
    echo "🔍 Verifying recovery..."
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Build successful - service restored"
    else
        echo "❌ Build failed - recovery incomplete"
    fi
    
    # Calculate MTTR
    END_TIME=$(date +%s)
    MTTR_SECONDS=$((END_TIME - START_TIME))
    MTTR_MINUTES=$((MTTR_SECONDS / 60))
    
    echo ""
    echo "📊 INCIDENT RESPONSE METRICS:"
    echo "   Start time: $(date -d @$START_TIME)"
    echo "   End time: $(date -d @$END_TIME)"
    echo "   MTTR: ${MTTR_MINUTES}m ${MTTR_SECONDS}s"
    
    if [ $MTTR_MINUTES -le 15 ]; then
        echo "   ✅ TARGET MET: MTTR ≤ 15 minutes"
        echo "   🎯 DRILL PASSED"
    else
        echo "   ❌ TARGET MISSED: MTTR > 15 minutes"
        echo "   📈 IMPROVEMENT NEEDED"
    fi
    
    # Cleanup
    rm -f "$BACKUP_FILE"
    echo "   🧹 Cleanup complete"
    
else
    echo "❌ API route file not found. Drill cannot proceed."
    exit 1
fi

echo ""
echo "✅ INCIDENT RESPONSE DRILL COMPLETE"
echo "📝 Document lessons learned and update runbooks"
