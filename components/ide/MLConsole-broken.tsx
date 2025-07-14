"use client"

import React, { useEffect, useRef, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, 
  Code, 
  Play, 
  Square, 
  Maximize2, 
  Minimize2,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Brain,
  Cpu,
  Zap,
  BarChart3,
  FileCode,
  Settings,
  GitBranch,
  Save,
  Download,
  Upload
} from 'lucide-react'
// Utility to join class names conditionally
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// Dynamically import Monaco and XTerm for lazy loading
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32 bg-muted">
      <div className="text-sm text-muted-foreground">Loading editor...</div>
    </div>
  )
})

interface MLConsoleProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  type: 'data' | 'python' | 'analysis' | 'config'
  language: string
  content: string
  readonly?: boolean
}

export function MLConsole({ isOpen, onClose, className }: MLConsoleProps) {
  const [activeTab, setActiveTab] = useState('data')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [executionCount, setExecutionCount] = useState(1)
  
  const tabs: TabItem[] = [
    {
      id: 'data',
      label: 'Batch Data',
      icon: Database,
      type: 'data',
      language: 'json',
      readonly: true,
      content: `{
  "lab_session": {
    "id": "COS-2025-001",
    "operator": "Dr. Sarah Chen",
    "timestamp": "2025-07-13T09:30:00Z",
    "environment": {
      "temperature_c": 22.3,
      "humidity_percent": 85,
      "atmospheric_pressure": 1013.2,
      "air_quality_index": 45
    }
  },
  "active_batches": [
    {
      "batch_id": "LM-001-2025",
      "species": "Hericium erinaceus",
      "strain": "CL-HE-Premium",
      "substrate_composition": {
        "hardwood_pellets": 0.65,
        "soybean_meal": 0.20,
        "wheat_bran": 0.10,
        "calcium_carbonate": 0.03,
        "gypsum": 0.02
      },
      "inoculation_date": "2025-07-01T14:00:00Z",
      "current_phase": "primordial_formation",
      "days_elapsed": 12,
      "projected_harvest": "2025-07-16",
      "vitals": {
        "mycelium_coverage": 0.96,
        "contamination_rate": 0.02,
        "growth_velocity": 2.3,
        "predicted_yield_kg": 2.8,
        "quality_score": 0.94
      },
      "monitoring": {
        "sensors_active": 24,
        "last_inspection": "2025-07-13T06:00:00Z",
        "ph_level": 6.8,
        "co2_concentration": 1200,
        "oxygen_level": 18.5
      }
    },
    {
      "batch_id": "OY-012-2025",
      "species": "Pleurotus ostreatus",
      "strain": "CL-PO-Blue",
      "substrate_composition": {
        "straw_pellets": 0.70,
        "hardwood_sawdust": 0.25,
        "lime": 0.05
      },
      "inoculation_date": "2025-07-05T10:30:00Z",
      "current_phase": "fruiting",
      "days_elapsed": 8,
      "projected_harvest": "2025-07-14",
      "vitals": {
        "mycelium_coverage": 1.00,
        "contamination_rate": 0.00,
        "growth_velocity": 3.1,
        "predicted_yield_kg": 2.1,
        "quality_score": 0.98
      }
    }
  ],
  "lab_analytics": {
    "total_active_batches": 2,
    "success_rate_30d": 0.963,
    "average_yield_efficiency": 0.92,
    "contamination_incidents": 1,
    "projected_monthly_output": 45.6,
    "resource_utilization": 0.87,
    "energy_consumption_kwh": 234.5,
    "water_usage_liters": 1205.3
  },
  "alerts": [
    {
      "level": "info",
      "message": "Batch LM-001-2025 ready for harvesting in 3 days",
      "timestamp": "2025-07-13T09:15:00Z"
    },
    {
      "level": "warning",
      "message": "CO2 levels slightly elevated in Zone B",
      "timestamp": "2025-07-13T08:45:00Z"
    }
  ]
}`
    },
    {
      id: 'python',
      label: 'ML Analysis',
      icon: Brain,
      type: 'python',
      language: 'python',
      content: `#!/usr/bin/env python3
"""
CroweOS Systems - Advanced Mycology Analytics Engine
Batch Performance Analysis & Yield Optimization
Version: 2.1.0
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class MyceliumAnalytics:
    def __init__(self, lab_data: Dict):
        self.data = lab_data
        self.batches = pd.DataFrame(lab_data['active_batches'])
        self.analytics = lab_data['lab_analytics']
        
    def calculate_yield_efficiency(self) -> float:
        """Calculate overall yield efficiency across all batches"""
        total_predicted = self.batches['vitals'].apply(
            lambda x: x['predicted_yield_kg']
        ).sum()
        
        substrate_weights = self.batches.apply(
            lambda row: sum([
                v for k, v in row['substrate_composition'].items() 
                if 'pellets' in k or 'sawdust' in k
            ]) * 10,  # Assuming 10kg base weight
            axis=1
        ).sum()
        
        efficiency = total_predicted / substrate_weights if substrate_weights > 0 else 0
        return round(efficiency, 3)
    
    def contamination_risk_analysis(self) -> Dict[str, float]:
        """Analyze contamination patterns and predict risk factors"""
        contamination_rates = self.batches['vitals'].apply(
            lambda x: x['contamination_rate']
        )
        
        risk_factors = {
            'current_avg_contamination': contamination_rates.mean(),
            'max_contamination': contamination_rates.max(),
            'batches_at_risk': len(contamination_rates[contamination_rates > 0.05]),
            'predicted_30d_loss': contamination_rates.mean() * 0.15 * 100
        }
        
        return {k: round(v, 4) for k, v in risk_factors.items()}
    
    def growth_velocity_optimization(self) -> Dict[str, any]:
        """Analyze growth patterns for optimization opportunities"""
        velocities = self.batches['vitals'].apply(lambda x: x['growth_velocity'])
        coverage = self.batches['vitals'].apply(lambda x: x['mycelium_coverage'])
        
        optimization_insights = {
            'avg_growth_velocity': velocities.mean(),
            'velocity_variance': velocities.var(),
            'optimal_coverage_threshold': 0.95,
            'batches_meeting_threshold': len(coverage[coverage >= 0.95]),
            'improvement_potential': (velocities.max() - velocities.mean()) / velocities.mean()
        }
        
        return optimization_insights
    
    def environmental_correlation_analysis(self) -> Dict[str, float]:
        """Correlate environmental factors with batch performance"""
        env = self.data['lab_session']['environment']
        
        # Simulate correlation analysis with environmental factors
        temp_impact = 1.0 - abs(env['temperature_c'] - 22.0) / 22.0
        humidity_impact = env['humidity_percent'] / 100.0
        pressure_impact = env['atmospheric_pressure'] / 1013.25
        
        return {
            'temperature_efficiency': round(temp_impact, 3),
            'humidity_optimization': round(humidity_impact, 3),
            'pressure_stability': round(pressure_impact, 3),
            'overall_env_score': round((temp_impact + humidity_impact + pressure_impact) / 3, 3)
        }
    
    def generate_production_forecast(self, days_ahead: int = 30) -> Dict[str, any]:
        """Generate production forecasts based on current batch performance"""
        current_yield_rate = self.analytics['average_yield_efficiency']
        current_success_rate = self.analytics['success_rate_30d']
        
        projected_batches = days_ahead // 14  # Assuming 14-day cycle
        base_yield_per_batch = 2.5  # kg average
        
        forecast = {
            'projected_batches': projected_batches,
            'expected_yield_kg': projected_batches * base_yield_per_batch * current_success_rate,
            'revenue_projection_usd': projected_batches * base_yield_per_batch * current_success_rate * 25,
            'resource_requirements': {
                'substrate_kg': projected_batches * 12,
                'energy_kwh': projected_batches * 45,
                'water_liters': projected_batches * 85
            },
            'confidence_interval': 0.87
        }
        
        return forecast

# Initialize analytics engine
print("🔬 CroweOS Mycology Analytics Engine v2.1.0")
print("=" * 50)

# Load and process batch data from the imported JSON
import json
batch_data = {
    "lab_session": {
        "id": "COS-2025-001",
        "operator": "Dr. Sarah Chen",
        "timestamp": "2025-07-13T09:30:00Z",
        "environment": {
            "temperature_c": 22.3,
            "humidity_percent": 85,
            "atmospheric_pressure": 1013.2,
            "air_quality_index": 45
        }
    },
    "active_batches": [
        {
            "batch_id": "LM-001-2025",
            "species": "Hericium erinaceus",
            "vitals": {
                "mycelium_coverage": 0.96,
                "contamination_rate": 0.02,
                "growth_velocity": 2.3,
                "predicted_yield_kg": 2.8,
                "quality_score": 0.94
            }
        }
    ],
    "lab_analytics": {
        "success_rate_30d": 0.963,
        "average_yield_efficiency": 0.92
    }
}

analytics_engine = MyceliumAnalytics(batch_data)

# Performance Analysis
print("\\n📊 BATCH PERFORMANCE ANALYSIS")
print("-" * 30)

yield_eff = analytics_engine.calculate_yield_efficiency()
print(f"Overall Yield Efficiency: {yield_eff:.1%}")

contamination_analysis = analytics_engine.contamination_risk_analysis()
print(f"Average Contamination Rate: {contamination_analysis['current_avg_contamination']:.1%}")
print(f"Batches at Risk: {contamination_analysis['batches_at_risk']}")

growth_analysis = analytics_engine.growth_velocity_optimization()
print(f"Average Growth Velocity: {growth_analysis['avg_growth_velocity']:.2f} mm/day")
print(f"Improvement Potential: {growth_analysis['improvement_potential']:.1%}")

# Environmental Analysis
print("\\n🌡️ ENVIRONMENTAL CORRELATION")
print("-" * 30)

env_analysis = analytics_engine.environmental_correlation_analysis()
print(f"Temperature Efficiency: {env_analysis['temperature_efficiency']:.1%}")
print(f"Humidity Optimization: {env_analysis['humidity_optimization']:.1%}")
print(f"Overall Environment Score: {env_analysis['overall_env_score']:.1%}")

# Production Forecast
print("\\n📈 30-DAY PRODUCTION FORECAST")
print("-" * 30)

forecast = analytics_engine.generate_production_forecast(30)
print(f"Projected Batches: {forecast['projected_batches']}")
print(f"Expected Yield: {forecast['expected_yield_kg']:.1f} kg")
print(f"Revenue Projection: \${forecast['revenue_projection_usd']:,.2f}")
print(f"Confidence Level: {forecast['confidence_interval']:.1%}")

print("\\n✅ Analysis Complete - Ready for optimization implementation")
`
    },
    {
      id: 'config',
      label: 'Lab Config',
      icon: Settings,
      type: 'config',
      language: 'yaml',
      content: `# CroweOS Systems - Lab Configuration
# Mycology Production Environment Settings

lab_environment:
  name: "CroweOS Primary Mycology Lab"
  version: "2.1.0"
  location: "Research Facility Alpha"
  
  temperature_control:
    target_celsius: 22.0
    tolerance: ±1.5
    sensors:
      - zone_a: "TEMP-001"
      - zone_b: "TEMP-002" 
      - zone_c: "TEMP-003"
    
  humidity_management:
    target_percent: 85
    tolerance: ±5
    misting_schedule: "every_4_hours"
    dehumidification: "auto"
    
  air_quality:
    co2_target_ppm: 1000
    oxygen_minimum: 18.0
    filtration_grade: "HEPA_H13"
    air_changes_per_hour: 12
    
batch_management:
  default_cycle_days: 14
  quality_thresholds:
    minimum_coverage: 0.90
    maximum_contamination: 0.05
    minimum_yield_kg: 1.5
    
  monitoring_intervals:
    visual_inspection: "daily"
    sensor_readings: "hourly"
    sampling: "every_3_days"
    
  alert_conditions:
    contamination_spike: "> 0.03"
    temperature_deviation: "> 2.0°C"
    humidity_drop: "< 75%"
    growth_stagnation: "< 1.0 mm/day"

automation_systems:
  misting_control: enabled
  temperature_regulation: enabled
  air_circulation: enabled
  lighting_schedule: enabled
  
  emergency_protocols:
    contamination_detected: "isolate_and_alert"
    system_failure: "backup_activation"
    power_outage: "emergency_ventilation"

data_collection:
  sensor_polling_interval: 300  # seconds
  image_capture_frequency: "6_hours"
  growth_measurement: "daily"
  
  storage:
    local_retention_days: 90
    cloud_backup: enabled
    data_encryption: "AES-256"

analytics_engine:
  ml_model_version: "2.1.0"
  prediction_accuracy: 0.94
  retraining_schedule: "monthly"
  
  features:
    - growth_prediction
    - contamination_detection
    - yield_optimization
    - environmental_correlation
    - resource_planning`
    },
    {
      id: 'analysis',
      label: 'Reports',
      icon: BarChart3,
      type: 'analysis',
      language: 'markdown',
      readonly: true,
      content: `# CroweOS Systems Lab Report
## Production Analysis & Insights

### Executive Summary
**Report Generated:** July 13, 2025 09:30 UTC  
**Reporting Period:** July 1-13, 2025  
**Lab Performance Grade:** A+ (96.3%)

---

### 🎯 Key Performance Indicators

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Success Rate | 96.3% | 95.0% | ✅ Exceeding |
| Yield Efficiency | 92.0% | 90.0% | ✅ Exceeding |
| Contamination Rate | 2.0% | <5.0% | ✅ Excellent |
| Energy Efficiency | 87.0% | 85.0% | ✅ Optimal |

### 📊 Batch Performance Analysis

#### Active Production
- **Lions Mane (LM-001-2025):** Day 12/16 - Primordial formation stage
  - Mycelium coverage: 96%
  - Predicted yield: 2.8kg (above target)
  - Quality score: 94%
  
- **Oyster Mushrooms (OY-012-2025):** Day 8/14 - Fruiting stage
  - Mycelium coverage: 100%
  - Predicted yield: 2.1kg
  - Quality score: 98% (exceptional)

#### Growth Velocity Trends
Current average growth velocity shows optimal performance:
- Lions Mane: 2.3 mm/day (target: 2.0 mm/day)
- Oyster: 3.1 mm/day (target: 2.5 mm/day)

### 🌡️ Environmental Conditions

**Temperature Control:** Optimal (22.3°C)
- Variance: ±0.8°C (well within tolerance)
- Heating efficiency: 94%

**Humidity Management:** Excellent (85%)
- Misting system performance: 98%
- Dehumidification cycles: 12/day

**Air Quality:** Superior
- CO₂ levels: 1200 ppm (optimal for fruiting)
- O₂ concentration: 18.5% (healthy range)
- Filtration efficiency: 99.7%

### 🔬 Quality Control Metrics

#### Contamination Analysis
- **Total incidents:** 1 minor (July 8)
- **Response time:** 2.3 hours
- **Containment:** 100% successful
- **Root cause:** External vector (resolved)

#### Substrate Optimization
Current substrate compositions showing excellent results:
- Hardwood pellet utilization: 95%
- Nutrient absorption rate: 92%
- pH stability: 6.8 (optimal range)

### 📈 Production Forecasting

#### 30-Day Projection
- **Expected batches:** 4 complete cycles
- **Projected yield:** 12.4kg premium mushrooms
- **Revenue estimate:** $310 (at $25/kg)
- **Confidence level:** 87%

#### Resource Planning
- **Substrate required:** 48kg
- **Energy consumption:** 180 kWh
- **Water usage:** 340 liters

### 🚀 Optimization Recommendations

1. **Increase Lions Mane Production**
   - Current success rate: 96%
   - Market demand: High
   - Recommended expansion: +25%

2. **Environmental Fine-Tuning**
   - Reduce CO₂ by 50 ppm during primordial stage
   - Implement circadian lighting cycle
   - Optimize misting frequency to every 3.5 hours

3. **Automation Upgrades**
   - Install predictive contamination sensors
   - Implement automated pH adjustment
   - Add computer vision for growth monitoring

### ⚠️ Alerts & Monitoring

**Current Alerts:**
- ℹ️ INFO: LM-001-2025 ready for harvest in 3 days
- ⚠️ WARNING: Zone B CO₂ slightly elevated (monitoring)

**System Health:**
- Sensors online: 24/24 (100%)
- Last maintenance: July 10, 2025
- Next scheduled service: July 20, 2025

---

**Report Confidence:** 96%  
**Next Report:** July 20, 2025  
**Generated by:** CroweOS Analytics Engine v2.1.0`
    }
  ]

  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<{ dispose: () => void; writeln: (data: string) => void; write: (data: string) => void; clear: () => void } | null>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Find active tab content
  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]

  // Initialize XTerm terminal with enhanced styling
  useEffect(() => {
    if (!isOpen || !terminalRef.current) return

    const loadXTerm = async () => {
      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')
      
      if (xtermRef.current) {
        xtermRef.current.dispose()
      }

      const terminal = new Terminal({
        theme: {
          background: '#0a0a0a',
          foreground: '#e5e5e5',
          cursor: '#00ff88',
          selectionBackground: '#264f78',
          black: '#000000',
          red: '#ff6b6b',
          green: '#51cf66',
          yellow: '#ffd43b',
          blue: '#74c0fc',
          magenta: '#f06292',
          cyan: '#4dd0e1',
          white: '#ffffff',
          brightBlack: '#495057',
          brightRed: '#ff8a80',
          brightGreen: '#69f0ae',
          brightYellow: '#ffff8d',
          brightBlue: '#82b1ff',
          brightMagenta: '#ff80ab',
          brightCyan: '#84ffff',
          brightWhite: '#ffffff'
        },
        fontSize: 13,
        fontFamily: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        fontWeight: '400',
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 1000
      })

      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      terminal.open(terminalRef.current!)
      
      // Fit with a small delay to ensure proper sizing
      setTimeout(() => fitAddon.fit(), 100)

      // Enhanced welcome sequence
      terminal.writeln('╭─────────────────────────────────────────────────────────────╮')
      terminal.writeln('│  🔬 CroweOS Systems Advanced ML Console v2.1.0             │')
      terminal.writeln('│  Mycology Lab Intelligence & Analytics Platform            │')
      terminal.writeln('╰─────────────────────────────────────────────────────────────╯')
      terminal.writeln('')
      terminal.writeln('🧬 Initializing neural networks...')
      terminal.writeln('📊 Loading batch analysis models...')
      terminal.writeln('🌡️ Connecting to environmental sensors...')
      terminal.writeln('✅ System ready - AI-powered mycology analytics online')
      terminal.writeln('')
      terminal.write('(crowe-ml) $ ')

      xtermRef.current = terminal

      // Enhanced terminal input handling
      let currentLine = ''
      terminal.onData((data) => {
        if (data === '\r' || data === '\n') {
          terminal.writeln('')
          if (currentLine.trim()) {
            handleTerminalCommand(currentLine.trim())
          }
          currentLine = ''
          terminal.write('(crowe-ml) $ ')
        } else if (data === '\u007f') { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            terminal.write('\b \b')
          }
        } else if (data === '\u0003') { // Ctrl+C
          terminal.writeln('^C')
          currentLine = ''
          terminal.write('(crowe-ml) $ ')
        } else if (data.charCodeAt(0) >= 32) { // Printable characters
          currentLine += data
          terminal.write(data)
        }
      })
    }

    loadXTerm()

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose()
        xtermRef.current = null
      }
    }
  }, [isOpen])

  // Handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (!xtermRef.current) return

    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'help':
        xtermRef.current.writeln('Available Commands:')
        xtermRef.current.writeln('  analyze    - Run batch analysis')
        xtermRef.current.writeln('  status     - Show system status')
        xtermRef.current.writeln('  batches    - List active batches')
        xtermRef.current.writeln('  env        - Environmental readings')
        xtermRef.current.writeln('  forecast   - Production forecast')
        xtermRef.current.writeln('  clear      - Clear terminal')
        xtermRef.current.writeln('  help       - Show this help')
        break
      
      case 'analyze':
      case 'run':
        runPythonCode()
        return
        
      case 'status':
        xtermRef.current.writeln('🟢 System Status: Operational')
        xtermRef.current.writeln('🔬 Active Batches: 2')
        xtermRef.current.writeln('🌡️ Environment: Optimal')
        xtermRef.current.writeln('🧠 ML Models: Online')
        xtermRef.current.writeln('📡 Sensors: 24/24 Active')
        break
        
      case 'batches':
        xtermRef.current.writeln('Active Production Batches:')
        xtermRef.current.writeln('  🦁 LM-001-2025: Lions Mane (96% coverage, Day 12)')
        xtermRef.current.writeln('  🦪 OY-012-2025: Oyster (100% coverage, Day 8)')
        break
        
      case 'env':
        xtermRef.current.writeln('Environmental Readings:')
        xtermRef.current.writeln('  🌡️ Temperature: 22.3°C (optimal)')
        xtermRef.current.writeln('  💧 Humidity: 85% (excellent)')
        xtermRef.current.writeln('  🌬️ CO₂: 1200 ppm (fruiting range)')
        xtermRef.current.writeln('  💨 O₂: 18.5% (healthy)')
        break
        
      case 'forecast':
        xtermRef.current.writeln('30-Day Production Forecast:')
        xtermRef.current.writeln('  📦 Projected Batches: 4')
        xtermRef.current.writeln('  ⚖️ Expected Yield: 12.4kg')
        xtermRef.current.writeln('  💰 Revenue Projection: $310')
        xtermRef.current.writeln('  🎯 Confidence: 87%')
        break
        
      case 'clear':
        xtermRef.current.clear()
        xtermRef.current.write('(crowe-ml) $ ')
        return
        
      default:
        if (cmd) {
          xtermRef.current.writeln(`Command not found: ${cmd}`)
          xtermRef.current.writeln('Type "help" for available commands')
        }
    }
  }

  const runPythonCode = async () => {
    if (!xtermRef.current) return

    setIsRunning(true)
    xtermRef.current.writeln('🚀 Executing ML analysis pipeline...')
    xtermRef.current.writeln('')
    
    const steps = [
      '📊 Loading batch data and environmental sensors...',
      '🧮 Calculating yield efficiency metrics...',
      '🔍 Analyzing contamination risk patterns...',
      '📈 Computing growth velocity optimization...',
      '🌡️ Processing environmental correlations...',
      '🎯 Generating 30-day production forecast...'
    ]
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      if (xtermRef.current) {
        xtermRef.current.writeln(steps[i])
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (xtermRef.current) {
      xtermRef.current.writeln('')
      xtermRef.current.writeln('🔬 CroweOS Mycology Analytics Engine v2.1.0')
      xtermRef.current.writeln('==================================================')
      xtermRef.current.writeln('')
      xtermRef.current.writeln('📊 BATCH PERFORMANCE ANALYSIS')
      xtermRef.current.writeln('------------------------------')
      xtermRef.current.writeln('Overall Yield Efficiency: 92.0%')
      xtermRef.current.writeln('Average Contamination Rate: 2.0%')
      xtermRef.current.writeln('Batches at Risk: 0')
      xtermRef.current.writeln('Average Growth Velocity: 2.70 mm/day')
      xtermRef.current.writeln('Improvement Potential: 14.8%')
      xtermRef.current.writeln('')
      xtermRef.current.writeln('🌡️ ENVIRONMENTAL CORRELATION')
      xtermRef.current.writeln('------------------------------')
      xtermRef.current.writeln('Temperature Efficiency: 98.6%')
      xtermRef.current.writeln('Humidity Optimization: 85.0%')
      xtermRef.current.writeln('Overall Environment Score: 91.2%')
      xtermRef.current.writeln('')
      xtermRef.current.writeln('📈 30-DAY PRODUCTION FORECAST')
      xtermRef.current.writeln('------------------------------')
      xtermRef.current.writeln('Projected Batches: 4')
      xtermRef.current.writeln('Expected Yield: 12.4 kg')
      xtermRef.current.writeln('Revenue Projection: $310.00')
      xtermRef.current.writeln('Confidence Level: 87.0%')
      xtermRef.current.writeln('')
      xtermRef.current.writeln('✅ Analysis Complete - Ready for optimization implementation')
      xtermRef.current.writeln(`📝 Execution #${executionCount} completed successfully`)
      xtermRef.current.write('\n(crowe-ml) $ ')
    }
    
    setExecutionCount(prev => prev + 1)
    setIsRunning(false)
  }

  const clearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear()
      xtermRef.current.write('(crowe-ml) $ ')
    }
  }

  const saveCurrentTab = () => {
    // Simulate save operation
    if (xtermRef.current) {
      xtermRef.current.writeln(`💾 Saved ${activeTabData.label} successfully`)
      xtermRef.current.write('(crowe-ml) $ ')
    }
  }

  // Terminal resize handler
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newHeight = window.innerHeight - e.clientY - 100
      const clampedHeight = Math.min(Math.max(newHeight, 150), 600)
      setTerminalHeight(clampedHeight)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm border border-border shadow-2xl",
        isMaximized ? "m-0" : "m-4 rounded-xl",
        className
      )}
    >
      {/* Professional Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-background via-muted/20 to-background">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">CroweOS ML Console</h2>
            <p className="text-xs text-muted-foreground">Advanced Mycology Analytics Platform v2.1.0</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
              {isRunning ? (
                <>
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                  Running
                </>
              ) : (
                <>
                  <Cpu className="h-3 w-3 mr-1" />
                  Ready
                </>
              )}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <GitBranch className="h-3 w-3 mr-1" />
              main
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={saveCurrentTab}
            className="text-xs"
          >
            <Save className="h-3 w-3 mr-2" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(!isMaximized)}
            className="h-8 w-8"
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        <motion.div 
          initial={false}
          animate={{ width: sidebarCollapsed ? 60 : 280 }}
          transition={{ duration: 0.2 }}
          className="border-r border-border/50 bg-muted/30 backdrop-blur-sm flex flex-col"
        >
          {/* Sidebar Header */}
          <div className="p-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <span className="text-sm font-medium text-muted-foreground">Project Files</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-6 w-6"
              >
                {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex-1 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-200",
                    sidebarCollapsed ? "px-2" : "px-3",
                    activeTab === tab.id && "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                  )}
                >
                  <Icon className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-3")} />
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-muted-foreground capitalize">{tab.language}</div>
                    </div>
                  )}
                  {!sidebarCollapsed && tab.readonly && (
                    <Badge variant="outline" className="text-xs ml-2">RO</Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-2 border-t border-border/30 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runPythonCode}
              disabled={isRunning}
              className={cn(
                "w-full transition-all duration-200",
                sidebarCollapsed ? "px-2" : "px-3"
              )}
            >
              {isRunning ? (
                <>
                  <Square className="h-3 w-3 animate-pulse" />
                  {!sidebarCollapsed && <span className="ml-2">Running...</span>}
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  {!sidebarCollapsed && <span className="ml-2">Run Analysis</span>}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between p-3 border-b border-border/30 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {React.createElement(activeTabData.icon, { className: "h-4 w-4 text-blue-400" })}
                <span className="font-medium text-sm">{activeTabData.label}</span>
                <Badge variant="outline" className="text-xs">{activeTabData.language}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Upload className="h-3 w-3 mr-2" />
                Import
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full bg-muted/30">
                <div className="text-center">
                  <Cpu className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-400" />
                  <div className="text-sm text-muted-foreground">Loading advanced editor...</div>
                </div>
              </div>
            }>
              <MonacoEditor
                height="100%"
                language={activeTabData.language}
                value={activeTabData.content}
                onChange={(value) => {
                  if (!activeTabData.readonly && value) {
                    // Handle code changes for editable tabs
                  }
                }}
                options={{
                  readOnly: activeTabData.readonly,
                  fontSize: 13,
                  minimap: { enabled: true, scale: 1 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  theme: 'vs-dark',
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  bracketPairColorization: { enabled: true },
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  renderWhitespace: 'selection',
                  renderLineHighlight: 'all',
                  fontLigatures: true,
                  fontFamily: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace'
                }}
              />
            </Suspense>
          </div>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={handleMouseDown}
            className="h-1 bg-border/50 hover:bg-border transition-colors cursor-row-resize relative group"
          >
            <div className="absolute inset-x-0 inset-y-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Enhanced Terminal */}
          <div 
            style={{ height: terminalHeight }}
            className="flex flex-col bg-gradient-to-b from-black/95 to-black border-t border-border/30"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-black/50">
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">CroweOS Terminal</span>
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                  {isRunning ? 'Executing' : 'Ready'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTerminal}
                  className="h-6 text-xs text-white hover:bg-white/10"
                >
                  Clear
                </Button>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
              </div>
            </div>
            <div 
              ref={terminalRef} 
              className="flex-1 p-3 overflow-hidden"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
