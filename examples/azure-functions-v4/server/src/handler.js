import { app } from '@azure/functions';

import { createRequestHandler } from '../../../../index.js';
import * as build from './build/index.js';

app.http('ssr', {
  methods: ['GET', 'POST', 'DELETE', 'HEAD', 'PATCH', 'PUT', 'OPTIONS', 'TRACE', 'CONNECT'],
  authLevel: 'function',
  handler: createRequestHandler({ build, getLoadContext: () => ({ example: true }) }),
  route: '{*path}',
});
