'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  TrendingUp,
  Zap
} from 'lucide-react';

interface CanaryData {
  canary: {
    status: 'healthy' | 'degraded';
    timestamp: string;
    slo: {
      errorRate: number;
      p95Latency: number;
      availability: number;
      period: string;
    };
    checks: Array<{
      endpoint: string;
      status: 'success' | 'error';
      responseTime: number;
      statusCode: number;
      error?: string;
    }>;
    summary: {
      total: number;
      success: number;
      errors: number;
      sloTarget: string;
    };
  };
}

export default function SLODashboard() {
  const [canaryData, setCanaryData] = useState<CanaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCanaryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/canary');
      const data = await response.json();
      setCanaryData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch canary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanaryData();
    const interval = setInterval(fetchCanaryData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && !canaryData) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6" />
          <h1 className="text-2xl font-bold">SLO Dashboard</h1>
          <RefreshCw className="h-4 w-4 animate-spin" />
        </div>
        <p>Loading monitoring data...</p>
      </div>
    );
  }

  const { canary } = canaryData || { canary: null };
  if (!canary) return null;

  const isHealthy = canary.status === 'healthy';
  const errorRateMet = canary.slo.errorRate < 0.1;
  const latencyMet = canary.slo.p95Latency < 100;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h1 className="text-2xl font-bold">SLO Dashboard</h1>
          <Badge variant={isHealthy ? "default" : "destructive"}>
            {isHealthy ? 'Healthy' : 'Degraded'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last update: {lastUpdate?.toLocaleTimeString()}
          </span>
          <Button onClick={fetchCanaryData} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* SLO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold">{canary.slo.errorRate.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Target: &lt; 0.1%</p>
            </div>
            <div className={`p-2 rounded-full ${errorRateMet ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {errorRateMet ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">P95 Latency</p>
              <p className="text-2xl font-bold">{canary.slo.p95Latency}ms</p>
              <p className="text-xs text-muted-foreground">Target: &lt; 100ms</p>
            </div>
            <div className={`p-2 rounded-full ${latencyMet ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {latencyMet ? <Zap className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Availability</p>
              <p className="text-2xl font-bold">{canary.slo.availability.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Target: &gt; 99.9%</p>
            </div>
            <div className={`p-2 rounded-full ${canary.slo.availability > 99.9 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Endpoint Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Endpoint Health</h2>
        <div className="space-y-3">
          {canary.checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${check.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                <code className="text-sm font-mono">{check.endpoint}</code>
                {check.error && (
                  <Badge variant="destructive" className="text-xs">
                    {check.error}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{check.responseTime}ms</span>
                <Badge variant={check.status === 'success' ? "default" : "destructive"}>
                  {check.statusCode || 'ERROR'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{canary.summary.success}</p>
            <p className="text-sm text-muted-foreground">Successful</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{canary.summary.errors}</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{canary.summary.total}</p>
            <p className="text-sm text-muted-foreground">Total Checks</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">SLO Target</p>
            <p className="text-xs font-mono">{canary.summary.sloTarget}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
