
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Save,
  Search,
  Settings,
  Bell,
  User,
  Sprout,
  Droplets,
  Thermometer,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  Download,
  Upload,
  Calendar as CalendarIcon,
  Activity,
  Brain,
  MessageSquare,
  Microscope,
  FlaskConical,
  Database,
  Camera,
  BarChart3,
  Zap,
  Shield,
  BookOpen,
  FileIcon,
  Code,
  Terminal,
  Cpu,
  Beaker,
  Eye,
  Target,
  Wind,
  Sun,
  CloudRain,
  Leaf,
  Bug,
  Calculator,
  PieChart,
  MapPin,
  QrCode,
  Printer,
  Mail,
  Phone,
  Globe,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CroweLogo } from '@/components/crowe-logo';

interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  days: DayData[];
}

interface DayData {
  dayName: string;
  date: string;
  departments: DepartmentTemplate[];
}

interface DepartmentTemplate {
  name: string;
  icon: React.ReactNode;
  color: string;
  tasks: TaskTemplate[];
  metrics: MetricTemplate[];
}

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo?: string;
}

interface MetricTemplate {
  name: string;
  unit: string;
  target?: number;
  actual?: number;
  notes?: string;
}

interface StrainData {
  id: string;
  name: string;
  species: string;
  generation: number;
  source: string;
  healthScore: number;
  lastInspection: string;
  notes: string;
}

interface EnvironmentalAlert {
  id: string;
  type: 'temperature' | 'humidity' | 'co2' | 'contamination' | 'equipment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  location: string;
}

interface HarvestRecord {
  id: string;
  strainId: string;
  weight: number;
  grade: 'A' | 'B' | 'C';
  moistureContent: number;
  contamination: boolean;
  flushNumber: number;
  harvestDate: string;
  photos: string[];
}

interface ProtocolTemplate {
  id: string;
  name: string;
  type: 'sterilization' | 'inoculation' | 'incubation' | 'fruiting' | 'harvest';
  steps: string[];
  duration: string;
  temperature: number;
  humidity: number;
  equipment: string[];
  safetyNotes: string[];
}

interface AIGeneratedFile {
  id: string;
  name: string;
  type: 'protocol' | 'report' | 'sop' | 'analysis' | 'checklist';
  content: string;
  prompt: string;
  generatedAt: string;
  department: string;
}

const DEPARTMENTS: DepartmentTemplate[] = [
  {
    name: 'Strain Management',
    icon: <Microscope className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-800',
    tasks: [
      { id: '1', title: 'Strain Health Assessment', description: 'Evaluate strain viability and genetic stability', priority: 'High', estimatedTime: '1 hour', status: 'Pending' },
      { id: '2', title: 'Culture Maintenance', description: 'Transfer cultures and maintain master stocks', priority: 'High', estimatedTime: '2 hours', status: 'Pending' },
      { id: '3', title: 'Genetic Documentation', description: 'Update strain genealogy and characteristics', priority: 'Medium', estimatedTime: '45 min', status: 'Pending' },
      { id: '4', title: 'Contamination Screening', description: 'Screen cultures for bacterial/mold contamination', priority: 'High', estimatedTime: '30 min', status: 'Pending' }
    ],
    metrics: [
      { name: 'Active Strains', unit: 'count' },
      { name: 'Contamination Rate', unit: '%', target: 2 },
      { name: 'Strain Viability', unit: '%', target: 95 },
      { name: 'Generation Number', unit: 'avg', target: 8 }
    ]
  },
  {
    name: 'Substrate Production',
    icon: <Beaker className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800',
    tasks: [
      { id: '5', title: 'Substrate Formulation', description: 'Mix and prepare growing substrates', priority: 'High', estimatedTime: '3 hours', status: 'Pending' },
      { id: '6', title: 'Sterilization Cycle', description: 'Autoclave substrate batches', priority: 'High', estimatedTime: '4 hours', status: 'Pending' },
      { id: '7', title: 'pH & Moisture Testing', description: 'Test substrate chemistry and moisture content', priority: 'Medium', estimatedTime: '30 min', status: 'Pending' },
      { id: '8', title: 'Substrate Inventory', description: 'Track raw materials and finished substrate', priority: 'Low', estimatedTime: '20 min', status: 'Pending' }
    ],
    metrics: [
      { name: 'Substrate pH', unit: 'pH', target: 6.5 },
      { name: 'Moisture Content', unit: '%', target: 65 },
      { name: 'Sterilization Success', unit: '%', target: 99 },
      { name: 'Bags Produced', unit: 'count' }
    ]
  },
  {
    name: 'Inoculation & Incubation',
    icon: <Sprout className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800',
    tasks: [
      { id: '9', title: 'Sterile Inoculation', description: 'Inoculate substrates with selected strains', priority: 'High', estimatedTime: '2 hours', status: 'Pending' },
      { id: '10', title: 'Incubation Monitoring', description: 'Monitor colonization progress and conditions', priority: 'High', estimatedTime: '1 hour', status: 'Pending' },
      { id: '11', title: 'Contamination Inspection', description: 'Daily visual inspection for contamination', priority: 'High', estimatedTime: '45 min', status: 'Pending' },
      { id: '12', title: 'Growth Rate Documentation', description: 'Measure and record mycelium growth rates', priority: 'Medium', estimatedTime: '30 min', status: 'Pending' }
    ],
    metrics: [
      { name: 'Colonization Rate', unit: '%/day', target: 15 },
      { name: 'Contamination Rate', unit: '%', target: 3 },
      { name: 'Incubation Temperature', unit: '°F', target: 75 },
      { name: 'Success Rate', unit: '%', target: 90 }
    ]
  },
  {
    name: 'Fruiting & Harvesting',
    icon: <Package className="h-4 w-4" />,
    color: 'bg-orange-100 text-orange-800',
    tasks: [
      { id: '13', title: 'Fruiting Initiation', description: 'Trigger fruiting conditions for mature substrates', priority: 'High', estimatedTime: '1 hour', status: 'Pending' },
      { id: '14', title: 'Daily Harvest', description: 'Harvest mature mushrooms at optimal size', priority: 'High', estimatedTime: '3 hours', status: 'Pending' },
      { id: '15', title: 'Quality Grading', description: 'Grade harvested mushrooms by quality standards', priority: 'High', estimatedTime: '1 hour', status: 'Pending' },
      { id: '16', title: 'Yield Documentation', description: 'Record weights, flush numbers, and biology data', priority: 'Medium', estimatedTime: '30 min', status: 'Pending' }
    ],
    metrics: [
      { name: 'Daily Yield', unit: 'lbs' },
      { name: 'Grade A Percentage', unit: '%', target: 80 },
      { name: 'Biological Efficiency', unit: '%', target: 100 },
      { name: 'Flush Count', unit: 'avg', target: 3 }
    ]
  },
  {
    name: 'Environmental Systems',
    icon: <Thermometer className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-800',
    tasks: [
      { id: '17', title: 'HVAC System Check', description: 'Inspect and maintain climate control systems', priority: 'Medium', estimatedTime: '1 hour', status: 'Pending' },
      { id: '18', title: 'Sensor Calibration', description: 'Calibrate temperature, humidity, and CO2 sensors', priority: 'Low', estimatedTime: '45 min', status: 'Pending' },
      { id: '19', title: 'Air Quality Monitoring', description: 'Monitor air flow, filtration, and contamination', priority: 'Medium', estimatedTime: '30 min', status: 'Pending' },
      { id: '20', title: 'Energy Optimization', description: 'Review and optimize energy usage patterns', priority: 'Low', estimatedTime: '20 min', status: 'Pending' }
    ],
    metrics: [
      { name: 'Temperature', unit: '°F', target: 75 },
      { name: 'Humidity', unit: '%', target: 85 },
      { name: 'CO2 Levels', unit: 'ppm', target: 1000 },
      { name: 'Air Changes/Hour', unit: 'ACH', target: 6 }
    ]
  },
  {
    name: 'Quality & Compliance',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-800',
    tasks: [
      { id: '21', title: 'HACCP Documentation', description: 'Complete daily HACCP monitoring records', priority: 'High', estimatedTime: '45 min', status: 'Pending' },
      { id: '22', title: 'Microbiological Testing', description: 'Collect samples for lab analysis', priority: 'Medium', estimatedTime: '30 min', status: 'Pending' },
      { id: '23', title: 'Traceability Records', description: 'Update batch tracking and traceability data', priority: 'Medium', estimatedTime: '20 min', status: 'Pending' },
      { id: '24', title: 'Audit Preparation', description: 'Prepare documentation for compliance audits', priority: 'Low', estimatedTime: '1 hour', status: 'Pending' }
    ],
    metrics: [
      { name: 'Compliance Score', unit: '%', target: 100 },
      { name: 'Test Pass Rate', unit: '%', target: 95 },
      { name: 'Documentation Complete', unit: '%', target: 100 },
      { name: 'Audit Readiness', unit: '/10', target: 9 }
    ]
  },
  {
    name: 'Production Analytics',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'bg-pink-100 text-pink-800',
    tasks: [
      { id: '25', title: 'Yield Analysis', description: 'Analyze production efficiency and yield trends', priority: 'Medium', estimatedTime: '1 hour', status: 'Pending' },
      { id: '26', title: 'Cost Calculation', description: 'Calculate cost per pound and profit margins', priority: 'Medium', estimatedTime: '45 min', status: 'Pending' },
      { id: '27', title: 'Performance Reports', description: 'Generate daily performance dashboards', priority: 'Low', estimatedTime: '30 min', status: 'Pending' },
      { id: '28', title: 'Predictive Modeling', description: 'Update forecasting models for production planning', priority: 'Low', estimatedTime: '1 hour', status: 'Pending' }
    ],
    metrics: [
      { name: 'Production Efficiency', unit: '%', target: 85 },
      { name: 'Cost per Pound', unit: '$', target: 3.50 },
      { name: 'Profit Margin', unit: '%', target: 40 },
      { name: 'Waste Percentage', unit: '%', target: 5 }
    ]
  }
];

export default function MycologicalManagementIDE() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Strain Management');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'metrics' | 'notes' | 'ai-assistant' | 'protocols' | 'alerts'>('tasks');
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [dailyNotes, setDailyNotes] = useState<{[key: string]: string}>({});
  const [taskUpdates, setTaskUpdates] = useState<{[key: string]: Partial<TaskTemplate>}>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<AIGeneratedFile[]>([]);
  const [environmentalAlerts, setEnvironmentalAlerts] = useState<EnvironmentalAlert[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);

  // Save data to localStorage
  const saveData = () => {
    try {
      localStorage.setItem('mycologicalManagement_notes', JSON.stringify(dailyNotes));
      localStorage.setItem('mycologicalManagement_tasks', JSON.stringify(taskUpdates));
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Failed to save data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  // Load data from localStorage
  const loadData = () => {
    try {
      const savedNotes = localStorage.getItem('mycologicalManagement_notes');
      const savedTasks = localStorage.getItem('mycologicalManagement_tasks');
      
      if (savedNotes) {
        setDailyNotes(JSON.parse(savedNotes));
      }
      if (savedTasks) {
        setTaskUpdates(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Export data as JSON
  const exportData = () => {
    const exportData = {
      weekData,
      dailyNotes,
      taskUpdates,
      exportDate: new Date().toISOString(),
      selectedWeek,
      selectedDay,
      selectedDepartment
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mycological-management-week-${selectedWeek}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Update task status
  const updateTaskStatus = (taskId: string, updates: Partial<TaskTemplate>) => {
    setTaskUpdates(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates }
    }));
  };

  // Get notes key for current day
  const getNotesKey = () => {
    return `week-${selectedWeek}-${selectedDay}-${selectedDepartment}`;
  };

  // Generate file using AI
  const generateAIFile = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFile: AIGeneratedFile = {
        id: Date.now().toString(),
        name: `AI-Generated-${Date.now()}`,
        type: 'protocol',
        content: generateAIContent(aiPrompt),
        prompt: aiPrompt,
        generatedAt: new Date().toISOString(),
        department: selectedDepartment
      };
      
      setGeneratedFiles(prev => [newFile, ...prev]);
      setAiPrompt('');
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Generate AI content based on prompt
  const generateAIContent = (prompt: string): string => {
    const context = `Department: ${selectedDepartment}\nWeek: ${selectedWeek}\nDay: ${selectedDay}\n\n`;
    
    if (prompt.toLowerCase().includes('protocol') || prompt.toLowerCase().includes('sop')) {
      return context + `# Standard Operating Procedure\n\n## Objective\n${prompt}\n\n## Materials Needed\n- Sterile gloves\n- Disinfectant solution\n- Monitoring equipment\n- Documentation forms\n\n## Procedure\n1. **Preparation Phase**\n   - Sanitize work area\n   - Gather required materials\n   - Review safety protocols\n\n2. **Execution Phase**\n   - Follow standardized procedures\n   - Monitor environmental conditions\n   - Document observations\n\n3. **Completion Phase**\n   - Clean and sanitize equipment\n   - Complete documentation\n   - Store materials properly\n\n## Quality Control\n- Visual inspection required\n- Temperature/humidity verification\n- Contamination assessment\n\n## Safety Notes\n- Always wear appropriate PPE\n- Follow contamination prevention protocols\n- Report any anomalies immediately\n\n---\nGenerated by Crowe Logic AI for ${selectedDepartment}`;
    }
    
    if (prompt.toLowerCase().includes('checklist')) {
      return context + `# Daily Checklist\n\n## Pre-Shift Inspection\n☐ Review previous shift notes\n☐ Check environmental conditions\n☐ Verify equipment status\n☐ Inventory critical supplies\n\n## During Shift\n☐ Monitor temperature/humidity\n☐ Inspect for contamination\n☐ Document all observations\n☐ Complete assigned tasks\n\n## End of Shift\n☐ Clean work areas\n☐ Update production logs\n☐ Prepare handoff notes\n☐ Secure materials\n\n---\nGenerated by Crowe Logic AI`;
    }
    
    return context + `# AI-Generated Content\n\n${prompt}\n\nThis content was generated based on your request for ${selectedDepartment} operations.\n\n## Key Points\n- Customized for current department and timing\n- Based on mycology best practices\n- Includes safety and quality considerations\n\n---\nGenerated by Crowe Logic AI`;
  };

  // Initialize sample environmental alerts
  useEffect(() => {
    const sampleAlerts: EnvironmentalAlert[] = [
      {
        id: '1',
        type: 'temperature',
        severity: 'medium',
        message: 'Incubation room temperature 2°F above target (77°F)',
        timestamp: new Date().toISOString(),
        resolved: false,
        location: 'Incubation Room A'
      },
      {
        id: '2',
        type: 'humidity',
        severity: 'low',
        message: 'Fruiting chamber humidity slightly low (82%)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolved: false,
        location: 'Fruiting Chamber 2'
      },
      {
        id: '3',
        type: 'contamination',
        severity: 'high',
        message: 'Possible contamination detected in Batch #247',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        location: 'Substrate Room'
      }
    ];
    setEnvironmentalAlerts(sampleAlerts);
  }, []);

  // Generate 52 weeks of data
  useEffect(() => {
    const generateWeekData = (): WeekData[] => {
      const weeks: WeekData[] = [];
      const startOfYear = new Date(2025, 0, 1); // January 1, 2025
      
      for (let week = 1; week <= 52; week++) {
        const weekStart = new Date(startOfYear);
        weekStart.setDate(startOfYear.getDate() + (week - 1) * 7);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        // Determine season
        const month = weekStart.getMonth();
        let season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
        if (month >= 2 && month <= 4) season = 'Spring';
        else if (month >= 5 && month <= 7) season = 'Summer';
        else if (month >= 8 && month <= 10) season = 'Fall';
        else season = 'Winter';
        
        const days: DayData[] = [];
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        dayNames.forEach((dayName, index) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + index);
          
          days.push({
            dayName,
            date: dayDate.toISOString().split('T')[0],
            departments: DEPARTMENTS
          });
        });
        
        weeks.push({
          weekNumber: week,
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd.toISOString().split('T')[0],
          season,
          days
        });
      }
      
      return weeks;
    };
    
    setWeekData(generateWeekData());
    loadData(); // Load saved data when component mounts
  }, []);

  const toggleWeekExpanded = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const getCurrentWeekData = () => {
    return weekData.find(w => w.weekNumber === selectedWeek);
  };

  const getCurrentDayData = () => {
    const week = getCurrentWeekData();
    return week?.days.find(d => d.dayName === selectedDay);
  };

  const getCurrentDepartment = () => {
    const day = getCurrentDayData();
    return day?.departments.find(d => d.name === selectedDepartment);
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'Spring': return 'text-green-600';
      case 'Summer': return 'text-yellow-600';
      case 'Fall': return 'text-orange-600';
      case 'Winter': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWeeks = weekData.filter(week => 
    searchTerm === '' || 
    week.weekNumber.toString().includes(searchTerm) ||
    week.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <CroweLogo size="sm" variant="official-circle" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900">Mycological Management IDE</h1>
            <p className="text-xs text-gray-500">52-Week Mushroom Production & Tracking System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Week {selectedWeek} - {getCurrentWeekData()?.season}
          </Badge>
          {environmentalAlerts.filter(a => !a.resolved).length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {environmentalAlerts.filter(a => !a.resolved).length} Alerts
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAIChat(!showAIChat)}
            className="text-purple-600 hover:text-purple-800"
          >
            <Brain className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - 52 Week Calendar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">52-Week Calendar</h2>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search weeks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredWeeks.map((week) => (
                <div key={week.weekNumber} className="mb-1">
                  <button
                    onClick={() => toggleWeekExpanded(week.weekNumber)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedWeeks.has(week.weekNumber) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Week {week.weekNumber}</span>
                    </div>
                    <span className={`text-xs font-medium ${getSeasonColor(week.season)}`}>
                      {week.season}
                    </span>
                  </button>
                  
                  {expandedWeeks.has(week.weekNumber) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {week.days.map((day) => (
                        <button
                          key={day.dayName}
                          onClick={() => {
                            setSelectedWeek(week.weekNumber);
                            setSelectedDay(day.dayName);
                          }}
                          className={`w-full flex items-center space-x-2 p-2 rounded text-left transition-colors ${
                            selectedWeek === week.weekNumber && selectedDay === day.dayName
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{day.dayName}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Day Header */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDay}, Week {selectedWeek}
                </h2>
                <p className="text-sm text-gray-500">
                  {getCurrentDayData()?.date && new Date(getCurrentDayData()!.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Badge className={`${getSeasonColor(getCurrentWeekData()?.season || '')}`}>
                {getCurrentWeekData()?.season}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={saveData}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Department Tabs */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6 overflow-x-auto">
            <div className="flex space-x-1">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => setSelectedDepartment(dept.name)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedDepartment === dept.name
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {dept.icon}
                  <span>{dept.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Department Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto">
              {/* Content Tabs */}
              <div className="h-10 bg-white border-b border-gray-200 flex items-center px-6">
                <div className="flex space-x-4">
                  {['tasks', 'metrics', 'protocols', 'ai-assistant', 'alerts', 'notes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`text-sm font-medium capitalize transition-colors flex items-center space-x-1 ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'ai-assistant' && <Brain className="h-3 w-3" />}
                      {tab === 'alerts' && <AlertTriangle className="h-3 w-3" />}
                      {tab === 'protocols' && <BookOpen className="h-3 w-3" />}
                      <span>{tab.replace('-', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedDepartment} Tasks
                      </h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {getCurrentDepartment()?.tasks.map((task) => {
                        const updates = taskUpdates[task.id] || {};
                        const currentTask = { ...task, ...updates };
                        
                        return (
                          <Card key={task.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{currentTask.title}</h4>
                                  <Badge className={getPriorityColor(currentTask.priority)}>
                                    {currentTask.priority}
                                  </Badge>
                                  <select 
                                    value={currentTask.status}
                                    onChange={(e) => updateTaskStatus(task.id, { status: e.target.value as any })}
                                    className={`text-xs px-2 py-1 rounded border-0 ${getStatusColor(currentTask.status)}`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{currentTask.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {currentTask.estimatedTime}
                                  </span>
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    <input 
                                      type="text"
                                      placeholder="Assign to..."
                                      value={currentTask.assignedTo || ''}
                                      onChange={(e) => updateTaskStatus(task.id, { assignedTo: e.target.value })}
                                      className="bg-transparent border-none outline-none placeholder-gray-400 w-20"
                                    />
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedDepartment} Metrics
                      </h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Metric
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getCurrentDepartment()?.metrics.map((metric, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{metric.name}</h4>
                            <span className="text-sm text-gray-500">{metric.unit}</span>
                          </div>
                          <div className="space-y-2">
                            {metric.target && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Target:</span>
                                <span className="font-medium">{metric.target} {metric.unit}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Actual:</span>
                              <input 
                                type="number" 
                                placeholder="Enter value"
                                className="text-right border-none outline-none bg-transparent font-medium w-20"
                              />
                            </div>
                            <textarea 
                              placeholder="Notes..."
                              className="w-full text-xs border rounded p-2 resize-none"
                              rows={2}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'protocols' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Standard Operating Procedures
                      </h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Protocol
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {[
                        { name: 'Sterilization Protocol', type: 'sterilization', duration: '4 hours', temp: '121°C' },
                        { name: 'Inoculation SOP', type: 'inoculation', duration: '2 hours', temp: '25°C' },
                        { name: 'Harvest Procedure', type: 'harvest', duration: '3 hours', temp: 'Ambient' },
                        { name: 'Quality Check Protocol', type: 'quality', duration: '1 hour', temp: 'Ambient' }
                      ].map((protocol, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="h-5 w-5 text-blue-500" />
                              <div>
                                <h4 className="font-medium text-gray-900">{protocol.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Duration: {protocol.duration}</span>
                                  <span>Temp: {protocol.temp}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ai-assistant' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Crowe Logic AI Assistant
                      </h3>
                      <Badge className="bg-purple-100 text-purple-800">
                        Natural Language Processing
                      </Badge>
                    </div>
                    
                    {/* AI Prompt Input */}
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Brain className="h-4 w-4" />
                          <span>Describe what you need and I'll generate the file for you</span>
                        </div>
                        <Textarea
                          placeholder="e.g., 'Create a sterilization protocol for substrate bags' or 'Generate a daily checklist for contamination prevention'"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="min-h-20"
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Examples: protocols, checklists, SOPs, reports, analysis templates
                          </div>
                          <Button 
                            onClick={generateAIFile}
                            disabled={!aiPrompt.trim() || aiLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {aiLoading ? (
                              <>
                                <Cpu className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Generate File
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Generated Files */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Generated Files</h4>
                      {generatedFiles.length === 0 ? (
                        <Card className="p-6 text-center">
                          <FileIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No files generated yet. Use the AI assistant above to create protocols, checklists, and more.</p>
                        </Card>
                      ) : (
                        <div className="space-y-2">
                          {generatedFiles.map((file) => (
                            <Card key={file.id} className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-4 w-4 text-purple-500" />
                                  <div>
                                    <p className="font-medium text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {file.type} • {file.department} • {new Date(file.generatedAt).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'alerts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Environmental Alerts
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-600">
                          System Monitoring Active
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {environmentalAlerts.map((alert) => (
                        <Card key={alert.id} className={`p-4 border-l-4 ${
                          alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                          alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                          alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${
                                alert.severity === 'critical' ? 'bg-red-100' :
                                alert.severity === 'high' ? 'bg-orange-100' :
                                alert.severity === 'medium' ? 'bg-yellow-100' :
                                'bg-blue-100'
                              }`}>
                                {alert.type === 'temperature' && <Thermometer className="h-4 w-4" />}
                                {alert.type === 'humidity' && <Droplets className="h-4 w-4" />}
                                {alert.type === 'co2' && <Wind className="h-4 w-4" />}
                                {alert.type === 'contamination' && <Bug className="h-4 w-4" />}
                                {alert.type === 'equipment' && <Cpu className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{alert.message}</h4>
                                  <Badge className={`text-xs ${
                                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {alert.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                Resolve
                              </Button>
                              <Button variant="outline" size="sm">
                                <Bell className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Daily Notes - {selectedDepartment}
                      </h3>
                      <Button size="sm" onClick={saveData}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                    </div>
                    
                    <Card className="p-4">
                      <Textarea 
                        placeholder={`Enter notes for ${selectedDepartment} on ${selectedDay}, Week ${selectedWeek}...`}
                        className="min-h-96 resize-none"
                        value={dailyNotes[getNotesKey()] || ''}
                        onChange={(e) => setDailyNotes(prev => ({
                          ...prev,
                          [getNotesKey()]: e.target.value
                        }))}
                      />
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
