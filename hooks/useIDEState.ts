"use client";

import { useState, useCallback, useEffect } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  language?: 'python' | 'markdown' | 'json' | 'typescript' | 'text';
  lastModified: Date;
  isDirty?: boolean;
  isActive?: boolean;
  path: string;
}

export interface TabItem {
  id: string;
  name: string;
  type: 'editor' | 'preview' | 'sop' | 'task';
  fileId?: string;
  isDirty: boolean;
  isActive: boolean;
}

export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'system';
  timestamp: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'code' | 'text' | 'suggestion';
}

export interface AICodeSuggestion {
  id: string;
  code: string;
  description: string;
  language: string;
  confidence: number;
  category: 'optimization' | 'bug-fix' | 'enhancement' | 'protocol';
}

export interface PanelState {
  isCollapsed: boolean;
  width?: number;
  height?: number;
}

export interface IDEState {
  // File Management
  files: FileItem[];
  tabs: TabItem[];
  activeTabId: string | null;
  
  // Panel States
  leftPanel: PanelState & { activeTab: 'files' | 'ai' | 'tasks' };
  rightPanel: PanelState & { activeTab: 'suggestions' | 'database' | 'analytics' };
  bottomPanel: PanelState & { activeTab: 'terminal' | 'output' | 'logs' };
  
  // Terminal
  terminalLines: TerminalLine[];
  terminalInput: string;
  
  // AI Coder
  aiMessages: AIMessage[];
  aiInput: string;
  isAILoading: boolean;
  codeSuggestions: AICodeSuggestion[];
  
  // Theme & UI
  theme: 'light' | 'dark';
  
  // Database
  dbStatus: {
    connected: boolean;
    lastSync: Date;
    filesSaved: number;
  };
}

const initialFiles: FileItem[] = [
  {
    id: 'file-1',
    name: 'cultivation-protocol.py',
    type: 'file',
    language: 'python',
    path: '/cultivation-protocol.py',
    content: `# Crowe Logic™ Cultivation Protocol System
# Advanced mycology research and development platform

import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import json

@dataclass
class CultivationBatch:
    """Professional cultivation batch tracking with AI optimization"""
    
    batch_id: str
    species: str
    substrate: str
    inoculation_date: datetime.datetime
    expected_harvest: datetime.datetime
    current_phase: str = "inoculation"
    
    def __post_init__(self):
        self.log_entries: List[Dict[str, Any]] = []
        self.environmental_data: List[Dict[str, float]] = []
        self.ai_recommendations: List[str] = []
    
    def log_observation(self, observation: str, temp: float, humidity: float, co2: float = 400):
        """Record cultivation observations with environmental data"""
        entry = {
            'timestamp': datetime.datetime.now().isoformat(),
            'observation': observation,
            'environmental': {
                'temperature': temp,
                'humidity': humidity,
                'co2_level': co2
            },
            'phase': self.current_phase
        }
        self.log_entries.append(entry)
        self.environmental_data.append({
            'timestamp': datetime.datetime.now().timestamp(),
            'temperature': temp,
            'humidity': humidity,
            'co2': co2
        })
        print(f"[{self.batch_id}] {observation} | T: {temp}°C | H: {humidity}% | CO₂: {co2}ppm")
    
    def analyze_growth_patterns(self) -> Dict[str, Any]:
        """AI-powered growth pattern analysis"""
        if not self.environmental_data:
            return {"status": "insufficient_data"}
        
        temps = [d['temperature'] for d in self.environmental_data]
        humidity = [d['humidity'] for d in self.environmental_data]
        
        analysis = {
            'average_temperature': sum(temps) / len(temps),
            'temperature_stability': max(temps) - min(temps),
            'average_humidity': sum(humidity) / len(humidity),
            'growth_stage_progress': len(self.log_entries) / 14,  # 14-day cycle
            'optimization_score': self._calculate_optimization_score(),
            'recommendations': self._generate_ai_recommendations()
        }
        
        return analysis
    
    def _calculate_optimization_score(self) -> float:
        """Calculate batch optimization score (0-1)"""
        if not self.environmental_data:
            return 0.0
        
        # Optimal ranges for oyster mushrooms
        optimal_temp_range = (18, 24)
        optimal_humidity_range = (80, 90)
        
        temp_scores = []
        humidity_scores = []
        
        for data in self.environmental_data:
            # Temperature score
            temp = data['temperature']
            if optimal_temp_range[0] <= temp <= optimal_temp_range[1]:
                temp_scores.append(1.0)
            else:
                deviation = min(abs(temp - optimal_temp_range[0]), abs(temp - optimal_temp_range[1]))
                temp_scores.append(max(0, 1 - (deviation / 5)))  # 5°C tolerance
            
            # Humidity score
            humidity = data['humidity']
            if optimal_humidity_range[0] <= humidity <= optimal_humidity_range[1]:
                humidity_scores.append(1.0)
            else:
                deviation = min(abs(humidity - optimal_humidity_range[0]), abs(humidity - optimal_humidity_range[1]))
                humidity_scores.append(max(0, 1 - (deviation / 20)))  # 20% tolerance
        
        temp_avg = sum(temp_scores) / len(temp_scores) if temp_scores else 0
        humidity_avg = sum(humidity_scores) / len(humidity_scores) if humidity_scores else 0
        
        return (temp_avg + humidity_avg) / 2
    
    def _generate_ai_recommendations(self) -> List[str]:
        """Generate AI-powered cultivation recommendations"""
        recommendations = []
        
        if not self.environmental_data:
            return ["Insufficient data for recommendations"]
        
        analysis = self.analyze_growth_patterns()
        
        if analysis['temperature_stability'] > 3:
            recommendations.append("🌡️ Temperature fluctuation detected. Consider improving climate control.")
        
        if analysis['average_temperature'] < 18:
            recommendations.append("🔥 Temperature below optimal range. Increase heating.")
        elif analysis['average_temperature'] > 24:
            recommendations.append("❄️ Temperature above optimal range. Improve ventilation.")
        
        if analysis['average_humidity'] < 80:
            recommendations.append("💧 Humidity below optimal. Increase misting frequency.")
        elif analysis['average_humidity'] > 90:
            recommendations.append("🌬️ Humidity too high. Improve air circulation.")
        
        if analysis['optimization_score'] > 0.8:
            recommendations.append("✨ Excellent cultivation conditions maintained!")
        
        return recommendations


class CroweLogicCultivationManager:
    """Central management system for all cultivation batches"""
    
    def __init__(self):
        self.batches: Dict[str, CultivationBatch] = {}
        self.protocols: Dict[str, Dict] = self._load_protocols()
    
    def create_batch(self, species: str, substrate: str, protocol: str = "standard") -> str:
        """Create new cultivation batch with AI optimization"""
        batch_id = f"CL-{datetime.datetime.now().strftime('%Y%m%d')}-{len(self.batches) + 1:03d}"
        
        batch = CultivationBatch(
            batch_id=batch_id,
            species=species,
            substrate=substrate,
            inoculation_date=datetime.datetime.now(),
            expected_harvest=datetime.datetime.now() + datetime.timedelta(days=14)
        )
        
        self.batches[batch_id] = batch
        
        # Add initial AI recommendations based on species
        if "oyster" in species.lower():
            batch.ai_recommendations.extend([
                "Optimal temperature: 18-24°C",
                "Maintain 80-90% humidity during fruiting",
                "Provide 1000-1500 lux lighting for 12h/day"
            ])
        
        print(f"✅ Created batch {batch_id} for {species} on {substrate}")
        return batch_id
    
    def get_batch_status(self, batch_id: str) -> Dict[str, Any]:
        """Get comprehensive batch status with AI insights"""
        if batch_id not in self.batches:
            return {"error": "Batch not found"}
        
        batch = self.batches[batch_id]
        analysis = batch.analyze_growth_patterns()
        
        days_elapsed = (datetime.datetime.now() - batch.inoculation_date).days
        progress_percentage = min(100, (days_elapsed / 14) * 100)
        
        return {
            "batch_id": batch_id,
            "species": batch.species,
            "substrate": batch.substrate,
            "days_elapsed": days_elapsed,
            "progress_percentage": progress_percentage,
            "current_phase": batch.current_phase,
            "optimization_score": analysis.get('optimization_score', 0),
            "recommendations": analysis.get('recommendations', []),
            "total_observations": len(batch.log_entries),
            "environmental_stability": analysis.get('temperature_stability', 0),
            "next_actions": self._get_next_actions(batch, days_elapsed)
        }
    
    def _load_protocols(self) -> Dict[str, Dict]:
        """Load cultivation protocols database"""
        return {
            "oyster_standard": {
                "species": "Pleurotus ostreatus",
                "phases": {
                    "inoculation": {"duration": 3, "temp": 22, "humidity": 85},
                    "colonization": {"duration": 7, "temp": 20, "humidity": 80},
                    "fruiting": {"duration": 4, "temp": 16, "humidity": 90}
                }
            },
            "shiitake_standard": {
                "species": "Lentinula edodes",
                "phases": {
                    "inoculation": {"duration": 5, "temp": 24, "humidity": 80},
                    "colonization": {"duration": 21, "temp": 22, "humidity": 75},
                    "fruiting": {"duration": 7, "temp": 18, "humidity": 85}
                }
            }
        }
    
    def _get_next_actions(self, batch: CultivationBatch, days_elapsed: int) -> List[str]:
        """Generate next action recommendations"""
        actions = []
        
        if days_elapsed < 3:
            actions.append("Monitor inoculation progress")
            actions.append("Maintain sterile conditions")
        elif days_elapsed < 10:
            actions.append("Check mycelium colonization")
            actions.append("Monitor for contamination")
        elif days_elapsed < 14:
            actions.append("Prepare for fruiting conditions")
            actions.append("Adjust lighting schedule")
        else:
            actions.append("Ready for harvest assessment")
            actions.append("Plan next batch cycle")
        
        return actions


# Example usage and testing
if __name__ == "__main__":
    # Initialize the cultivation manager
    manager = CroweLogicCultivationManager()
    
    # Create test batches
    batch1 = manager.create_batch("Pleurotus ostreatus", "Straw pellets")
    batch2 = manager.create_batch("Lentinula edodes", "Oak sawdust")
    
    # Simulate cultivation data
    batch_obj = manager.batches[batch1]
    batch_obj.log_observation("Initial inoculation complete", 22.0, 85.0, 400)
    batch_obj.log_observation("Mycelium spreading visible", 21.5, 82.0, 420)
    batch_obj.log_observation("25% colonization achieved", 20.8, 88.0, 450)
    
    # Get status and recommendations
    status = manager.get_batch_status(batch1)
    print(f"\\n📊 Batch Status Report:")
    print(f"Optimization Score: {status['optimization_score']:.2f}")
    print(f"Progress: {status['progress_percentage']:.1f}%")
    print(f"Recommendations: {', '.join(status['recommendations'])}")
`,
    lastModified: new Date(),
    isDirty: false,
    isActive: true
  },
  {
    id: 'folder-1',
    name: 'protocols',
    type: 'folder',
    path: '/protocols',
    children: [
      {
        id: 'file-2',
        name: 'sterilization-sop.md',
        type: 'file',
        language: 'markdown',
        path: '/protocols/sterilization-sop.md',
        content: `# Standard Operating Procedure: Sterilization Protocols

## Crowe Logic™ Professional Lab Management System

### Document Information
- **SOP ID**: CL-SOP-001
- **Version**: 2.1.0
- **Last Updated**: ${new Date().toISOString().split('T')[0]}
- **Approved By**: Crowe Logic AI Research Division
- **Next Review**: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

---

## 🎯 Purpose
This SOP establishes standardized sterilization procedures for mycology cultivation equipment, substrates, and work environments to ensure contamination-free research conditions.

## 🔬 Scope
Applies to all cultivation equipment, growth substrates, laboratory instruments, and work surfaces in the Crowe Logic cultivation facility.

## 📋 Procedures

### 1. Autoclave Sterilization (Primary Method)

#### 1.1 Equipment Preparation
- [ ] Inspect autoclave chamber for cleanliness
- [ ] Check water level in reservoir
- [ ] Verify pressure gauges are calibrated
- [ ] Test safety valve operation

#### 1.2 Loading Protocol
- [ ] Wrap items in autoclave-safe materials
- [ ] Place items with adequate spacing (2cm minimum)
- [ ] Do not exceed 80% chamber capacity
- [ ] Position temperature probe appropriately

#### 1.3 Sterilization Cycle
- **Temperature**: 121°C (250°F)
- **Pressure**: 15 PSI (1.05 kg/cm²)
- **Duration**: 
  - Substrates: 90 minutes
  - Equipment: 60 minutes
  - Liquids: 15-20 minutes
- **Cool-down**: Natural pressure release (30-45 minutes)

#### 1.4 Post-Sterilization
- [ ] Allow items to cool completely before handling
- [ ] Check sterilization indicators
- [ ] Log cycle parameters in database
- [ ] Store sterile items in clean environment

### 2. Chemical Sterilization

#### 2.1 Surface Disinfection
- **70% Isopropyl Alcohol**
  - Contact time: 30 seconds minimum
  - Apply to all work surfaces before and after use
  - Allow to air dry completely

#### 2.2 Equipment Disinfection
- **Hydrogen Peroxide (3% solution)**
  - Soak small instruments for 10 minutes
  - Rinse with sterile water
  - Air dry in sterile environment

#### 2.3 Air Sterilization
- **UV-C Lamps (254nm)**
  - Exposure time: 30 minutes minimum
  - Maintain 1-meter distance from surfaces
  - Ensure no personnel exposure during operation

### 3. Substrate Sterilization

#### 3.1 Straw Pellet Preparation
1. **Hydration**
   - Add sterile water at 65°C
   - Achieve 65-70% moisture content
   - Mix thoroughly to eliminate dry spots

2. **Bagging**
   - Use autoclave-safe polypropylene bags
   - Fill to 70% capacity maximum
   - Install filter patch or cotton plug

3. **Sterilization**
   - Autoclave at 121°C for 90 minutes
   - Allow natural cooling to room temperature
   - Check for proper sterility indicators

#### 3.2 Sawdust Substrate
1. **Preparation**
   - Screen sawdust to remove large particles
   - Add nutritional supplements (wheat bran, gypsum)
   - Achieve target moisture content (60-65%)

2. **Sterilization**
   - Steam sterilization at 121°C for 2 hours
   - Verify internal temperature reaches 121°C
   - Cool under sterile conditions

### 4. Environmental Controls

#### 4.1 HEPA Filtration
- [ ] Change HEPA filters every 6 months
- [ ] Test filter integrity monthly
- [ ] Maintain positive pressure in clean areas
- [ ] Monitor particle counts regularly

#### 4.2 Laminar Flow Hoods
- [ ] UV sterilize hood interior for 30 minutes before use
- [ ] Clean with 70% alcohol before each session
- [ ] Test airflow velocity monthly (90-120 ft/min)
- [ ] Replace pre-filters every 3 months

### 5. Quality Control

#### 5.1 Sterilization Indicators
- **Biological Indicators**: Geobacillus stearothermophilus spores
- **Chemical Indicators**: Heat-sensitive tape and strips
- **Physical Indicators**: Time, temperature, pressure logs

#### 5.2 Contamination Testing
- [ ] Agar plate exposure tests in work areas
- [ ] Swab testing of surfaces
- [ ] Air sampling during operations
- [ ] Monthly sterility validation

#### 5.3 Documentation Requirements
- [ ] Sterilization cycle logs
- [ ] Equipment maintenance records
- [ ] Contamination incident reports
- [ ] Monthly validation summaries

### 6. Troubleshooting

| Issue | Possible Cause | Corrective Action |
|-------|---------------|------------------|
| Incomplete sterilization | Insufficient time/temperature | Extend cycle time, verify temperature |
| Equipment damage | Excessive heat/pressure | Review load procedures, check settings |
| Contamination detected | Improper technique | Re-train personnel, review procedures |
| Autoclave failure | Mechanical malfunction | Service equipment, use backup methods |

### 7. Safety Considerations

#### 7.1 Personal Protective Equipment
- [ ] Heat-resistant gloves when handling hot items
- [ ] Safety glasses when using chemicals
- [ ] Lab coat and closed-toe shoes always
- [ ] Face shield for UV operations

#### 7.2 Emergency Procedures
- **Chemical Spills**: Dilute with water, ventilate area
- **Burns**: Cool water for 20 minutes, seek medical attention
- **Equipment Malfunction**: Shut down immediately, contact maintenance

---

## 📊 Performance Metrics

### Key Performance Indicators
- **Sterilization Success Rate**: >99.9%
- **Contamination Incidents**: <0.1% of batches
- **Equipment Uptime**: >95%
- **Compliance Score**: 100%

### Monthly Review Requirements
- [ ] Sterilization effectiveness analysis
- [ ] Equipment performance evaluation
- [ ] Personnel training assessment
- [ ] Procedure optimization opportunities

---

## 📝 Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 2.1.0 | ${new Date().toISOString().split('T')[0]} | Added UV sterilization protocols | Crowe Logic AI |
| 2.0.0 | 2024-12-01 | Major revision with AI optimization | Research Division |
| 1.0.0 | 2024-09-01 | Initial version | Lab Manager |

---

*This SOP is maintained by Crowe Logic™ AI Research Division and updated automatically based on cultivation outcomes and scientific advances.*
`,
        lastModified: new Date(),
        isDirty: false
      },
      {
        id: 'file-3',
        name: 'cultivation-checklist.json',
        type: 'file',
        language: 'json',
        path: '/protocols/cultivation-checklist.json',
        content: `{
  "checklist_version": "3.2.0",
  "last_updated": "${new Date().toISOString()}",
  "cultivation_phases": {
    "preparation": {
      "phase_name": "Substrate Preparation",
      "duration_days": 1,
      "tasks": [
        {
          "id": "prep_001",
          "task": "Sterilize all equipment and workspace",
          "required": true,
          "estimated_time": 30,
          "verification": "Visual inspection + UV verification"
        },
        {
          "id": "prep_002", 
          "task": "Prepare and hydrate substrate materials",
          "required": true,
          "estimated_time": 45,
          "verification": "Moisture content test (65-70%)"
        },
        {
          "id": "prep_003",
          "task": "Fill and seal cultivation containers",
          "required": true,
          "estimated_time": 20,
          "verification": "Proper filter patch installation"
        },
        {
          "id": "prep_004",
          "task": "Autoclave substrate at 121°C for 90 minutes",
          "required": true,
          "estimated_time": 120,
          "verification": "Sterilization indicator confirmation"
        }
      ],
      "quality_checks": [
        "No contamination visible",
        "Proper moisture content achieved",
        "All containers properly sealed",
        "Sterilization indicators positive"
      ]
    },
    "inoculation": {
      "phase_name": "Spawn Inoculation",
      "duration_days": 1,
      "tasks": [
        {
          "id": "inoc_001",
          "task": "Prepare sterile workspace with laminar flow",
          "required": true,
          "estimated_time": 15,
          "verification": "Airflow test + surface sterilization"
        },
        {
          "id": "inoc_002",
          "task": "Allow substrate to cool to room temperature",
          "required": true,
          "estimated_time": 240,
          "verification": "Internal temperature <25°C"
        },
        {
          "id": "inoc_003",
          "task": "Inoculate with spawn (3-5% by weight)",
          "required": true,
          "estimated_time": 10,
          "verification": "Even distribution achieved"
        },
        {
          "id": "inoc_004",
          "task": "Mix spawn thoroughly with substrate",
          "required": true,
          "estimated_time": 5,
          "verification": "Uniform spawn distribution"
        },
        {
          "id": "inoc_005",
          "task": "Seal containers and label with batch info",
          "required": true,
          "estimated_time": 5,
          "verification": "Complete labeling with date/species/batch ID"
        }
      ],
      "environmental_targets": {
        "temperature": "20-24°C",
        "humidity": "80-85%",
        "air_exchange": "Minimal (sealed environment)",
        "lighting": "None required"
      },
      "quality_checks": [
        "No contamination introduced",
        "Proper spawn percentage used",
        "Even spawn distribution",
        "Accurate labeling completed"
      ]
    },
    "colonization": {
      "phase_name": "Mycelium Colonization",
      "duration_days": 10,
      "daily_tasks": [
        {
          "id": "col_daily_001",
          "task": "Visual inspection for contamination",
          "required": true,
          "estimated_time": 5,
          "verification": "Photo documentation of progress"
        },
        {
          "id": "col_daily_002",
          "task": "Record environmental conditions",
          "required": true,
          "estimated_time": 2,
          "verification": "Database entry with temp/humidity/CO2"
        },
        {
          "id": "col_daily_003",
          "task": "Estimate colonization percentage",
          "required": true,
          "estimated_time": 3,
          "verification": "Visual assessment + notes"
        }
      ],
      "weekly_tasks": [
        {
          "id": "col_weekly_001",
          "task": "Deep contamination assessment",
          "required": true,
          "estimated_time": 15,
          "verification": "Detailed inspection + sampling if needed"
        },
        {
          "id": "col_weekly_002",
          "task": "Growth rate analysis",
          "required": true,
          "estimated_time": 10,
          "verification": "Calculate colonization speed"
        }
      ],
      "environmental_targets": {
        "temperature": "20-22°C",
        "humidity": "80-85%",
        "air_exchange": "0.5-1 volume per hour",
        "lighting": "None or minimal ambient"
      },
      "milestones": {
        "day_3": "10-20% colonization expected",
        "day_5": "40-60% colonization expected", 
        "day_7": "70-85% colonization expected",
        "day_10": "95-100% colonization target"
      },
      "quality_checks": [
        "White, fluffy mycelium growth",
        "No colored contamination",
        "Even colonization pattern",
        "No off odors detected"
      ]
    },
    "fruiting_initiation": {
      "phase_name": "Fruiting Conditions",
      "duration_days": 2,
      "tasks": [
        {
          "id": "fruit_init_001",
          "task": "Reduce temperature to fruiting range",
          "required": true,
          "estimated_time": 60,
          "verification": "Temperature monitoring shows 15-18°C"
        },
        {
          "id": "fruit_init_002",
          "task": "Increase humidity to 85-95%",
          "required": true,
          "estimated_time": 30,
          "verification": "Humidity sensor confirmation"
        },
        {
          "id": "fruit_init_003",
          "task": "Introduce fresh air exchange",
          "required": true,
          "estimated_time": 15,
          "verification": "4-6 air changes per hour confirmed"
        },
        {
          "id": "fruit_init_004",
          "task": "Provide lighting (12h on/12h off)",
          "required": true,
          "estimated_time": 5,
          "verification": "1000-1500 lux intensity measured"
        },
        {
          "id": "fruit_init_005",
          "task": "Create small holes for pinning",
          "required": true,
          "estimated_time": 10,
          "verification": "5-10 holes per container created"
        }
      ],
      "environmental_targets": {
        "temperature": "15-18°C",
        "humidity": "85-95%",
        "air_exchange": "4-6 volumes per hour",
        "lighting": "1000-1500 lux for 12 hours daily"
      },
      "quality_checks": [
        "Proper environmental transition achieved",
        "No contamination during opening",
        "Adequate fresh air flow",
        "Correct lighting intensity and schedule"
      ]
    },
    "fruiting_development": {
      "phase_name": "Mushroom Development",
      "duration_days": 7,
      "daily_tasks": [
        {
          "id": "fruit_dev_001",
          "task": "Monitor pin formation and development",
          "required": true,
          "estimated_time": 10,
          "verification": "Count and photograph pins/mushrooms"
        },
        {
          "id": "fruit_dev_002",
          "task": "Maintain optimal humidity with misting",
          "required": true,
          "estimated_time": 5,
          "verification": "Humidity readings within target range"
        },
        {
          "id": "fruit_dev_003",
          "task": "Ensure adequate air circulation",
          "required": true,
          "estimated_time": 3,
          "verification": "No stagnant air areas detected"
        },
        {
          "id": "fruit_dev_004",
          "task": "Record growth measurements",
          "required": true,
          "estimated_time": 10,
          "verification": "Size and count data in database"
        }
      ],
      "environmental_targets": {
        "temperature": "16-20°C",
        "humidity": "85-90%",
        "air_exchange": "4-6 volumes per hour",
        "lighting": "1000-1500 lux for 12 hours daily"
      },
      "development_stages": {
        "day_1-2": "Pin formation initiation",
        "day_3-4": "Pin elongation and cap development",
        "day_5-6": "Rapid size increase",
        "day_7": "Harvest readiness assessment"
      },
      "quality_checks": [
        "Uniform mushroom development",
        "No bacterial or mold contamination",
        "Proper cap formation and size",
        "No premature spore release"
      ]
    },
    "harvest": {
      "phase_name": "Harvest Operations",
      "duration_days": 2,
      "tasks": [
        {
          "id": "harv_001",
          "task": "Assess harvest readiness",
          "required": true,
          "estimated_time": 15,
          "verification": "Cap size 3-5cm, no spore release"
        },
        {
          "id": "harv_002",
          "task": "Harvest mushrooms at optimal time",
          "required": true,
          "estimated_time": 30,
          "verification": "Clean cuts at base, no substrate damage"
        },
        {
          "id": "harv_003",
          "task": "Weigh and document yield",
          "required": true,
          "estimated_time": 10,
          "verification": "Accurate weight measurements recorded"
        },
        {
          "id": "harv_004",
          "task": "Prepare substrate for second flush",
          "required": false,
          "estimated_time": 15,
          "verification": "Remove debris, adjust moisture if needed"
        },
        {
          "id": "harv_005",
          "task": "Quality assessment and grading",
          "required": true,
          "estimated_time": 20,
          "verification": "Grade A/B/C classification complete"
        }
      ],
      "harvest_criteria": {
        "cap_size": "3-5cm diameter",
        "cap_appearance": "Flat or slightly curved, no spore release",
        "stem_firmness": "Firm, not hollow",
        "overall_quality": "No blemishes or damage"
      },
      "quality_checks": [
        "Optimal harvest timing achieved",
        "No damage during harvest",
        "Accurate yield documentation",
        "Proper quality grading completed"
      ]
    }
  },
  "success_metrics": {
    "contamination_rate": "<2% of batches",
    "colonization_time": "8-12 days average",
    "fruiting_success": ">90% pin formation",
    "yield_efficiency": ">15% biological efficiency",
    "quality_grade": ">80% Grade A mushrooms"
  },
  "equipment_requirements": {
    "essential": [
      "Autoclave or pressure cooker",
      "Laminar flow hood or still air box",
      "Digital thermometer/hygrometer",
      "pH meter",
      "Digital scale",
      "Sterilization containers"
    ],
    "recommended": [
      "CO2 monitor",
      "Timer with alerts",
      "Camera for documentation",
      "Data logging system",
      "Backup environmental controls"
    ]
  },
  "ai_optimization_notes": {
    "automated_monitoring": "Consider IoT sensors for continuous data collection",
    "predictive_analytics": "Use historical data to predict optimal harvest timing",
    "yield_optimization": "Analyze environmental factors vs yield correlation",
    "contamination_prevention": "AI-powered early contamination detection"
  }
}`,
        lastModified: new Date(),
        isDirty: false
      }
    ],
    lastModified: new Date()
  },
  {
    id: 'file-4',
    name: 'research-notes.md',
    type: 'file',
    language: 'markdown',
    path: '/research-notes.md',
    content: `# Mycology Research Notes

## Current Projects

### Project Alpha: Yield Optimization
- Testing substrate combinations
- Analyzing growth patterns
- AI-driven recommendations

### Project Beta: Contamination Prevention
- Developing detection algorithms
- Improving sterilization protocols
- Environmental monitoring systems
`,
    lastModified: new Date(),
    isDirty: false
  }
];

export function useIDEState() {
  const [state, setState] = useState<IDEState>({
    files: initialFiles,
    tabs: [
      {
        id: 'tab-1',
        name: 'cultivation-protocol.py',
        type: 'editor',
        fileId: 'file-1',
        isDirty: false,
        isActive: true
      }
    ],
    activeTabId: 'tab-1',
    
    leftPanel: {
      isCollapsed: false,
      width: 320,
      activeTab: 'files'
    },
    rightPanel: {
      isCollapsed: false,
      width: 350,
      activeTab: 'suggestions'
    },
    bottomPanel: {
      isCollapsed: false,
      height: 200,
      activeTab: 'terminal'
    },
    
    terminalLines: [
      {
        id: 'term-1',
        content: '🍄 Crowe Logic™ Cultivation Terminal v3.0.0',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: 'term-2', 
        content: 'Professional Mycology Research & Development Platform',
        type: 'system',
        timestamp: new Date()
      },
      {
        id: 'term-3',
        content: 'Database connected ✓ | AI Coder ready ✓ | Type "help" for commands',
        type: 'system',
        timestamp: new Date()
      }
    ],
    terminalInput: '',
    
    aiMessages: [
      {
        id: 'ai-1',
        role: 'assistant',
        content: 'Hello! I\'m Crowe Logic AI Coder, your intelligent research assistant. I specialize in mycology protocols, data analysis, and cultivation optimization. I can help you:\n\n• Write Python scripts for data analysis\n• Generate SOPs and protocols\n• Optimize cultivation parameters\n• Debug and improve your code\n• Create visualizations and reports\n\nHow can I assist your research today?',
        timestamp: new Date(),
        type: 'text'
      }
    ],
    aiInput: '',
    isAILoading: false,
    codeSuggestions: [],
    
    theme: 'dark',
    
    dbStatus: {
      connected: true,
      lastSync: new Date(),
      filesSaved: initialFiles.length
    }
  });

  // File operations
  const createFile = useCallback((name: string, type: 'python' | 'markdown' | 'json' | 'typescript' | 'text', parentPath: string = '/') => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      language: type,
      path: `${parentPath}${name}`,
      content: '',
      lastModified: new Date(),
      isDirty: true,
      isActive: false
    };

    setState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      dbStatus: { ...prev.dbStatus, filesSaved: prev.dbStatus.filesSaved + 1 }
    }));

    return newFile.id;
  }, []);

  const saveFile = useCallback((fileId: string, content: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.id === fileId 
          ? { ...file, content, lastModified: new Date(), isDirty: false }
          : file
      ),
      tabs: prev.tabs.map(tab =>
        tab.fileId === fileId
          ? { ...tab, isDirty: false }
          : tab
      ),
      dbStatus: { ...prev.dbStatus, lastSync: new Date() }
    }));

    // Simulate saving to localStorage
    try {
      localStorage.setItem(`crowe-file-${fileId}`, JSON.stringify({
        id: fileId,
        content,
        lastModified: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, []);

  const openFile = useCallback((fileId: string) => {
    const file = state.files.find(f => f.id === fileId);
    if (!file || file.type !== 'file') return;

    const existingTab = state.tabs.find(tab => tab.fileId === fileId);
    if (existingTab) {
      setState(prev => ({
        ...prev,
        activeTabId: existingTab.id,
        tabs: prev.tabs.map(tab => ({ ...tab, isActive: tab.id === existingTab.id }))
      }));
      return;
    }

    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      name: file.name,
      type: 'editor',
      fileId: file.id,
      isDirty: false,
      isActive: true
    };

    setState(prev => ({
      ...prev,
      tabs: [...prev.tabs.map(tab => ({ ...tab, isActive: false })), newTab],
      activeTabId: newTab.id
    }));
  }, [state.files]);

  const closeTab = useCallback((tabId: string) => {
    setState(prev => {
      const tabIndex = prev.tabs.findIndex(tab => tab.id === tabId);
      const filteredTabs = prev.tabs.filter(tab => tab.id !== tabId);
      
      let newActiveTabId = prev.activeTabId;
      if (prev.activeTabId === tabId) {
        if (filteredTabs.length > 0) {
          const newActiveIndex = Math.min(tabIndex, filteredTabs.length - 1);
          newActiveTabId = filteredTabs[newActiveIndex].id;
          filteredTabs[newActiveIndex].isActive = true;
        } else {
          newActiveTabId = null;
        }
      }

      return {
        ...prev,
        tabs: filteredTabs,
        activeTabId: newActiveTabId
      };
    });
  }, []);

  // Terminal operations
  const executeCommand = useCallback((command: string) => {
    const newInputLine: TerminalLine = {
      id: `term-input-${Date.now()}`,
      content: `$ ${command}`,
      type: 'input',
      timestamp: new Date()
    };

    let outputContent = '';
    let outputType: 'output' | 'error' = 'output';

    // AI-powered command processing
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      outputContent = `Crowe Logic™ Cultivation Commands:
  analyze-batch <id>         Analyze cultivation batch performance
  create-protocol <type>     Generate new cultivation protocol
  monitor-env               Check environmental conditions
  contamination-scan        Run AI contamination detection
  yield-forecast <species>  Predict harvest yields
  sop-generate <protocol>   Create standard operating procedure
  data-export <format>      Export research data
  ai-suggest <topic>        Get AI recommendations
  
System Commands:
  ls, pwd, python, git, clear, help`;
    } else if (cmd.startsWith('analyze-batch')) {
      const batchId = cmd.split(' ')[1] || 'CL-20250714-001';
      outputContent = `📊 Analyzing batch ${batchId}...

Batch Analysis Report:
├── Species: Pleurotus ostreatus (Oyster Mushroom)
├── Day: 8/14 (Colonization phase)
├── Optimization Score: 0.87/1.00 ⭐
├── Temperature Stability: ±1.2°C (Excellent)
├── Humidity Control: 86% avg (Optimal)
├── Contamination Risk: Low (0.02% probability)
└── Expected Yield: 18.2% BE (Above average)

💡 AI Recommendations:
  • Maintain current conditions - excellent progress
  • Consider harvesting in 6-7 days
  • Prepare second flush environment`;
    } else if (cmd.startsWith('create-protocol')) {
      const protocolType = cmd.split(' ')[1] || 'oyster';
      outputContent = `🧬 Generating ${protocolType} cultivation protocol...

✅ Protocol generated: ${protocolType}-cultivation-sop.md
   • Substrate preparation steps
   • Sterilization procedures  
   • Inoculation guidelines
   • Environmental parameters
   • Quality checkpoints
   • Harvest optimization

📁 Saved to /protocols/ directory
🤖 AI optimization suggestions included`;
    } else if (cmd === 'monitor-env') {
      outputContent = `🌡️ Environmental Monitoring System Status:

Laboratory Conditions:
├── Temperature: 21.8°C (Target: 20-24°C) ✅
├── Humidity: 84% (Target: 80-90%) ✅
├── CO₂ Level: 420 ppm (Normal) ✅
├── Air Pressure: +2.1 Pa (Positive) ✅
└── HEPA Filter: 99.97% efficiency ✅

Cultivation Zones:
├── Zone A: 3 batches, all healthy
├── Zone B: 2 batches, 1 ready for fruiting
└── Zone C: 1 batch, early colonization

🔄 Auto-monitoring: Active
📡 Next sensor calibration: 2 days`;
    } else if (cmd === 'contamination-scan') {
      outputContent = `🔬 AI Contamination Detection Scan...

Analyzing cultivation environments...
├── Image processing: Complete
├── Spectral analysis: Complete  
├── Pattern recognition: Complete
└── Threat assessment: Complete

Results:
✅ Zone A: No contamination detected
✅ Zone B: No contamination detected  
⚠️  Zone C: Minor bacterial signature (0.1% risk)
   Recommendation: Increase ventilation in Zone C

Overall Lab Status: CLEAN
Next automated scan: 4 hours`;
    } else if (cmd.startsWith('yield-forecast')) {
      const species = cmd.split(' ').slice(1).join(' ') || 'oyster mushrooms';
      outputContent = `📈 AI Yield Forecasting for ${species}...

Model: Crowe Logic™ Predictive Analytics v2.1
Training Data: 1,847 historical batches

Forecast Results:
├── Expected Biological Efficiency: 16.8% ± 2.1%
├── Harvest Window: Days 12-15 (optimal: day 14)
├── Quality Grade Distribution:
│   ├── Grade A: 78% (premium quality)
│   ├── Grade B: 19% (commercial grade)  
│   └── Grade C: 3% (processing grade)
└── Market Value: $4.20/lb estimated

🎯 Confidence Level: 91.3%
📊 Based on current environmental conditions`;
    } else if (cmd.startsWith('sop-generate')) {
      const protocol = cmd.split(' ')[1] || 'sterilization';
      outputContent = `📋 Generating SOP for ${protocol}...

SOP Generation Complete:
✅ Document structure created
✅ Procedure steps defined
✅ Quality checkpoints added
✅ Safety requirements included
✅ Compliance standards verified
✅ AI optimization notes appended

📄 Document: ${protocol}-sop-v2.1.md
🗂️ Location: /protocols/
📅 Review Date: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
    } else if (cmd.startsWith('ai-suggest')) {
      const topic = cmd.split(' ').slice(1).join(' ') || 'optimization';
      outputContent = `🤖 AI Suggestions for ${topic}:

Based on your current research data and cultivation patterns:

1. 🎯 Substrate Optimization
   • Try 15% wheat bran supplement for 12% yield increase
   • Consider pH adjustment to 6.2-6.8 range

2. 🌡️ Environmental Tuning  
   • Implement gradual temperature ramping for better pinning
   • Add CO₂ monitoring for optimization opportunities

3. 📊 Data Collection Enhancement
   • Install additional humidity sensors for microclimate mapping
   • Implement time-lapse photography for growth analysis

4. 🔬 Research Opportunities
   • Test new Pleurotus strain varieties
   • Explore bioactive compound extraction methods

💡 Priority: Focus on environmental consistency for 15% yield improvement`;
    } else if (cmd === 'ls') {
      outputContent = `cultivation-protocol.py
research-notes.md
protocols/
  sterilization-sop.md
  cultivation-checklist.json
data/
  batch-logs/
  environmental-records/
  harvest-reports/`;
    } else if (cmd === 'pwd') {
      outputContent = `/lab/crowe-logic/cultivation-workspace`;
    } else if (cmd.startsWith('python')) {
      outputContent = `Python 3.11.5 (Crowe Logic Research Environment)
AI-Enhanced Mycology Research Platform
>>> from crowe_logic import CultivationManager
>>> manager = CultivationManager()
>>> print("Cultivation system ready for research!")
Cultivation system ready for research!
>>>`;
    } else if (cmd === 'clear') {
      setState(prev => ({
        ...prev,
        terminalLines: []
      }));
      return;
    } else {
      outputContent = `Command '${command}' not recognized. Type 'help' for available commands.`;
      outputType = 'error';
    }

    const outputLine: TerminalLine = {
      id: `term-output-${Date.now()}`,
      content: outputContent,
      type: outputType,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      terminalLines: [...prev.terminalLines, newInputLine, outputLine],
      terminalInput: ''
    }));
  }, []);

  // AI operations
  const sendAIMessage = useCallback(async (message: string) => {
    const userMessage: AIMessage = {
      id: `ai-msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setState(prev => ({
      ...prev,
      aiMessages: [...prev.aiMessages, userMessage],
      aiInput: '',
      isAILoading: true
    }));

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setState(prev => ({
        ...prev,
        aiMessages: [...prev.aiMessages, aiResponse],
        isAILoading: false,
        codeSuggestions: message.toLowerCase().includes('code') || message.toLowerCase().includes('help') 
          ? generateCodeSuggestions(message) 
          : prev.codeSuggestions
      }));
    }, 1000 + Math.random() * 2000);
  }, []);

  const generateAIResponse = (input: string): AIMessage => {
    const lowerInput = input.toLowerCase();
    let content = '';
    let type: 'code' | 'text' = 'text';

    if (lowerInput.includes('protocol') || lowerInput.includes('sop')) {
      content = `I'll help you create comprehensive cultivation protocols! Here's a Python framework for protocol management:

\`\`\`python
class CultivationProtocol:
    def __init__(self, species: str, substrate: str):
        self.species = species
        self.substrate = substrate
        self.phases = self._initialize_phases()
        
    def _initialize_phases(self):
        return {
            'preparation': {
                'duration': 1,
                'temperature': 'ambient', 
                'tasks': ['sterilize', 'hydrate', 'package']
            },
            'inoculation': {
                'duration': 1,
                'temperature': '20-24°C',
                'tasks': ['cool_substrate', 'add_spawn', 'mix', 'seal']
            },
            'colonization': {
                'duration': 10,
                'temperature': '20-22°C', 
                'humidity': '80-85%',
                'tasks': ['monitor', 'document', 'assess']
            }
        }
        
    def generate_sop(self):
        # Auto-generate standardized operating procedure
        pass
\`\`\`

Would you like me to help you customize this for a specific species or create a complete SOP document?`;
      type = 'code';
    } else if (lowerInput.includes('analyze') || lowerInput.includes('data')) {
      content = `I'll help you with mycology data analysis! Here's a comprehensive analysis framework:

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

class MycoDataAnalyzer:
    def __init__(self, data_source):
        self.data = self._load_data(data_source)
        
    def analyze_growth_patterns(self):
        # Growth rate analysis
        growth_rate = self.data['size'].diff().mean()
        
        # Environmental correlation
        temp_correlation = stats.pearsonr(
            self.data['temperature'], 
            self.data['growth_rate']
        )[0]
        
        return {
            'avg_growth_rate': growth_rate,
            'temp_correlation': temp_correlation,
            'optimal_conditions': self._find_optimal_conditions(),
            'yield_prediction': self._predict_yield()
        }
        
    def contamination_risk_assessment(self):
        # AI-powered contamination prediction
        risk_factors = [
            'humidity_variance',
            'temperature_stability', 
            'air_quality_index'
        ]
        
        return self._calculate_risk_score(risk_factors)
\`\`\`

This framework can analyze growth patterns, environmental correlations, and predict contamination risks. What specific analysis would you like to focus on?`;
      type = 'code';
    } else if (lowerInput.includes('optimization') || lowerInput.includes('improve')) {
      content = `I'll help you optimize your cultivation process! Based on analysis of successful cultivation patterns, here are key optimization strategies:

**Environmental Optimization:**
• Temperature stability (±1°C) increases yield by 15-20%
• Humidity gradients during fruiting improve pin formation
• CO₂ management during colonization reduces contamination by 40%

**Substrate Enhancement:**
• pH buffering to 6.2-6.8 range optimizes nutrient availability
• Supplement ratios: 10-15% wheat bran, 1-2% gypsum
• Particle size optimization improves mycelium penetration

**Process Improvements:**
• Staged inoculation reduces shock and improves colonization
• Temperature ramping for fruiting initiation
• Harvest timing optimization based on cap morphology

**AI-Powered Monitoring:**
• Computer vision for early contamination detection
• Predictive models for optimal harvest timing
• Environmental sensor networks for microclimate control

Would you like me to create specific optimization protocols for your current batches or help implement monitoring systems?`;
    } else if (lowerInput.includes('contamination') || lowerInput.includes('sterile')) {
      content = `Contamination prevention is critical for successful cultivation! Here's my analysis and recommendations:

**Common Contamination Sources:**
1. **Bacterial** (60% of issues)
   - Causes: Poor sterilization, moisture excess
   - Prevention: Autoclave 121°C for 90+ minutes

2. **Mold** (35% of issues)  
   - Trichoderma, Aspergillus, Penicillium
   - Prevention: HEPA filtration, positive pressure

3. **Yeast** (5% of issues)
   - Rapid pH changes, off-odors
   - Prevention: pH monitoring, sterile technique

**AI Detection System:**
I can help you implement computer vision for early detection:
- Color analysis for mold identification
- Growth pattern recognition
- Automated alerts for intervention

**Sterilization Protocol Optimization:**
- Steam penetration testing
- Biological indicator validation
- Environmental monitoring integration

Would you like me to create a contamination prevention protocol or help you implement AI detection systems?`;
    } else {
      content = `I'm here to help with your mycology research and development! I can assist with:

🧬 **Protocol Development**
• Create SOPs for cultivation, sterilization, and harvest
• Optimize environmental parameters
• Design experimental workflows

📊 **Data Analysis** 
• Growth pattern analysis and yield optimization
• Environmental correlation studies
• Statistical analysis of cultivation outcomes

🤖 **AI Integration**
• Contamination detection systems
• Predictive yield modeling
• Automated monitoring solutions

🔬 **Research Support**
• Literature review and citation management
• Experimental design and statistical planning
• Quality control and validation protocols

💻 **Code Development**
• Python scripts for data processing
• Database design for cultivation records
• Automation and IoT integration

What aspect of your mycology research would you like to focus on today?`;
    }

    return {
      id: `ai-response-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      type
    };
  };

  const generateCodeSuggestions = (input: string): AICodeSuggestion[] => {
    return [
      {
        id: 'suggestion-1',
        code: `def monitor_environmental_conditions():
    """Real-time environmental monitoring with AI alerts"""
    sensors = {
        'temperature': get_temperature_reading(),
        'humidity': get_humidity_reading(),
        'co2': get_co2_reading()
    }
    
    # AI-powered anomaly detection
    if sensors['temperature'] < 18 or sensors['temperature'] > 26:
        send_alert("Temperature out of optimal range")
    
    # Log to database
    log_environmental_data(sensors)
    return sensors`,
        description: "Environmental monitoring with AI alerts",
        language: 'python',
        confidence: 0.94,
        category: 'optimization'
      },
      {
        id: 'suggestion-2',
        code: `class ContaminationDetector:
    """AI-powered contamination detection system"""
    
    def __init__(self):
        self.model = load_vision_model('contamination_v2.1')
        self.threshold = 0.85
        
    def analyze_cultivation_image(self, image_path):
        image = preprocess_image(image_path)
        prediction = self.model.predict(image)
        
        contamination_types = {
            'trichoderma': prediction[0],
            'bacterial': prediction[1], 
            'aspergillus': prediction[2]
        }
        
        max_risk = max(contamination_types.values())
        if max_risk > self.threshold:
            return {
                'contamination_detected': True,
                'type': max(contamination_types, key=contamination_types.get),
                'confidence': max_risk
            }
        
        return {'contamination_detected': False}`,
        description: "AI contamination detection system",
        language: 'python', 
        confidence: 0.91,
        category: 'enhancement'
      }
    ];
  };

  // Panel operations
  const togglePanel = useCallback((panel: 'left' | 'right' | 'bottom') => {
    setState(prev => {
      const panelKey = `${panel}Panel` as 'leftPanel' | 'rightPanel' | 'bottomPanel';
      const currentPanel = prev[panelKey];
      
      if (typeof currentPanel === 'object' && currentPanel !== null && 'isCollapsed' in currentPanel) {
        return {
          ...prev,
          [panelKey]: {
            ...currentPanel,
            isCollapsed: !currentPanel.isCollapsed
          }
        };
      }
      return prev;
    });
  }, []);

  const setPanelTab = useCallback((panel: 'left' | 'right' | 'bottom', tab: string) => {
    setState(prev => {
      const panelKey = `${panel}Panel` as 'leftPanel' | 'rightPanel' | 'bottomPanel';
      const currentPanel = prev[panelKey];
      
      if (typeof currentPanel === 'object' && currentPanel !== null && 'activeTab' in currentPanel) {
        return {
          ...prev,
          [panelKey]: {
            ...currentPanel,
            activeTab: tab
          }
        };
      }
      return prev;
    });
  }, []);

  return {
    state,
    setState,
    
    // File operations
    createFile,
    saveFile,
    openFile,
    closeTab,
    
    // Terminal operations
    executeCommand,
    
    // AI operations
    sendAIMessage,
    
    // Panel operations
    togglePanel,
    setPanelTab
  };
}
