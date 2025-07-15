'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Folder, 
  TestTube, 
  Settings, 
  Microscope,
  Plus,
  X,
  Sparkles,
  Code,
  FileText,
  BarChart3
} from 'lucide-react';

interface ProjectConfig {
  projectName: string;
  strains: string[];
  equipment: string[];
  description: string;
}

export default function MycoIDEWizard() {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: 'MyMushroomFarm',
    strains: ['Oyster', 'Shiitake'],
    equipment: ['Sterilizer', 'Incubator'],
    description: 'Professional mycology cultivation project'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [newStrain, setNewStrain] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const commonStrains = [
    'Oyster (Pleurotus ostreatus)',
    'Shiitake (Lentinula edodes)', 
    'Lions Mane (Hericium erinaceus)',
    'Reishi (Ganoderma lucidum)',
    'Wine Cap (Stropharia rugosoannulata)',
    'Phoenix Oyster (Pleurotus pulmonarius)',
    'Blue Oyster (Pleurotus columbinus)',
    'Maitake (Grifola frondosa)',
    'Turkey Tail (Trametes versicolor)',
    'Cordyceps (Cordyceps militaris)'
  ];

  const commonEquipment = [
    'Pressure Cooker/Sterilizer',
    'Incubator',
    'Laminar Flow Hood',
    'pH Meter',
    'Scale (0.1g precision)',
    'Thermometer',
    'Hygrometer',
    'CO2 Monitor',
    'UV Sterilizer',
    'Autoclave',
    'Spray Bottles',
    'Petri Dishes',
    'Culture Tubes',
    'Inoculation Loop',
    'Heating Mat'
  ];

  const addStrain = (strain: string) => {
    if (strain && !config.strains.includes(strain)) {
      setConfig(prev => ({ ...prev, strains: [...prev.strains, strain] }));
    }
    setNewStrain('');
  };

  const removeStrain = (index: number) => {
    setConfig(prev => ({
      ...prev,
      strains: prev.strains.filter((_, i) => i !== index)
    }));
  };

  const addEquipment = (equipment: string) => {
    if (equipment && !config.equipment.includes(equipment)) {
      setConfig(prev => ({ ...prev, equipment: [...prev.equipment, equipment] }));
    }
    setNewEquipment('');
  };

  const removeEquipment = (index: number) => {
    setConfig(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const generateProject = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/scaffold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate project');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Project generation failed:', error);
      alert('Failed to generate project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Microscope className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">MycoIDE Project Wizard</h1>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            PRO
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Generate a professional mycology cultivation project with AI-powered analysis tools
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <Folder className="h-4 w-4 mr-2" />
            Basic Setup
          </TabsTrigger>
          <TabsTrigger value="strains">
            <TestTube className="h-4 w-4 mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Settings className="h-4 w-4 mr-2" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="preview">
            <FileText className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Basic Setup */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Name</label>
                <Input
                  value={config.projectName}
                  onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your mycology project"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Strains */}
        <TabsContent value="strains" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cultivation Strains</h3>
            
            {/* Selected Strains */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Selected Strains</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {config.strains.map((strain, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {strain}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeStrain(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add Custom Strain */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Add Custom Strain</label>
              <div className="flex gap-2">
                <Input
                  value={newStrain}
                  onChange={(e) => setNewStrain(e.target.value)}
                  placeholder="Enter strain name"
                  onKeyPress={(e) => e.key === 'Enter' && addStrain(newStrain)}
                />
                <Button onClick={() => addStrain(newStrain)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Common Strains */}
            <div>
              <label className="text-sm font-medium mb-2 block">Common Strains</label>
              <div className="grid grid-cols-2 gap-2">
                {commonStrains.map((strain) => (
                  <Button
                    key={strain}
                    variant="outline"
                    size="sm"
                    onClick={() => addStrain(strain)}
                    className="justify-start"
                    disabled={config.strains.includes(strain)}
                  >
                    <TestTube className="h-3 w-3 mr-2" />
                    {strain}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Equipment */}
        <TabsContent value="equipment" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lab Equipment</h3>
            
            {/* Selected Equipment */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Selected Equipment</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {config.equipment.map((item, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeEquipment(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Add Custom Equipment */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Add Custom Equipment</label>
              <div className="flex gap-2">
                <Input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Enter equipment name"
                  onKeyPress={(e) => e.key === 'Enter' && addEquipment(newEquipment)}
                />
                <Button onClick={() => addEquipment(newEquipment)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Common Equipment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Common Equipment</label>
              <div className="grid grid-cols-2 gap-2">
                {commonEquipment.map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => addEquipment(item)}
                    className="justify-start"
                    disabled={config.equipment.includes(item)}
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Preview</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Project Name</h4>
                  <p className="text-sm text-muted-foreground">{config.projectName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Strains ({config.strains.length})</h4>
                  <p className="text-sm text-muted-foreground">{config.strains.join(', ')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Equipment ({config.equipment.length})</h4>
                <p className="text-sm text-muted-foreground">{config.equipment.join(', ')}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Generated Structure
                </h4>
                <pre className="text-xs text-muted-foreground font-mono">
{`${config.projectName}/
├── batches/           # Individual cultivation batches
${config.strains.map(strain => `│   └── CLX-${strain.substring(0, 2).toUpperCase()}*/`).join('\n')}
├── protocols/         # Standard operating procedures
├── analysis/          # Analysis scripts and notebooks
├── reports/           # Generated reports and documentation
├── docs/             # Project documentation
├── config/           # Configuration files
├── scripts/          # Utility scripts
├── data/             # Raw and processed data
└── models/           # ML models and predictions`}
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border rounded-lg p-3">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">AI Analysis</p>
                  <p className="text-xs text-muted-foreground">Growth tracking & predictions</p>
                </div>
                <div className="border rounded-lg p-3">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">Auto Reports</p>
                  <p className="text-xs text-muted-foreground">Daily progress reports</p>
                </div>
                <div className="border rounded-lg p-3">
                  <Settings className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-medium">Equipment Tracking</p>
                  <p className="text-xs text-muted-foreground">Monitor lab conditions</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={generateProject} 
          disabled={isGenerating || !config.projectName}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Generating Project...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate MycoIDE Project
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
