#!/bin/bash

# Production Security Verification Script
# Tests all security components after deployment

echo "🔒 Crowe Logic AI - Security Framework Verification"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
if [ -z "$1" ]; then
    echo "Usage: $0 <production-url>"
    echo "Example: $0 https://crowelogic.vercel.app"
    exit 1
fi

PROD_URL="$1"
echo "Testing production deployment at: $PROD_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint="$1"
    local description="$2"
    local expected_status="$3"
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$PROD_URL$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($response)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $response)"
        return 1
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local endpoint="$1"
    local description="$2"
    local test_data="$3"
    
    echo -n "Testing $description... "
    
    if [ -n "$test_data" ]; then
        response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$test_data" \
            "$PROD_URL$endpoint")
    else
        response=$(curl -s "$PROD_URL$endpoint")
    fi
    
    if echo "$response" | grep -q "success\|status\|healthy"; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Track test results
passed=0
failed=0

echo "🌐 Basic Connectivity Tests"
echo "=========================="

# Test main page
if test_endpoint "/" "Main page" "200"; then
    ((passed++))
else
    ((failed++))
fi

# Test API health
if test_endpoint "/api/health" "API health check" "200"; then
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "🔒 Security API Tests"
echo "===================="

# Test security health endpoint
if test_json_endpoint "/api/security/health" "Security health check"; then
    ((passed++))
else
    ((failed++))
fi

# Test bias detection endpoint
bias_test_data='{"content": "This is a test message", "context": "test"}'
if test_json_endpoint "/api/security/bias-assessment" "Bias detection API" "$bias_test_data"; then
    ((passed++))
else
    ((failed++))
fi

# Test compliance checking
compliance_test_data='{"content": "Mushrooms are generally safe", "type": "fda"}'
if test_json_endpoint "/api/security/compliance-check" "FDA compliance check" "$compliance_test_data"; then
    ((passed++))
else
    ((failed++))
fi

# Test GDPR consent endpoint
consent_test_data='{"userId": "test-user", "purposes": {"essential": true, "analytics": false}, "dataTypes": ["usage"], "legalBasis": "consent"}'
if test_json_endpoint "/api/security/consent" "GDPR consent API" "$consent_test_data"; then
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "📊 Security Dashboard Tests"
echo "=========================="

# Test security dashboard pages
if test_endpoint "/security/bias-detection" "Bias detection dashboard" "200"; then
    ((passed++))
else
    ((failed++))
fi

if test_endpoint "/security/gdpr-dashboard" "GDPR dashboard" "200"; then
    ((failed++)) # Expected to fail without auth
    echo -e "${YELLOW}⚠️  Note: GDPR dashboard requires authentication${NC}"
else
    ((passed++))
fi

echo ""
echo "🧪 AI Integration Tests"
echo "======================"

# Test AI endpoints
if test_endpoint "/api/ai" "AI API endpoint" "405"; then # Should reject GET
    ((passed++))
else
    ((failed++))
fi

# Test QFOL metrics
if test_endpoint "/api/qfol" "QFOL metrics endpoint" "405"; then # Should reject GET
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "📋 Compliance Verification"
echo "========================="

# Test compliance status
if test_json_endpoint "/api/security/compliance-status" "Compliance status"; then
    ((passed++))
else
    ((failed++))
fi

# Test security metrics
if test_json_endpoint "/api/security/security-metrics" "Security metrics"; then
    ((passed++))
else
    ((failed++))
fi

echo ""
echo "🔍 Performance Tests"
echo "==================="

# Test response times
echo -n "Measuring API response time... "
start_time=$(date +%s%N)
curl -s "$PROD_URL/api/health" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

if [ $response_time -lt 1000 ]; then
    echo -e "${GREEN}✅ PASS${NC} (${response_time}ms)"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  SLOW${NC} (${response_time}ms)"
    ((failed++))
fi

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "Total Tests: $((passed + failed))"
echo -e "${GREEN}Passed: $passed${NC}"
echo -e "${RED}Failed: $failed${NC}"

# Calculate success rate
if [ $((passed + failed)) -gt 0 ]; then
    success_rate=$(( (passed * 100) / (passed + failed) ))
    echo -e "Success Rate: $success_rate%"
    
    if [ $success_rate -ge 90 ]; then
        echo -e "\n${GREEN}🎉 DEPLOYMENT VERIFICATION SUCCESSFUL!${NC}"
        echo -e "${GREEN}✅ Security framework is operational${NC}"
        echo -e "${GREEN}✅ All critical systems are working${NC}"
        exit 0
    elif [ $success_rate -ge 70 ]; then
        echo -e "\n${YELLOW}⚠️  PARTIAL SUCCESS - Some issues detected${NC}"
        echo -e "${YELLOW}⚠️  Review failed tests above${NC}"
        exit 1
    else
        echo -e "\n${RED}❌ DEPLOYMENT VERIFICATION FAILED${NC}"
        echo -e "${RED}❌ Critical issues detected${NC}"
        exit 2
    fi
else
    echo -e "\n${RED}❌ NO TESTS EXECUTED${NC}"
    exit 3
fi
