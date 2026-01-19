#!/bin/bash
# Manual Test Script for OpenAI Streaming Functionality
# Subtask 4.3: Test streaming responses with real OpenAI API

set -e

echo "=========================================="
echo "OpenAI Streaming Functionality Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
API_URL="http://localhost:3000/ai"
PUBLIC_API_URL="http://localhost:5174"

echo "Test Configuration:"
echo "- API Endpoint: $API_URL"
echo "- Web URL: $PUBLIC_API_URL"
echo ""

# Check if servers are running
echo "1. Checking server status..."
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend server is running on port 3000"
else
    echo -e "${RED}✗${NC} Backend server is NOT running on port 3000"
    exit 1
fi

if curl -s http://localhost:5174/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend server is running on port 5174"
else
    echo -e "${RED}✗${NC} Frontend server is NOT running on port 5174"
    exit 1
fi
echo ""

# Check environment variables
echo "2. Checking environment configuration..."
if [ -n "$OPENAI_API_KEY" ]; then
    echo -e "${GREEN}✓${NC} OPENAI_API_KEY is set"
else
    if grep -q "OPENAI_API_KEY=" .env 2>/dev/null; then
        echo -e "${GREEN}✓${NC} OPENAI_API_KEY found in .env file"
    else
        echo -e "${RED}✗${NC} OPENAI_API_KEY is not configured"
        exit 1
    fi
fi

if grep -q "OPENAI_MODEL=" .env 2>/dev/null; then
    MODEL=$(grep "OPENAI_MODEL=" .env | cut -d'=' -f2)
    echo -e "${GREEN}✓${NC} OPENAI_MODEL configured: $MODEL"
else
    echo -e "${YELLOW}⚠${NC} OPENAI_MODEL not configured (will use default: gpt-4o-mini)"
fi
echo ""

# Test 1: Check AI endpoint accessibility
echo "3. Testing AI endpoint accessibility (without auth)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","parts":[{"type":"text","text":"test"}]}]}')
if [ "$RESPONSE" = "401" ]; then
    echo -e "${GREEN}✓${NC} AI endpoint returns 401 (auth required) - $RESPONSE"
else
    echo -e "${YELLOW}⚠${NC} Unexpected response code: $RESPONSE"
fi
echo ""

# Test 2: Test streaming with manual curl (requires auth cookie)
echo "4. Creating test script for streaming..."
cat > test-stream.js << 'EOF'
// Test streaming functionality with Node.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/ai',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': process.env.SESSION_COOKIE || ''
  }
};

const testData = {
  messages: [
    {
      role: 'user',
      parts: [
        {
          type: 'text',
          text: 'Say "Hello, this is a streaming test!" and count to 5.'
        }
      ]
    }
  ]
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\nStreaming response:');

  res.setEncoding('utf8');
  let chunkCount = 0;
  let fullText = '';

  res.on('data', (chunk) => {
    chunkCount++;
    process.stdout.write(chunk);
    fullText += chunk;
  });

  res.on('end', () => {
    console.log('\n\n--- Summary ---');
    console.log('Total chunks received:', chunkCount);
    console.log('Total characters:', fullText.length);

    if (chunkCount > 1) {
      console.log('✓ Streaming is working (multiple chunks received)');
    } else if (chunkCount === 1) {
      console.log('⚠ Single chunk received (may not be streaming)');
    } else {
      console.log('✗ No chunks received');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(JSON.stringify(testData));
req.end();
EOF

echo -e "${GREEN}✓${NC} Test script created"
echo ""

echo "=========================================="
echo "Manual Testing Instructions"
echo "=========================================="
echo ""
echo "To complete the manual testing, please:"
echo ""
echo "1. Open your browser and navigate to:"
echo "   ${PUBLIC_API_URL}"
echo ""
echo "2. Sign in to the application"
echo ""
echo "3. Navigate to the Chat page"
echo ""
echo "4. Select an OpenAI model from the model selector (e.g., gpt-4o-mini, gpt-4o)"
echo ""
echo "5. Send a test message: 'Tell me a short story about AI in 3 sentences'"
echo ""
echo "6. Verify the following:"
echo "   - Response starts streaming immediately (no long delay)"
echo "   - Text appears token-by-token or in small chunks"
echo "   - Streaming indicator (three dots) is visible"
echo "   - Complete message is displayed"
echo "   - No errors in browser console"
echo "   - Message is saved to database (check in chat history)"
echo ""
echo "7. Test stopping functionality:"
echo "   - Send another message"
echo "   - Click 'Stop' button while streaming"
echo "   - Verify generation stops immediately"
echo "   - Verify 'Stopped' indicator appears"
echo ""
echo "8. Test error handling:"
echo "   - Open browser DevTools > Network tab"
echo "   - Look for /ai requests"
echo "   - Verify response headers contain:"
echo "     * Content-Type: text/plain; charset=utf-8"
echo "     * Transfer-Encoding: chunked"
echo ""
echo "=========================================="
echo ""
echo "Test script saved to: test-stream.js"
echo "To run automated test (requires auth):"
echo "  SESSION_COOKIE='your-session-cookie' node test-stream.js"
echo ""
