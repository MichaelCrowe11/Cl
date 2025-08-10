import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import client from 'prom-client';

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

@Controller()
export class HealthController {
  @Get('/healthz')
  health() {
    return { ok: true };
  }

  @Get('/metrics')
  async metrics(@Res() res: Response) {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  }
}