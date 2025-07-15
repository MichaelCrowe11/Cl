import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  service: string;
  environment: string;
  uptime: number;
  features: {
    aiIntegration: boolean;
    openai: boolean;
    anthropic: boolean;
    mycoIDE: boolean;
    proIDE: boolean;
  };
  checks: {
    filesystem: { status: 'pass' | 'fail'; message?: string };
    dependencies: { status: 'pass' | 'fail'; message?: string };
    api: { status: 'pass' | 'fail'; message?: string };
    scaffold: { status: 'pass' | 'fail'; message?: string };
  };
  deployment: {
    build_time?: string;
    commit_hash?: string;
    vercel_url?: string;
    org_id?: string;
  };
  metrics: {
    memory_usage: number;
    response_time: number;
  };
}

const startTime = Date.now();

export async function GET(request: NextRequest) {
  const start = Date.now();
  
  try {
    // Initialize health check response
    const health: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      service: 'CroweOS Systems Platform',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      features: {
        aiIntegration: Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY),
        openai: Boolean(process.env.OPENAI_API_KEY),
        anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
        mycoIDE: true,
        proIDE: true
      },
      checks: {
        filesystem: { status: 'pass' },
        dependencies: { status: 'pass' },
        api: { status: 'pass' },
        scaffold: { status: 'pass' }
      },
      deployment: {
        build_time: process.env.VERCEL_BUILD_TIME,
        commit_hash: process.env.VERCEL_GIT_COMMIT_SHA,
        vercel_url: process.env.VERCEL_URL,
        org_id: process.env.VERCEL_ORG_ID
      },
      metrics: {
        memory_usage: 0,
        response_time: 0
      }
    };

    // 1. Filesystem Health Check
    try {
      const componentsDir = path.join(process.cwd(), 'components');
      await fs.access(componentsDir);
      const files = await fs.readdir(componentsDir);
      if (files.length === 0) {
        throw new Error('Components directory is empty');
      }
      
      // Check critical components exist
      const criticalComponents = ['mycoide-wizard.tsx', 'pro-crowe-logic-ide-simple.tsx'];
      for (const component of criticalComponents) {
        try {
          await fs.access(path.join(componentsDir, component));
        } catch {
          health.checks.filesystem.message = `Missing critical component: ${component}`;
          health.status = 'degraded';
        }
      }
    } catch (error) {
      health.checks.filesystem.status = 'fail';
      health.checks.filesystem.message = `Filesystem check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      health.status = 'degraded';
    }

    // 2. Dependencies Health Check
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      // Check critical dependencies
      const criticalDeps = ['next', 'react', 'typescript', 'archiver'];
      const missingDeps = criticalDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length > 0) {
        throw new Error(`Missing critical dependencies: ${missingDeps.join(', ')}`);
      }
    } catch (error) {
      health.checks.dependencies.status = 'fail';
      health.checks.dependencies.message = `Dependencies check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      health.status = 'degraded';
    }

    // 3. API Health Check
    try {
      // Verify API routes exist
      const apiRoutes = ['scaffold'];
      for (const route of apiRoutes) {
        const routePath = path.join(process.cwd(), 'app', 'api', route, 'route.ts');
        await fs.access(routePath);
      }
    } catch (error) {
      health.checks.api.status = 'fail';
      health.checks.api.message = `API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      health.status = 'degraded';
    }

    // 4. Scaffold API Health Check
    try {
      const scaffoldApiPath = path.join(process.cwd(), 'app', 'api', 'scaffold', 'route.ts');
      await fs.access(scaffoldApiPath);
      
      // Check if archiver dependency is available
      try {
        require.resolve('archiver');
      } catch {
        throw new Error('Archiver dependency not found');
      }
    } catch (error) {
      health.checks.scaffold.status = 'fail';
      health.checks.scaffold.message = `Scaffold API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      health.status = 'degraded';
    }

    // 5. Memory Usage Check
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      health.metrics.memory_usage = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
      
      // Memory threshold check (500MB)
      if (health.metrics.memory_usage > 500) {
        health.status = 'degraded';
      }
    }

    // 6. Response Time
    health.metrics.response_time = Date.now() - start;

    // 7. Overall Status Determination
    const failedChecks = Object.values(health.checks).filter(check => check.status === 'fail').length;
    if (failedChecks > 0) {
      health.status = failedChecks >= 2 ? 'unhealthy' : 'degraded';
    }

    // Response status code based on health
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': health.status,
        'X-Response-Time': health.metrics.response_time.toString()
      }
    });

  } catch (error) {
    // Critical failure
    const criticalHealth: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: 'unknown',
      service: 'CroweOS Systems Platform',
      environment: process.env.NODE_ENV || 'unknown',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      features: {
        aiIntegration: false,
        openai: false,
        anthropic: false,
        mycoIDE: false,
        proIDE: false
      },
      checks: {
        filesystem: { status: 'fail', message: 'Critical error during health check' },
        dependencies: { status: 'fail', message: 'Unable to verify dependencies' },
        api: { status: 'fail', message: 'API health check failed' },
        scaffold: { status: 'fail', message: 'Scaffold API unavailable' }
      },
      deployment: {},
      metrics: {
        memory_usage: 0,
        response_time: Date.now() - start
      }
    };

    return NextResponse.json(criticalHealth, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'unhealthy',
        'X-Error': error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}
