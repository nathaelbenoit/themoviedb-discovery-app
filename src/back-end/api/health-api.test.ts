// TypeScript
import type { Express, Request, RequestHandler, Response } from 'express';
import { expect, it, vi } from 'vitest';
import { registerHealthApi } from './health-api';

it('registers the health endpoint and responds with an ok status', () => {
  // Arrange: prepare a fake app to capture the route and a fake response.
  // These variables will hold the route path and its handler when registered.
  let registeredPath = '';
  let healthHandler: RequestHandler | undefined;

  // Pretend to be an Express app; save the route instead of starting a server.
  const app = {
    get: (path: string, handler: RequestHandler) => {
      registeredPath = path;
      healthHandler = handler;
    },
  } as unknown as Express;

  // Record the JSON sent by the route so the test can check it later.
  const response = { json: vi.fn() } as unknown as Response;

  // Act
  registerHealthApi(app);
  healthHandler?.({} as Request, response, vi.fn());

  // Assert
  expect(registeredPath).toBe('/api/health');
  expect(response.json).toHaveBeenCalledWith({ status: 'ok' });
});
