import { app } from '@azure/functions';

import { createRequestHandler } from '../../../../index.js';
import * as build from './build/index.js';

/**
 * This function is called on every request to determine the application's load context.
 * @param {import('@azure/functions').HttpRequest} request The incoming request.
 * @param {import('@azure/functions').InvocationContext} context The Azure Functions invocation context.
 * @returns {{ example: boolean }} The application's load context.
 */
function getLoadContext(request, context) {
  context.log(Object.fromEntries(request.headers.entries()), 'headers');
  return { example: true };
}

app.http('ssr', {
  methods: ['GET', 'POST', 'DELETE', 'HEAD', 'PATCH', 'PUT', 'OPTIONS', 'TRACE', 'CONNECT'],
  authLevel: 'function',
  handler: createRequestHandler({ build, getLoadContext }),
});
