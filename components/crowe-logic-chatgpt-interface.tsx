"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { CroweLogo } from "@/components/crowe-logo"
import { 
  Send, 
  Loader2, 
  Moon, 
  Sun, 
  Settings, 
  Plus,
  MessageSquare,
  Brain,
  Code2,
  FlaskConical,
  Microscope,
  Upload,
  RotateCcw,
  Share,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'analysis'
  metadata?: {
    confidence?: number
    tags?: string[]
  }
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastUpdate: Date
}

export default function CroweLogicChatGPTInterface() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Mycology Research Assistant',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m Crowe Logic AI, your advanced mycology research assistant. I specialize in mushroom identification, cultivation protocols, contamination analysis, and bioactivity research. I can help you with:\n\n• **Species Identification** - Analyze specimen characteristics\n• **Cultivation Protocols** - Optimize growing conditions\n• **Contamination Analysis** - Detect and prevent contamination\n• **Data Analysis** - Process research data and generate insights\n• **Code Development** - Python scripts for mycology research\n\nHow can I assist your mycology work today?',
          timestamp: new Date(),
          type: 'text'
        }
      ],
      lastUpdate: new Date()
    }
  ])
  
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  const activeConversation = conversations.find(c => c.id === activeConversationId)
  const messages = activeConversation?.messages || []
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    }

    // Add user message
    updateConversation(activeConversationId, [...messages, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
        type: determineResponseType(userMessage.content),
        metadata: {
          confidence: 0.95,
          tags: extractTags(userMessage.content)
        }
      }

      updateConversation(activeConversationId, [...messages, userMessage, aiResponse])
      
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to get response from Crowe Logic AI",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateConversation = (id: string, newMessages: Message[]) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id 
        ? { ...conv, messages: newMessages, lastUpdate: new Date() }
        : conv
    ))
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('contamination') || lowerInput.includes('contam')) {
      return `I can help you with contamination analysis! Here's a systematic approach:

**Common Contamination Types:**
• **Trichoderma** (green mold) - Fast-growing, bright green
• **Penicillium** (blue-green mold) - Blue-green color, musty odor
• **Aspergillus** (black mold) - Black spores, dangerous
• **Bacterial** - Slimy, foul smell, various colors

**Prevention Protocol:**
1. **Sterilization** - Autoclave at 121°C for 15+ minutes
2. **Sterile Technique** - Work in still air box or flow hood
3. **Environment Control** - Monitor temperature and humidity
4. **Regular Inspection** - Check cultures every 24-48 hours

**Detection Methods:**
\`\`\`python
def detect_contamination(image_path):
    # AI vision analysis for contamination detection
    import cv2
    import numpy as np
    
    image = cv2.imread(image_path)
    # Color analysis for typical contaminant colors
    green_mask = cv2.inRange(image, (0, 100, 0), (100, 255, 100))
    contamination_ratio = np.sum(green_mask) / image.size
    
    return contamination_ratio > 0.05  # 5% threshold
\`\`\`

Would you like me to help you analyze a specific contamination case or set up a monitoring protocol?`
    }
    
    if (lowerInput.includes('identify') || lowerInput.includes('species')) {
      return `I'll help you with mushroom identification! Here's my systematic approach:

**Key Identification Features:**
• **Cap characteristics** - Size, shape, color, texture
• **Gill structure** - Attachment, spacing, color
• **Stem features** - Length, thickness, ring presence
• **Spore print** - Critical for accurate ID
• **Habitat** - Growing substrate and environment

**Identification Protocol:**
1. **Visual Documentation** - Photograph all angles
2. **Spore Print** - Place cap gill-side down on paper
3. **Microscopy** - Examine spore shape and size
4. **Chemical Tests** - KOH, Melzer's reagent if needed
5. **Cross-reference** - Multiple field guides and databases

**Python Analysis Tool:**
\`\`\`python
class MushroomIdentifier:
    def __init__(self):
        self.features = {}
        
    def analyze_features(self, specimen_data):
        score = 0
        # Cap analysis
        if specimen_data['cap_color'] in ['white', 'cream']:
            score += 20
        # Gill analysis  
        if specimen_data['gill_attachment'] == 'free':
            score += 15
        # Habitat matching
        if specimen_data['substrate'] == 'deciduous_wood':
            score += 25
            
        return {
            'confidence': score / 100,
            'likely_species': self.match_species(score),
            'suggestions': self.get_suggestions(specimen_data)
        }
\`\`\`

Please describe your specimen or upload photos for detailed analysis!`
    }
    
    if (lowerInput.includes('cultivation') || lowerInput.includes('growing') || lowerInput.includes('grow')) {
      return `I'll guide you through professional mushroom cultivation! Here's my comprehensive approach:

**Cultivation Phases:**
1. **Substrate Preparation** - Sterilized growing medium
2. **Inoculation** - Introduce mushroom spawn/spores  
3. **Incubation** - Mycelial growth phase
4. **Fruiting** - Mushroom development
5. **Harvesting** - Optimal timing for quality

**Environmental Parameters:**
• **Temperature**: Species-specific (usually 65-75°F)
• **Humidity**: 80-95% during fruiting
• **Air Exchange**: 1-3 exchanges per hour
• **Light**: Indirect, 12-hour cycles for fruiting

**Monitoring Code:**
\`\`\`python
class CultivationMonitor:
    def __init__(self):
        self.optimal_ranges = {
            'temperature': (18, 24),  # Celsius
            'humidity': (80, 95),     # Percentage
            'co2': (800, 1200)       # PPM
        }
    
    def check_conditions(self, current_readings):
        alerts = []
        for param, (min_val, max_val) in self.optimal_ranges.items():
            value = current_readings.get(param, 0)
            if value < min_val or value > max_val:
                alerts.append(f"{param} out of range: {value}")
        return alerts
        
    def log_growth_data(self, day, measurements):
        with open('cultivation_log.csv', 'a') as f:
            f.write(f"{day},{measurements['size']},{measurements['weight']}\\n")
\`\`\`

What species are you planning to cultivate? I can provide specific protocols!`
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('python') || lowerInput.includes('script')) {
      return `I'm here to help with your mycology coding projects! Here are some useful tools:

**Data Collection & Analysis:**
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

class MycologyDataAnalyzer:
    def __init__(self):
        self.data = pd.DataFrame()
        
    def load_growth_data(self, csv_file):
        self.data = pd.read_csv(csv_file)
        return self.data.head()
        
    def analyze_growth_rate(self):
        growth_rate = self.data['size'].diff().mean()
        success_rate = len(self.data[self.data['contaminated'] == False]) / len(self.data)
        
        return {
            'avg_daily_growth': growth_rate,
            'success_rate': success_rate * 100,
            'total_batches': len(self.data)
        }
        
    def plot_growth_curve(self):
        plt.figure(figsize=(10, 6))
        plt.plot(self.data['day'], self.data['size'])
        plt.xlabel('Days')
        plt.ylabel('Size (cm)')
        plt.title('Mushroom Growth Curve')
        plt.show()
\`\`\`

**Environmental Monitoring:**
\`\`\`python
class EnvironmentController:
    def __init__(self, sensor_pins):
        self.sensors = sensor_pins
        self.alerts = []
        
    def read_sensors(self):
        return {
            'temperature': self.read_temperature(),
            'humidity': self.read_humidity(),
            'co2': self.read_co2()
        }
        
    def automated_control(self, readings):
        if readings['humidity'] < 80:
            self.activate_humidifier()
        if readings['temperature'] > 25:
            self.activate_cooling()
\`\`\`

What specific coding challenge can I help you solve?`
    }
    
    return `Thank you for your question! As Crowe Logic AI, I'm specialized in mycology research and can assist with:

🔬 **Research & Analysis**
• Species identification and taxonomy
• Growth pattern analysis and optimization
• Contamination detection and prevention
• Bioactivity and compound research

💻 **Technical Support**  
• Python scripting for data analysis
• Lab automation and monitoring systems
• Database design for research data
• Statistical analysis and visualization

🧪 **Laboratory Protocols**
• Sterilization and aseptic techniques
• Culture maintenance and storage
• Experimental design and controls
• Quality assurance procedures

📊 **Data Management**
• Research data organization
• Batch tracking and documentation
• Performance metrics and KPIs
• Report generation and insights

How can I specifically help with your mycology project today?`
  }

  const determineResponseType = (input: string): 'text' | 'code' | 'analysis' => {
    if (input.toLowerCase().includes('code') || input.toLowerCase().includes('script')) {
      return 'code'
    }
    if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('data')) {
      return 'analysis'
    }
    return 'text'
  }

  const extractTags = (input: string): string[] => {
    const tags = []
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('contamination')) tags.push('contamination')
    if (lowerInput.includes('identification')) tags.push('identification')
    if (lowerInput.includes('cultivation')) tags.push('cultivation')
    if (lowerInput.includes('code')) tags.push('programming')
    if (lowerInput.includes('analysis')) tags.push('data-analysis')
    
    return tags
  }

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Conversation',
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: 'Hello! I\'m Crowe Logic AI, ready to assist with your mycology research. What would you like to explore today?',
          timestamp: new Date(),
          type: 'text'
        }
      ],
      lastUpdate: new Date()
    }
    
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully"
    })
  }

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-80 border-r bg-card flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CroweLogo variant="official-circle" size={32} />
                <div>
                  <div className="font-bold text-lg">CroweOS</div>
                  <div className="text-xs text-muted-foreground">Mycology AI</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            
            <Button onClick={createNewConversation} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
          
          {/* Conversations List */}
          <ScrollArea className="flex-1 custom-scrollbar">
            <div className="p-2 space-y-2">
              {conversations.map((conv) => (
                <Card 
                  key={conv.id}
                  className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                    activeConversationId === conv.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setActiveConversationId(conv.id)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{conv.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {conv.messages.length} messages
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {conv.lastUpdate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-8 w-8">
              <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Crowe Logic AI</div>
              <div className="text-xs text-muted-foreground">
                Mycology Research Assistant
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-12' 
                        : 'bg-muted'
                    }`}>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {message.content}
                        </pre>
                      </div>
                      
                      {message.metadata?.tags && (
                        <div className="flex gap-1 mt-3">
                          {message.metadata.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Crowe Logic AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Crowe Logic AI about mycology research, cultivation, contamination, data analysis..."
                    className="pr-12 py-3 text-base"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <div className="text-xs text-muted-foreground text-center max-w-2xl">
                  Crowe Logic AI can make mistakes. Please verify important information and research findings.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
