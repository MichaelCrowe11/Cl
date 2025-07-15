# 🧪 AI IDE Features Testing Guide

## Quick Test Checklist

### 1. **Basic IDE Setup** ✅
- [ ] Open https://www.croweos.com/ide
- [ ] Verify file explorer loads on left
- [ ] Verify AI Assistant panel appears on right
- [ ] Check Monaco editor renders properly

### 2. **AI Assistant Integration** 
- [ ] Click on any file in explorer
- [ ] AI panel should show context-aware greeting
- [ ] Try typing in AI chat input
- [ ] Verify messages appear in chat history

### 3. **Code Selection Features**
- [ ] Open a Python file (.py) or create new file
- [ ] Add some sample code
- [ ] Select a portion of code
- [ ] Use quick action buttons (Analyze, Explain, Debug, Optimize)
- [ ] Verify AI responds with relevant analysis

### 4. **File Context Awareness**
- [ ] Switch between different file types
- [ ] Notice AI greeting changes based on file type
- [ ] Ask questions about the current file
- [ ] Verify AI understands file contents

## Sample Test Code

### Python Test
```python
def calculate_growth_rate(initial_weight, final_weight, days):
    daily_rate = (final_weight - initial_weight) / days
    return daily_rate

# Test mycology calculation
mushroom_growth = calculate_growth_rate(0.5, 15.2, 7)
print(f"Daily growth rate: {mushroom_growth}g/day")
```

### Test Questions to Ask AI
1. "Analyze this code for potential improvements"
2. "Explain how this function works"
3. "Help me debug this calculation"
4. "Optimize this code for better performance"
5. "Generate a test function for this code"

## Expected AI Responses

### ✅ Should Work
- Code analysis and suggestions
- Line-by-line code explanations
- Bug detection and fixes
- Performance optimization tips
- Generated test cases
- Mycology-specific recommendations

### ⚠️ If Issues
- Check browser console for errors
- Verify API key is configured
- Ensure stable internet connection
- Try refreshing the page

## Production URLs
- **Main IDE**: https://www.croweos.com/ide
- **Professional IDE**: https://www.croweos.com/ide-pro
- **Platform Dashboard**: https://www.croweos.com/platform

---

🎯 **Success Criteria**: AI assistant provides helpful, context-aware responses to code-related questions and can analyze, explain, debug, and optimize code effectively.
