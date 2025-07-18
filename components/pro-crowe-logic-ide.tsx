"use client";

import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { 
  Brain, 
  FileText, 
  Terminal as TerminalIcon, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  User, 
  X, 
  Plus,
  FolderOpen,
  Code,
  MessageSquare,
  Maximize2,
  Minimize2,
  Split,
  Save,
  Play,
  GitBranch,
  Database,
  Activity,
  Package,
  ChevronRight,
  ChevronLeft,
  Folder,
  Files,
  Layers,
  Bug,
  Zap,
  Eye,
  Target,
  Cpu,
  Monitor,
  GitCommit,
  Users,
  Shield,
  Rocket,
  BarChart3,
  Timer,
  TestTube,
  Microscope,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import IDEChatInterface from '@/components/ide-chat-interface';
// SVG logos will be imported directly as image sources
import { useTheme } from 'next-themes';
// import { useAIAssistant } from '@/hooks/use-ai-assistant';

interface FileTab {
  id: string;
  name: string;
  type: 'python' | 'markdown' | 'json' | 'text' | 'yaml' | 'javascript' | 'typescript';
  content: string;
  language: string;
  unsaved?: boolean;
  path?: string;
}

interface ProFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'active' | 'premium' | 'coming-soon';
  category: 'ai' | 'debug' | 'collab' | 'deploy' | 'mycology';
}

interface DebugBreakpoint {
  line: number;
  file: string;
  condition?: string;
  enabled: boolean;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
}

export default function ProCroweLogicIDE() {
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<FileTab | null>(null);
  const [activeRightPanel, setActiveRightPanel] = useState<'ai' | 'debug' | 'git' | 'performance' | 'mycology'>('ai');
  const [isProMode, setIsProMode] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [breakpoints, setBreakpoints] = useState<DebugBreakpoint[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: 'Memory Usage', value: 342, unit: 'MB', status: 'good' },
    { name: 'CPU Usage', value: 23, unit: '%', status: 'good' },
    { name: 'Response Time', value: 1.2, unit: 's', status: 'warning' },
    { name: 'Error Rate', value: 0.01, unit: '%', status: 'good' }
  ]);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  // const aiAssistant = useAIAssistant();

  // Sample files for the Pro IDE
  const [files] = useState<FileTab[]>([
    {
      id: '1',
      name: 'mycology_analysis.py',
      type: 'python',
      language: 'python',
      path: '/projects/mycology/analysis',
      content: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from scipy import stats

class MycologyAnalyzer:
    """Advanced mycology data analysis with AI-powered insights."""
    
    def __init__(self, data_source: str):
        self.data_source = data_source
        self.growth_data = None
        self.environmental_data = None
        
    def load_cultivation_data(self, batch_id: str):
        """Load cultivation data for analysis."""
        # Simulated data loading
        dates = pd.date_range(start='2025-01-01', periods=30, freq='D')
        self.growth_data = pd.DataFrame({
            'date': dates,
            'weight': np.cumsum(np.random.normal(0.5, 0.1, 30)),
            'height': np.cumsum(np.random.normal(0.3, 0.05, 30)),
            'temperature': np.random.normal(24, 2, 30),
            'humidity': np.random.normal(85, 5, 30),
            'co2_level': np.random.normal(1200, 100, 30)
        })
        return self.growth_data
    
    def calculate_growth_rate(self):
        """Calculate daily growth rate with statistical analysis."""
        if self.growth_data is None:
            raise ValueError("No data loaded. Call load_cultivation_data first.")
        
        # Calculate daily growth rates
        daily_weight_change = self.growth_data['weight'].diff()
        daily_height_change = self.growth_data['height'].diff()
        
        # Statistical analysis
        weight_stats = {
            'mean': daily_weight_change.mean(),
            'std': daily_weight_change.std(),
            'trend': stats.linregress(range(len(daily_weight_change[1:])), 
                                    daily_weight_change[1:]).slope
        }
        
        return weight_stats
    
    def environmental_correlation(self):
        """Analyze correlation between environmental factors and growth."""
        if self.growth_data is None:
            return None
            
        correlations = {
            'temp_weight': self.growth_data['temperature'].corr(self.growth_data['weight']),
            'humidity_weight': self.growth_data['humidity'].corr(self.growth_data['weight']),
            'co2_weight': self.growth_data['co2_level'].corr(self.growth_data['weight'])
        }
        
        return correlations
    
    def generate_recommendations(self):
        """AI-powered recommendations for optimization."""
        correlations = self.environmental_correlation()
        growth_stats = self.calculate_growth_rate()
        
        recommendations = []
        
        if correlations['temp_weight'] < 0.3:
            recommendations.append("Consider adjusting temperature range for better growth correlation")
        
        if growth_stats['trend'] < 0:
            recommendations.append("Growth rate is declining. Review environmental controls")
        
        if correlations['humidity_weight'] > 0.7:
            recommendations.append("Humidity shows strong positive correlation. Maintain current levels")
        
        return recommendations

# Example usage
if __name__ == "__main__":
    analyzer = MycologyAnalyzer("lab_sensor_data.csv")
    data = analyzer.load_cultivation_data("BATCH_2025_001")
    growth_rate = analyzer.calculate_growth_rate()
    recommendations = analyzer.generate_recommendations()
    
    print(f"Average daily growth rate: {growth_rate['mean']:.3f}g")
    print("AI Recommendations:")
    for rec in recommendations:
        print(f"- {rec}")
`
    },
    {
      id: '2',
      name: 'lab_automation.py',
      type: 'python',
      language: 'python',
      path: '/projects/automation',
      content: `import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class SensorReading:
    """Data class for sensor readings."""
    sensor_id: str
    timestamp: datetime
    value: float
    unit: str
    status: str = "normal"

class LabAutomationSystem:
    """Advanced lab automation with real-time monitoring."""
    
    def __init__(self, config_file: str):
        self.config = self.load_config(config_file)
        self.sensors = {}
        self.alerts = []
        self.is_running = False
        
    def load_config(self, config_file: str) -> dict:
        """Load automation configuration."""
        # In real implementation, load from file
        return {
            "sensors": {
                "temp_01": {"type": "temperature", "range": [20, 28], "critical": [18, 30]},
                "humid_01": {"type": "humidity", "range": [80, 90], "critical": [70, 95]},
                "co2_01": {"type": "co2", "range": [1000, 1500], "critical": [800, 2000]}
            },
            "controls": {
                "heater": {"gpio_pin": 18, "type": "pwm"},
                "humidifier": {"gpio_pin": 19, "type": "digital"},
                "fan": {"gpio_pin": 20, "type": "pwm"}
            },
            "monitoring_interval": 30  # seconds
        }
    
    async def read_sensor(self, sensor_id: str) -> SensorReading:
        """Read individual sensor data."""
        # Simulate sensor reading
        import random
        sensor_config = self.config["sensors"][sensor_id]
        
        if sensor_config["type"] == "temperature":
            value = random.uniform(22, 26)
        elif sensor_config["type"] == "humidity":
            value = random.uniform(82, 88)
        elif sensor_config["type"] == "co2":
            value = random.uniform(1100, 1400)
        else:
            value = 0
            
        # Check if value is within normal range
        min_val, max_val = sensor_config["range"]
        status = "normal" if min_val <= value <= max_val else "warning"
        
        # Check critical ranges
        crit_min, crit_max = sensor_config["critical"]
        if value < crit_min or value > crit_max:
            status = "critical"
            
        return SensorReading(
            sensor_id=sensor_id,
            timestamp=datetime.now(),
            value=value,
            unit=sensor_config["type"],
            status=status
        )
    
    async def monitor_sensors(self):
        """Continuous sensor monitoring loop."""
        while self.is_running:
            readings = {}
            
            for sensor_id in self.config["sensors"]:
                reading = await self.read_sensor(sensor_id)
                readings[sensor_id] = reading
                
                # Handle alerts
                if reading.status in ["warning", "critical"]:
                    await self.handle_alert(reading)
            
            # Log readings
            await self.log_readings(readings)
            
            # Wait for next reading cycle
            await asyncio.sleep(self.config["monitoring_interval"])
    
    async def handle_alert(self, reading: SensorReading):
        """Handle sensor alerts and automated responses."""
        alert = {
            "timestamp": reading.timestamp,
            "sensor": reading.sensor_id,
            "value": reading.value,
            "status": reading.status,
            "message": f"{reading.sensor_id} reading {reading.value} is {reading.status}"
        }
        
        self.alerts.append(alert)
        
        # Automated responses
        if reading.sensor_id == "temp_01":
            if reading.status == "critical":
                await self.emergency_temperature_control(reading.value)
        elif reading.sensor_id == "humid_01":
            if reading.status == "critical":
                await self.emergency_humidity_control(reading.value)
    
    async def emergency_temperature_control(self, current_temp: float):
        """Emergency temperature control actions."""
        if current_temp < 18:  # Too cold
            print(f"EMERGENCY: Temperature too low ({current_temp}°C). Activating heater.")
            # Activate heater
        elif current_temp > 30:  # Too hot
            print(f"EMERGENCY: Temperature too high ({current_temp}°C). Activating cooling.")
            # Activate cooling fan
    
    async def emergency_humidity_control(self, current_humidity: float):
        """Emergency humidity control actions."""
        if current_humidity < 70:  # Too dry
            print(f"EMERGENCY: Humidity too low ({current_humidity}%). Activating humidifier.")
            # Activate humidifier
        elif current_humidity > 95:  # Too humid
            print(f"EMERGENCY: Humidity too high ({current_humidity}%). Activating dehumidifier.")
            # Activate dehumidifier/ventilation
    
    async def log_readings(self, readings: Dict[str, SensorReading]):
        """Log sensor readings to database/file."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "readings": {
                sensor_id: {
                    "value": reading.value,
                    "status": reading.status
                } for sensor_id, reading in readings.items()
            }
        }
        
        # In real implementation, save to database
        print(f"Logged: {json.dumps(log_entry, indent=2)}")
    
    async def start_monitoring(self):
        """Start the monitoring system."""
        self.is_running = True
        print("Lab automation system started...")
        await self.monitor_sensors()
    
    def stop_monitoring(self):
        """Stop the monitoring system."""
        self.is_running = False
        print("Lab automation system stopped.")

# Example usage
async def main():
    automation = LabAutomationSystem("lab_config.json")
    
    # Start monitoring (would run indefinitely in production)
    try:
        await automation.start_monitoring()
    except KeyboardInterrupt:
        automation.stop_monitoring()
        print("Monitoring stopped by user.")

if __name__ == "__main__":
    asyncio.run(main())
`
    },
    {
      id: '3',
      name: 'batch_tracker.py',
      type: 'python',
      language: 'python',
      path: '/projects/tracking',
      content: `from datetime import datetime, timedelta
from typing import List, Dict, Optional
from enum import Enum
import uuid
import json

class BatchStatus(Enum):
    INOCULATED = "inoculated"
    COLONIZING = "colonizing"
    FRUITING = "fruiting"
    HARVESTING = "harvesting"
    COMPLETED = "completed"
    CONTAMINATED = "contaminated"

class CultivationBatch:
    """Track individual cultivation batches with detailed metrics."""
    
    def __init__(self, strain: str, substrate: str, inoculation_date: datetime):
        self.batch_id = str(uuid.uuid4())[:8]
        self.strain = strain
        self.substrate = substrate
        self.inoculation_date = inoculation_date
        self.status = BatchStatus.INOCULATED
        self.growth_log = []
        self.environmental_log = []
        self.notes = []
        self.contamination_risk = 0.0
        
    def add_growth_measurement(self, weight: float, notes: str = ""):
        """Add growth measurement to the batch."""
        measurement = {
            "timestamp": datetime.now(),
            "weight": weight,
            "days_since_inoculation": (datetime.now() - self.inoculation_date).days,
            "notes": notes
        }
        self.growth_log.append(measurement)
        
        # Update contamination risk based on growth pattern
        self._assess_contamination_risk()
    
    def add_environmental_data(self, temperature: float, humidity: float, co2: float):
        """Add environmental measurements."""
        env_data = {
            "timestamp": datetime.now(),
            "temperature": temperature,
            "humidity": humidity,
            "co2_level": co2
        }
        self.environmental_log.append(env_data)
    
    def update_status(self, new_status: BatchStatus, notes: str = ""):
        """Update batch status with timestamp and notes."""
        status_change = {
            "timestamp": datetime.now(),
            "old_status": self.status.value,
            "new_status": new_status.value,
            "notes": notes
        }
        self.notes.append(status_change)
        self.status = new_status
    
    def _assess_contamination_risk(self):
        """AI-powered contamination risk assessment."""
        if len(self.growth_log) < 2:
            return
            
        # Analyze growth pattern
        recent_weights = [log["weight"] for log in self.growth_log[-5:]]
        
        # Check for unusual weight changes
        if len(recent_weights) >= 2:
            weight_changes = [recent_weights[i] - recent_weights[i-1] 
                            for i in range(1, len(recent_weights))]
            
            # Negative growth could indicate contamination
            negative_changes = sum(1 for change in weight_changes if change < 0)
            risk_factor = negative_changes / len(weight_changes)
            
            # Environmental factors
            if self.environmental_log:
                recent_env = self.environmental_log[-1]
                temp_risk = 0.1 if recent_env["temperature"] > 28 or recent_env["temperature"] < 20 else 0
                humidity_risk = 0.1 if recent_env["humidity"] < 75 or recent_env["humidity"] > 95 else 0
                
                self.contamination_risk = min(1.0, risk_factor + temp_risk + humidity_risk)
    
    def get_growth_rate(self) -> float:
        """Calculate average daily growth rate."""
        if len(self.growth_log) < 2:
            return 0.0
            
        total_weight_gain = self.growth_log[-1]["weight"] - self.growth_log[0]["weight"]
        days_elapsed = (self.growth_log[-1]["timestamp"] - self.growth_log[0]["timestamp"]).days
        
        return total_weight_gain / max(1, days_elapsed)
    
    def get_status_summary(self) -> Dict:
        """Get comprehensive batch status summary."""
        days_since_inoculation = (datetime.now() - self.inoculation_date).days
        
        return {
            "batch_id": self.batch_id,
            "strain": self.strain,
            "substrate": self.substrate,
            "status": self.status.value,
            "days_since_inoculation": days_since_inoculation,
            "current_weight": self.growth_log[-1]["weight"] if self.growth_log else 0,
            "growth_rate": self.get_growth_rate(),
            "contamination_risk": self.contamination_risk,
            "measurements_count": len(self.growth_log),
            "last_updated": self.growth_log[-1]["timestamp"] if self.growth_log else self.inoculation_date
        }

class BatchManager:
    """Manage multiple cultivation batches."""
    
    def __init__(self):
        self.batches: Dict[str, CultivationBatch] = {}
        self.strain_templates = {
            "Oyster": {"optimal_temp": 24, "optimal_humidity": 85, "fruiting_days": 14},
            "Shiitake": {"optimal_temp": 22, "optimal_humidity": 80, "fruiting_days": 21},
            "Lions Mane": {"optimal_temp": 25, "optimal_humidity": 90, "fruiting_days": 10}
        }
    
    def create_batch(self, strain: str, substrate: str) -> str:
        """Create a new cultivation batch."""
        batch = CultivationBatch(strain, substrate, datetime.now())
        self.batches[batch.batch_id] = batch
        return batch.batch_id
    
    def get_active_batches(self) -> List[CultivationBatch]:
        """Get all active (non-completed) batches."""
        return [batch for batch in self.batches.values() 
                if batch.status not in [BatchStatus.COMPLETED, BatchStatus.CONTAMINATED]]
    
    def get_high_risk_batches(self, threshold: float = 0.3) -> List[CultivationBatch]:
        """Get batches with high contamination risk."""
        return [batch for batch in self.batches.values() 
                if batch.contamination_risk > threshold]
    
    def generate_daily_report(self) -> Dict:
        """Generate daily status report for all batches."""
        active_batches = self.get_active_batches()
        high_risk_batches = self.get_high_risk_batches()
        
        report = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "summary": {
                "total_batches": len(self.batches),
                "active_batches": len(active_batches),
                "high_risk_batches": len(high_risk_batches),
                "avg_contamination_risk": sum(b.contamination_risk for b in active_batches) / len(active_batches) if active_batches else 0
            },
            "batch_details": [batch.get_status_summary() for batch in active_batches],
            "alerts": []
        }
        
        # Add alerts for high-risk batches
        for batch in high_risk_batches:
            report["alerts"].append({
                "batch_id": batch.batch_id,
                "strain": batch.strain,
                "risk_level": batch.contamination_risk,
                "message": f"Batch {batch.batch_id} ({batch.strain}) shows elevated contamination risk"
            })
        
        return report
    
    def export_batch_data(self, batch_id: str) -> str:
        """Export batch data as JSON."""
        if batch_id not in self.batches:
            raise ValueError(f"Batch {batch_id} not found")
        
        batch = self.batches[batch_id]
        export_data = {
            "batch_info": batch.get_status_summary(),
            "growth_log": batch.growth_log,
            "environmental_log": batch.environmental_log,
            "status_history": batch.notes
        }
        
        return json.dumps(export_data, indent=2, default=str)

# Example usage
def demo_batch_tracking():
    """Demonstrate batch tracking functionality."""
    manager = BatchManager()
    
    # Create test batches
    batch1 = manager.create_batch("Oyster", "Straw pellets")
    batch2 = manager.create_batch("Shiitake", "Hardwood sawdust")
    
    # Add some growth measurements
    manager.batches[batch1].add_growth_measurement(15.5, "Initial inoculation weight")
    manager.batches[batch1].add_environmental_data(24.2, 85.1, 1200)
    
    manager.batches[batch2].add_growth_measurement(22.1, "Initial inoculation weight")
    manager.batches[batch2].add_environmental_data(22.8, 82.5, 1150)
    
    # Update status
    manager.batches[batch1].update_status(BatchStatus.COLONIZING, "Visible mycelium growth")
    
    # Generate report
    report = manager.generate_daily_report()
    print("Daily Batch Report:")
    print(json.dumps(report, indent=2, default=str))

if __name__ == "__main__":
    demo_batch_tracking()
`
    }
  ]);

  const proFeatures: ProFeature[] = [
    {
      id: 'ai-completion',
      name: 'AI Code Completion',
      description: 'Real-time AI-powered code suggestions as you type',
      icon: Brain,
      status: 'active',
      category: 'ai'
    },
    {
      id: 'live-errors',
      name: 'Live Error Detection',
      description: 'Instant error highlighting with AI-powered fixes',
      icon: Bug,
      status: 'active',
      category: 'ai'
    },
    {
      id: 'advanced-debugger',
      name: 'Advanced Debugger',
      description: 'Set breakpoints, inspect variables, step through code',
      icon: Target,
      status: 'active',
      category: 'debug'
    },
    {
      id: 'performance-profiler',
      name: 'Performance Profiler',
      description: 'Memory usage, execution time, and bottleneck analysis',
      icon: Activity,
      status: 'active',
      category: 'debug'
    },
    {
      id: 'git-integration',
      name: 'Advanced Git',
      description: 'Visual diff, branch management, merge conflicts',
      icon: GitBranch,
      status: 'active',
      category: 'collab'
    },
    {
      id: 'collaboration',
      name: 'Live Collaboration',
      description: 'Real-time multi-user editing and shared workspaces',
      icon: Users,
      status: 'premium',
      category: 'collab'
    },
    {
      id: 'deployment',
      name: 'One-Click Deploy',
      description: 'Deploy to AWS, Vercel, Docker with single click',
      icon: Rocket,
      status: 'active',
      category: 'deploy'
    },
    {
      id: 'lab-visualizer',
      name: 'Lab Data Visualizer',
      description: 'Chart and graph mycology cultivation data',
      icon: BarChart3,
      status: 'active',
      category: 'mycology'
    },
    {
      id: 'batch-tracker',
      name: 'Batch Tracker',
      description: 'Advanced cultivation batch management and monitoring',
      icon: TestTube,
      status: 'active',
      category: 'mycology'
    },
    {
      id: 'environmental-monitor',
      name: 'Environmental Monitor',
      description: 'Real-time sensor data and automated controls',
      icon: Monitor,
      status: 'active',
      category: 'mycology'
    }
  ];

  // Handle text selection in editor
  const handleTextSelection = useCallback(() => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      
      if (selected && selected.trim()) {
        setSelectedText(selected);
      }
    }
  }, []);

  // Auto-suggest functionality
  useEffect(() => {
    if (currentFile && currentFile.content) {
      // Simulate AI code suggestions based on current context
      const suggestions = [
        "Add error handling for sensor readings",
        "Implement data validation for temperature values",
        "Consider adding logging for debugging",
        "Use type hints for better code clarity"
      ];
      setAiSuggestions(suggestions);
    }
  }, [currentFile]);

  const renderProFeaturePanel = () => {
    const features = proFeatures.filter(f => f.category === activeRightPanel);
    
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg capitalize">{activeRightPanel} Features</h3>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            PRO
          </Badge>
        </div>
        
        <div className="space-y-3">
          {features.map((feature) => (
            <Card key={feature.id} className="p-3 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <feature.icon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{feature.name}</h4>
                    <Badge 
                      variant={feature.status === 'active' ? 'default' : feature.status === 'premium' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  
                  {feature.status === 'active' && (
                    <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                      Configure
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDebugPanel = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Debug Console</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={debugMode ? "destructive" : "default"}
            onClick={() => setDebugMode(!debugMode)}
          >
            {debugMode ? "Stop" : "Start"} Debug
          </Button>
        </div>
      </div>
      
      {debugMode && (
        <div className="space-y-3">
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-2">Breakpoints</h4>
            <div className="space-y-2">
              {breakpoints.map((bp, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>{bp.file}:{bp.line}</span>
                  {bp.condition && <Badge variant="outline" className="text-xs">{bp.condition}</Badge>}
                </div>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs w-full"
                onClick={() => setBreakpoints([...breakpoints, { line: 45, file: 'mycology_analysis.py', enabled: true }])}
              >
                Add Breakpoint
              </Button>
            </div>
          </Card>
          
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-2">Variables</h4>
            <div className="space-y-1 text-xs font-mono">
              <div>analyzer = MycologyAnalyzer</div>
              <div>growth_rate = 0.847</div>
              <div>batch_id = "BATCH_2025_001"</div>
              <div>correlations = {'{temp_weight: 0.73}'}</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  const renderPerformancePanel = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Performance Monitor</h3>
        <Badge variant="outline">Live</Badge>
      </div>
      
      <div className="space-y-3">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{metric.name}</span>
              <Badge variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'destructive' : 'secondary'}>
                {metric.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
            </div>
            <Progress 
              value={metric.status === 'good' ? 30 : metric.status === 'warning' ? 70 : 90} 
              className="mt-2 h-1"
            />
          </Card>
        ))}
        
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-2">Code Analysis</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Complexity Score</span>
              <span className="font-mono">7.2/10</span>
            </div>
            <div className="flex justify-between">
              <span>Code Coverage</span>
              <span className="font-mono">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Maintainability</span>
              <span className="font-mono">A</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMycologyPanel = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Mycology Tools</h3>
        <Microscope className="h-5 w-5 text-green-500" />
      </div>
      
      <div className="space-y-3">
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Active Batches
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>BATCH_2025_001 (Oyster)</span>
              <Badge variant="default">Fruiting</Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>BATCH_2025_002 (Shiitake)</span>
              <Badge variant="secondary">Colonizing</Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>BATCH_2025_003 (Lions Mane)</span>
              <Badge variant="destructive">High Risk</Badge>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Growth Analytics
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Avg Daily Growth</span>
              <span className="font-mono text-green-600">+0.84g</span>
            </div>
            <div className="flex justify-between">
              <span>Contamination Risk</span>
              <span className="font-mono text-yellow-600">12%</span>
            </div>
            <div className="flex justify-between">
              <span>Harvest ETA</span>
              <span className="font-mono">3.2 days</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Environmental Status
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span>Temperature</span>
              <span className="font-mono text-green-600">24.2°C ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Humidity</span>
              <span className="font-mono text-green-600">85.1% ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span>CO₂ Level</span>
              <span className="font-mono text-yellow-600">1247ppm ⚠</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-white text-zinc-900 flex flex-col overflow-hidden">
      {/* Pro IDE Header */}
      <div className="border-b border-zinc-900 bg-zinc-900 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/crowe-avatar.svg" 
                alt="Crowe Logic AI Avatar" 
                className="h-8 w-8 rounded-full border-2 border-white shadow-lg bg-white p-1"
              />
              <img 
                src="/croweos-logo.svg" 
                alt="CroweOS" 
                className="h-6 w-auto filter brightness-0 invert"
              />
              <Badge className="bg-white text-zinc-900 border-white font-bold">PRO</Badge>
            </div>
            
            <Separator orientation="vertical" className="h-6 bg-zinc-700" />
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-zinc-800">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-zinc-800">
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-zinc-800">
                <GitCommit className="h-4 w-4 mr-1" />
                Commit
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-zinc-300">
              <CheckCircle className="h-3 w-3 text-white" />
              <span>AI Active</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-300">
              <Clock className="h-3 w-3 text-white" />
              <span>Auto-save</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-zinc-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-zinc-800">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} border-r border-zinc-900 bg-zinc-900 transition-all duration-200`}>
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full justify-start text-white hover:bg-zinc-800"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {!sidebarCollapsed && <span className="ml-2">File Explorer</span>}
            </Button>
          </div>
          
          {!sidebarCollapsed && (
            <ScrollArea className="h-full px-2">
              <div className="space-y-1">
                {files.map((file) => (
                  <Button
                    key={file.id}
                    variant={activeFile === file.id ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start text-left ${
                      activeFile === file.id 
                        ? "bg-white text-zinc-900" 
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                    onClick={() => {
                      setActiveFile(file.id);
                      setCurrentFile(file);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{file.name}</div>
                      <div className="text-xs opacity-60 truncate">{file.path}</div>
                    </div>
                    {file.unsaved && <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"></div>}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Center Editor Panel */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          {activeFile && (
            <div className="border-b border-zinc-900 bg-zinc-900">
              <div className="flex items-center px-2 py-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-t border-b border-transparent">
                  <FileText className="h-3 w-3 text-zinc-600" />
                  <span className="text-sm text-zinc-900">{currentFile?.name}</span>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-zinc-500 hover:text-zinc-900">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Suggestions Bar */}
          {aiSuggestions.length > 0 && (
            <div className="border-b border-zinc-900 bg-zinc-800 p-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">AI Suggestions:</span>
                <ScrollArea className="flex-1">
                  <div className="flex gap-2">
                    {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                      <Badge key={index} variant="outline" className="text-xs whitespace-nowrap border-zinc-600 text-zinc-300 bg-zinc-700">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          
          {/* Editor Area */}
          <div className="flex-1 relative">
            {currentFile ? (
              <div className="h-full flex">
                <div className="flex-1 p-4">
                  <Textarea
                    ref={editorRef}
                    value={currentFile.content}
                    onChange={(e) => {
                      const updatedFile = { ...currentFile, content: e.target.value, unsaved: true };
                      setCurrentFile(updatedFile);
                    }}
                    onSelect={handleTextSelection}
                    className="w-full h-full font-mono text-sm resize-none border-0 bg-transparent text-zinc-900"
                    placeholder="Start coding..."
                  />
                </div>
                
                {/* Line numbers */}
                <div className="w-12 bg-zinc-900 border-l border-zinc-900 text-center text-xs text-zinc-300 py-4">
                  {currentFile.content.split('\n').map((_, index) => (
                    <div key={index} className="h-5 leading-5">
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50 text-zinc-400" />
                  <h3 className="text-lg font-semibold mb-2 text-zinc-900">Welcome to Crowe Logic Pro IDE</h3>
                  <p className="text-sm text-zinc-600">Select a file from the explorer to start coding with AI assistance</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`${rightPanelCollapsed ? 'w-12' : 'w-96'} border-l border-zinc-900 bg-zinc-900 transition-all duration-200`}>
          <div className="p-2 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              {!rightPanelCollapsed && (
                <Tabs value={activeRightPanel} onValueChange={(value: any) => setActiveRightPanel(value)}>
                  <TabsList className="grid w-full grid-cols-5 bg-zinc-800">
                    <TabsTrigger value="ai" className="p-1 data-[state=active]:bg-white data-[state=active]:text-zinc-900">
                      <Brain className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="debug" className="p-1 data-[state=active]:bg-white data-[state=active]:text-zinc-900">
                      <Bug className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="git" className="p-1 data-[state=active]:bg-white data-[state=active]:text-zinc-900">
                      <GitBranch className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="p-1 data-[state=active]:bg-white data-[state=active]:text-zinc-900">
                      <Activity className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="mycology" className="p-1 data-[state=active]:bg-white data-[state=active]:text-zinc-900">
                      <Microscope className="h-3 w-3" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="text-white hover:bg-zinc-800"
              >
                {rightPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {!rightPanelCollapsed && (
            <ScrollArea className="h-full">
              {activeRightPanel === 'ai' && (
                <IDEChatInterface 
                  currentFile={currentFile ? {
                    name: currentFile.name,
                    content: currentFile.content,
                    language: currentFile.language
                  } : undefined}
                  selectedCode={selectedText}
                />
              )}
              {activeRightPanel === 'debug' && renderDebugPanel()}
              {activeRightPanel === 'git' && renderProFeaturePanel()}
              {activeRightPanel === 'performance' && renderPerformancePanel()}
              {activeRightPanel === 'mycology' && renderMycologyPanel()}
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-zinc-900 bg-zinc-900 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-4">
            <span>Line 42, Col 18</span>
            <span>Python</span>
            <span>UTF-8</span>
            {debugMode && (
              <Badge variant="destructive" className="text-xs bg-white text-zinc-900">
                Debug Active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span>AI Assistant Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-white" />
              <span>Pro Features Active</span>
            </div>
            <span>Crowe Logic Pro IDE v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
