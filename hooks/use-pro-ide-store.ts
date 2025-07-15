import { useState, useCallback } from 'react';

interface DebugBreakpoint {
  line: number;
  file: string;
  condition?: string;
  enabled: boolean;
  id: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  timestamp: Date;
}

interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: number;
  unstaged: number;
  untracked: number;
}

interface MycologyBatch {
  id: string;
  strain: string;
  status: 'inoculated' | 'colonizing' | 'fruiting' | 'harvesting' | 'completed' | 'contaminated';
  startDate: Date;
  currentWeight: number;
  contamination_risk: number;
}

interface ProIDEState {
  // Debug state
  debugMode: boolean;
  breakpoints: DebugBreakpoint[];
  debugVariables: Record<string, any>;
  
  // Performance monitoring
  performanceMetrics: PerformanceMetric[];
  performanceHistory: PerformanceMetric[][];
  
  // Git integration
  gitStatus: GitStatus;
  gitBranches: string[];
  
  // Mycology tools
  activeBatches: MycologyBatch[];
  environmentalData: {
    temperature: number;
    humidity: number;
    co2: number;
    lastUpdate: Date;
  };
  
  // AI features
  aiSuggestions: string[];
  aiCodeCompletion: boolean;
  aiRealTimeAnalysis: boolean;
  
  // Editor features
  currentFile: string | null;
  openTabs: string[];
  selectedText: string;
  cursorPosition: { line: number; column: number };
  
  // Collaboration
  collaborators: {
    id: string;
    name: string;
    cursor: { line: number; column: number };
    color: string;
  }[];
  
  // Actions
  setDebugMode: (enabled: boolean) => void;
  addBreakpoint: (breakpoint: Omit<DebugBreakpoint, 'id'>) => void;
  removeBreakpoint: (id: string) => void;
  toggleBreakpoint: (id: string) => void;
  
  updatePerformanceMetrics: (metrics: PerformanceMetric[]) => void;
  updateGitStatus: (status: GitStatus) => void;
  
  addMycologyBatch: (batch: Omit<MycologyBatch, 'id'>) => void;
  updateBatchStatus: (id: string, status: MycologyBatch['status']) => void;
  updateEnvironmentalData: (data: Partial<ProIDEState['environmentalData']>) => void;
  
  setAISuggestions: (suggestions: string[]) => void;
  toggleAIFeature: (feature: 'codeCompletion' | 'realTimeAnalysis') => void;
  
  setCurrentFile: (file: string | null) => void;
  setSelectedText: (text: string) => void;
  setCursorPosition: (position: { line: number; column: number }) => void;
  
  addCollaborator: (collaborator: ProIDEState['collaborators'][0]) => void;
  removeCollaborator: (id: string) => void;
  updateCollaboratorCursor: (id: string, cursor: { line: number; column: number }) => void;
}

export const useProIDEStore = create<ProIDEState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    debugMode: false,
    breakpoints: [],
    debugVariables: {},
    
    performanceMetrics: [
      { name: 'Memory Usage', value: 342, unit: 'MB', status: 'good', timestamp: new Date() },
      { name: 'CPU Usage', value: 23, unit: '%', status: 'good', timestamp: new Date() },
      { name: 'Response Time', value: 1.2, unit: 's', status: 'warning', timestamp: new Date() },
      { name: 'Error Rate', value: 0.01, unit: '%', status: 'good', timestamp: new Date() }
    ],
    performanceHistory: [],
    
    gitStatus: {
      branch: 'main',
      ahead: 0,
      behind: 0,
      staged: 0,
      unstaged: 2,
      untracked: 1
    },
    gitBranches: ['main', 'feature/ai-integration', 'develop'],
    
    activeBatches: [
      {
        id: 'BATCH_2025_001',
        strain: 'Oyster',
        status: 'fruiting',
        startDate: new Date('2025-07-01'),
        currentWeight: 15.4,
        contamination_risk: 0.05
      },
      {
        id: 'BATCH_2025_002',
        strain: 'Shiitake',
        status: 'colonizing',
        startDate: new Date('2025-07-08'),
        currentWeight: 8.2,
        contamination_risk: 0.12
      },
      {
        id: 'BATCH_2025_003',
        strain: 'Lions Mane',
        status: 'fruiting',
        startDate: new Date('2025-06-28'),
        currentWeight: 22.1,
        contamination_risk: 0.31
      }
    ],
    
    environmentalData: {
      temperature: 24.2,
      humidity: 85.1,
      co2: 1247,
      lastUpdate: new Date()
    },
    
    aiSuggestions: [
      'Add error handling for sensor readings',
      'Implement data validation for temperature values',
      'Consider adding logging for debugging',
      'Use type hints for better code clarity'
    ],
    aiCodeCompletion: true,
    aiRealTimeAnalysis: true,
    
    currentFile: null,
    openTabs: [],
    selectedText: '',
    cursorPosition: { line: 1, column: 1 },
    
    collaborators: [],
    
    // Actions
    setDebugMode: (enabled) => set({ debugMode: enabled }),
    
    addBreakpoint: (breakpoint) => set((state) => ({
      breakpoints: [...state.breakpoints, { 
        ...breakpoint, 
        id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
      }]
    })),
    
    removeBreakpoint: (id) => set((state) => ({
      breakpoints: state.breakpoints.filter(bp => bp.id !== id)
    })),
    
    toggleBreakpoint: (id) => set((state) => ({
      breakpoints: state.breakpoints.map(bp => 
        bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
      )
    })),
    
    updatePerformanceMetrics: (metrics) => set((state) => {
      const newHistory = [...state.performanceHistory, state.performanceMetrics].slice(-50);
      return {
        performanceMetrics: metrics,
        performanceHistory: newHistory
      };
    }),
    
    updateGitStatus: (status) => set({ gitStatus: status }),
    
    addMycologyBatch: (batch) => set((state) => ({
      activeBatches: [...state.activeBatches, {
        ...batch,
        id: `BATCH_${new Date().getFullYear()}_${String(state.activeBatches.length + 1).padStart(3, '0')}`
      }]
    })),
    
    updateBatchStatus: (id, status) => set((state) => ({
      activeBatches: state.activeBatches.map(batch =>
        batch.id === id ? { ...batch, status } : batch
      )
    })),
    
    updateEnvironmentalData: (data) => set((state) => ({
      environmentalData: { ...state.environmentalData, ...data, lastUpdate: new Date() }
    })),
    
    setAISuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
    
    toggleAIFeature: (feature) => set((state) => ({
      [feature === 'codeCompletion' ? 'aiCodeCompletion' : 'aiRealTimeAnalysis']: 
        !state[feature === 'codeCompletion' ? 'aiCodeCompletion' : 'aiRealTimeAnalysis']
    })),
    
    setCurrentFile: (file) => set({ currentFile: file }),
    setSelectedText: (text) => set({ selectedText: text }),
    setCursorPosition: (position) => set({ cursorPosition: position }),
    
    addCollaborator: (collaborator) => set((state) => ({
      collaborators: [...state.collaborators, collaborator]
    })),
    
    removeCollaborator: (id) => set((state) => ({
      collaborators: state.collaborators.filter(c => c.id !== id)
    })),
    
    updateCollaboratorCursor: (id, cursor) => set((state) => ({
      collaborators: state.collaborators.map(c =>
        c.id === id ? { ...c, cursor } : c
      )
    }))
  }))
);

// Selectors for computed values
export const useActiveBreakpoints = () => 
  useProIDEStore(state => state.breakpoints.filter(bp => bp.enabled));

export const useHighRiskBatches = () =>
  useProIDEStore(state => state.activeBatches.filter(batch => batch.contamination_risk > 0.3));

export const useEnvironmentalAlerts = () =>
  useProIDEStore(state => {
    const { temperature, humidity, co2 } = state.environmentalData;
    const alerts = [];
    
    if (temperature < 20 || temperature > 28) {
      alerts.push({ type: 'temperature', value: temperature, severity: 'warning' });
    }
    if (temperature < 18 || temperature > 30) {
      alerts.push({ type: 'temperature', value: temperature, severity: 'critical' });
    }
    
    if (humidity < 75 || humidity > 95) {
      alerts.push({ type: 'humidity', value: humidity, severity: 'warning' });
    }
    if (humidity < 70 || humidity > 98) {
      alerts.push({ type: 'humidity', value: humidity, severity: 'critical' });
    }
    
    if (co2 < 800 || co2 > 1800) {
      alerts.push({ type: 'co2', value: co2, severity: 'warning' });
    }
    
    return alerts;
  });

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const updateMetrics = useProIDEStore(state => state.updatePerformanceMetrics);
  
  const startMonitoring = () => {
    const interval = setInterval(() => {
      // Simulate performance metric updates
      const metrics: PerformanceMetric[] = [
        { 
          name: 'Memory Usage', 
          value: Math.floor(300 + Math.random() * 200), 
          unit: 'MB', 
          status: 'good',
          timestamp: new Date()
        },
        { 
          name: 'CPU Usage', 
          value: Math.floor(15 + Math.random() * 40), 
          unit: '%', 
          status: 'good',
          timestamp: new Date()
        },
        { 
          name: 'Response Time', 
          value: Math.round((0.8 + Math.random() * 1.5) * 100) / 100, 
          unit: 's', 
          status: 'warning',
          timestamp: new Date()
        },
        { 
          name: 'Error Rate', 
          value: Math.round(Math.random() * 0.05 * 1000) / 1000, 
          unit: '%', 
          status: 'good',
          timestamp: new Date()
        }
      ];
      
      updateMetrics(metrics);
    }, 5000);
    
    return () => clearInterval(interval);
  };
  
  return { startMonitoring };
};
