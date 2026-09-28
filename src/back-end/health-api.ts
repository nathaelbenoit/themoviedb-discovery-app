import type { Express } from 'express';
import express from 'express';

export function registerHealthApi(app: Express): void {
  // Define a route handler for health check endpoint
  app.get('/api/health', (_req: express.Request, res: express.Response) => {
    const response: { status: string } = { status: 'ok' };
    res.json(response);
  });
}
