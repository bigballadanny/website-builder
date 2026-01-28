#!/bin/bash
# Test the PM generation API

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing PM Website Builder Generation..."
echo ""

# Check if server is running
if ! curl -s http://localhost:5173/ > /dev/null 2>&1 && ! curl -s http://localhost:5174/ > /dev/null 2>&1; then
    echo -e "${RED}❌ Dev server not running. Start with: pnpm dev${NC}"
    exit 1
fi

# Determine port
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    PORT=5173
else
    PORT=5174
fi

echo "📡 Server running on port $PORT"
echo ""

# Test generation endpoint
echo "🔄 Testing generation API..."
RESPONSE=$(curl -s -X POST "http://localhost:$PORT/api/pm-generate" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "landing-page",
    "brandInfo": {
      "businessName": "FreshPlate Meals",
      "businessDescription": "We deliver pre-portioned meal kits with 15-minute recipes to busy professionals.",
      "idealCustomer": "Busy professionals aged 25-45 who want to eat healthy but don'\''t have time.",
      "problemSolved": "We eliminate dinner stress and save 5-10 hours per week on meal planning.",
      "transformation": "They feel healthier, have more energy, and enjoy cooking without the stress.",
      "callToAction": "Get Your First Week 50% Off"
    }
  }')

# Check if response contains HTML
if echo "$RESPONSE" | grep -q "html"; then
    echo -e "${GREEN}✅ Generation API working!${NC}"
    
    # Save the output
    echo "$RESPONSE" | jq -r '.html' > /tmp/generated-page.html 2>/dev/null
    if [ -f /tmp/generated-page.html ]; then
        echo "📄 Saved generated HTML to /tmp/generated-page.html"
        echo "   Open in browser: open /tmp/generated-page.html"
    fi
else
    echo -e "${RED}❌ Generation failed${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
