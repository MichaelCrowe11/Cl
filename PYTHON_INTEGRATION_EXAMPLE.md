# Python Integration Example for Crowe Logic AI

This guide shows how to integrate Python-based Anthropic calls with your Next.js platform.

## Python Script Example

Create a file `crowe_logic_ai.py`:

```python
import anthropic
import json
import os
from typing import Dict, Any, Optional

class CroweLogicAI:
    """Crowe Logic AI - Expert in Mycology, Environmental Intelligence & Business Strategy"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = anthropic.Anthropic(
            api_key=api_key or os.environ.get("ANTHROPIC_API_KEY")
        )
        
        self.system_prompt = """You are Crowe Logic AI, an expert AI in mycology, environmental intelligence and business strategy.
        
        Your expertise includes:
        - Fungal cultivation techniques and optimization
        - Environmental systems and ecological intelligence
        - Business strategy for sustainable operations
        - Mycelium network behaviors and applications
        - Biotechnology and bioremediation
        - Mycelium Ecological Intelligence (MEI) platform architecture
        - Quantum-augmented environmental modeling
        - Distributed biome intelligence networks
        
        You provide detailed, scientifically accurate, and actionable insights."""
    
    def analyze_mei_platform(self, platform_data: Dict[str, Any], thinking_budget: int = 25000) -> str:
        """Analyze MEI platform configuration with thinking mode"""
        
        message = self.client.messages.create(
            model="claude-3-opus-20240229",  # Current model
            max_tokens=8192,
            temperature=0.8,
            system=self.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(platform_data, indent=2)
                        }
                    ]
                }
            ],
            # Note: thinking mode will be available in future API versions
            # thinking={
            #     "type": "enabled",
            #     "budget_tokens": thinking_budget
            # }
        )
        
        return message.content[0].text
    
    def mycology_consultation(self, query: str, context: Optional[Dict] = None) -> str:
        """Provide mycology expertise"""
        
        mycology_prompt = self.system_prompt + """
        
        Focus on providing practical, actionable advice for mycology cultivation.
        Include specific parameters, timelines, and success metrics where applicable."""
        
        messages = [{"role": "user", "content": query}]
        
        if context:
            messages[0]["content"] = f"Context: {json.dumps(context)}\n\nQuery: {query}"
        
        message = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4096,
            temperature=0.6,
            system=mycology_prompt,
            messages=messages
        )
        
        return message.content[0].text

# Example usage
if __name__ == "__main__":
    # Initialize Crowe Logic AI
    crowe_ai = CroweLogicAI()
    
    # Example 1: Analyze MEI Platform
    mei_platform = {
        "platform": "Mycelium Ecological Intelligence (MEI)",
        "version": "2.0",
        "core_modules": {
            "WeatherHub": {
                "description": "Real-time meteorological integration",
                "features": ["API ingestion", "anomaly detection"]
            },
            "EcoMesh": {
                "description": "Ecological system pattern recognition",
                "features": ["biodiversity tracking", "species migration"]
            }
        }
    }
    
    analysis = crowe_ai.analyze_mei_platform(mei_platform)
    print("MEI Platform Analysis:", analysis)
    
    # Example 2: Mycology Consultation
    cultivation_query = "How can I optimize Lion's Mane cultivation in a 1000 sq ft facility?"
    
    advice = crowe_ai.mycology_consultation(
        cultivation_query,
        context={"location": "Pacific Northwest", "budget": "$50,000"}
    )
    print("Cultivation Advice:", advice)
```

## Integration with Next.js

### Option 1: Python API Server

Create a FastAPI server (`api_server.py`):

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crowe_logic_ai import CroweLogicAI
import uvicorn

app = FastAPI()
crowe_ai = CroweLogicAI()

class QueryRequest(BaseModel):
    query: str
    context: dict = None
    mode: str = "general"  # general, mycology, environmental, business

@app.post("/api/crowe-logic-ai")
async def process_query(request: QueryRequest):
    try:
        if request.mode == "mycology":
            response = crowe_ai.mycology_consultation(request.query, request.context)
        else:
            response = crowe_ai.analyze_mei_platform({"query": request.query})
        
        return {"response": response, "mode": request.mode}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Option 2: Direct Integration via Edge Function

Create `app/api/python-ai/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: NextRequest) {
  const { query, mode = 'general' } = await request.json()
  
  return new Promise((resolve) => {
    const python = spawn('python', [
      '-c',
      `
import sys
sys.path.append('./python')
from crowe_logic_ai import CroweLogicAI

ai = CroweLogicAI()
result = ai.mycology_consultation("${query}")
print(result)
      `
    ])
    
    let output = ''
    python.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    python.on('close', () => {
      resolve(NextResponse.json({ response: output }))
    })
  })
}
```

### Option 3: Use Anthropic SDK in TypeScript

The platform already includes TypeScript integration in `lib/anthropic-client.ts`.

## Environment Setup

1. Install Python dependencies:
```bash
pip install anthropic fastapi uvicorn
```

2. Set environment variable:
```bash
export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

3. Run the Python API server:
```bash
python api_server.py
```

## Benefits of Python Integration

1. **Direct SDK Usage**: Use Anthropic's official Python SDK
2. **Thinking Mode Ready**: Prepared for future thinking mode features
3. **Flexible Architecture**: Can run as separate service or integrated
4. **Scientific Computing**: Easy integration with NumPy, Pandas for analysis
5. **ML Pipeline**: Connect with TensorFlow/PyTorch for custom models

## Next Steps

1. Choose your integration method
2. Set up the Python environment
3. Configure API endpoints
4. Test with sample queries
5. Deploy alongside Next.js app

The Crowe Logic AI system is now ready to provide expert insights across mycology, environmental intelligence, and business strategy domains. 