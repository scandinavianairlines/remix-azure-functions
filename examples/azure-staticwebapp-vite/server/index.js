import { app } from '@azure/functions';
import { createRequestHandler } from '@scandinavianairlines/remix-azure-functions';

import * as build from './build/server/index.js';

// @Note: for local development, we can use Vite to get the server build but we need an extra step to get SWA to work with Vite.
// process.env.NODE_ENV === 'production'
//     ? await import('./build/server/index.js')
//     : await import('vite')
//         .then(vite =>
//           vite.createServer({
//             root: '../',
//             server: {
//               middlewareMode: true,
//             },
//           })
//         )
//         .then(server => server.ssrLoadModule('virtual:remix/server-build'));

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

app.setup({ enableHttpStream: true });

app.http('ssr', {
  methods: ['GET', 'POST', 'DELETE', 'HEAD', 'PATCH', 'PUT', 'OPTIONS', 'TRACE', 'CONNECT'],
  authLevel: 'function',
  handler: createRequestHandler({ build, getLoadContext }),
});
