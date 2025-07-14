"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const [input, setInput] = useState<string>('')
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Input Test Page</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Test Input:</label>
          <Input
            value={input}
            onChange={(e) => {
              console.log('Input change:', e.target.value);
              setInput(e.target.value);
            }}
            placeholder="Type something here..."
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">Current value: &ldquo;{input}&rdquo;</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Basic HTML Input:</label>
          <input
            type="text"
            placeholder="Direct HTML input..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={(e) => console.log('HTML input:', e.target.value)}
          />
        </div>
        
        <Button onClick={() => setInput('')}>
          Clear Input
        </Button>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-medium">Debug Info:</h3>
          <p>Input state: {JSON.stringify(input)}</p>
          <p>Input length: {input.length}</p>
        </div>
      </div>
    </div>
  )
}
