import {
  AbortController as NodeAbortController,
  Headers as NodeHeaders,
  Request as NodeRequest,
  createRequestHandler as createRemixRequestHandler,
  installGlobals,
  readableStreamToString,
} from '@remix-run/node';
import { isBinaryType } from './is-binary-type.js';

installGlobals();

/**
 * Creates a response object compatible with Azure Function.
 * @param {Response} nodeResponse A Remix `Response` to the incoming request.
 * @returns {Promise<import('@azure/functions').HttpResponse>} A Remix `response` object.
 */
async function sendRemixResponse(nodeResponse) {
  const contentType = nodeResponse.headers.get('Content-Type') ?? '';
  const isBase64Encoded = isBinaryType(contentType);
  const body = nodeResponse.body
    ? await (isBase64Encoded ? readableStreamToString(nodeResponse.body, 'base64') : nodeResponse.text())
    : undefined;
  return {
    status: nodeResponse.status,
    headers: Object.fromEntries(nodeResponse.headers.entries()),
    body,
  };
}

/**
 * Transform Azure Http headers to Remix `Headers`.
 * @param {import('@azure/functions').HttpRequestHeaders} requestHeaders - Azure HTTP Headers.
 * @param {Array<string>} [requestCookies] - The incoming request cookies.
 * @returns {NodeHeaders} An instance of Remix `Headers`.
 */
function createRemixHeaders(requestHeaders, requestCookies) {
  const headers = new NodeHeaders();

  // eslint-disable-next-line fp/no-loops
  for (const [header, value] of Object.entries(requestHeaders)) {
    value && headers.append(header, value);
  }

  if (requestCookies) {
    headers.append('Cookie', requestCookies.join('; '));
  }

  return headers;
}

/**
 * Creates a new instance of Remix `Request` based on the incoming Azure HTTP request object.
 * @param {import('@azure/functions').HttpRequest & { cookies?: Array<string>, isBase64Encoded?: boolean, method: import('@azure/functions').HttpMethod }} request - HTTP request object. Provided to your function when using HTTP Bindings.
 * @returns {NodeRequest} A new instance of NodeRequest
 */
function createRemixRequest({ body, cookies, headers, isBase64Encoded, method }) {
  const host = headers['x-forwarded-host'] || headers.host;
  const originalUrl = headers['x-ms-original-url'] || headers['x-original-url'] || '/';
  const url = new URL(originalUrl, `https://${host}`);

  const isFormData = headers['content-type']?.includes('multipart/form-data');
  // Note: No current way to abort these for Azure, but our router expects
  // requests to contain a signal so it can detect aborted requests
  const controller = new NodeAbortController();
  return new NodeRequest(url.href, {
    method,
    headers: createRemixHeaders(headers, cookies),
    // Cast until reason/throwIfAborted added
    // https://github.com/mysticatea/abort-controller/issues/36
    // @ts-ignore
    signal: controller.signal,
    body:
      body && isBase64Encoded
        ? isFormData
          ? Buffer.from(body, 'base64')
          : Buffer.from(body, 'base64').toString()
        : method.toLowerCase() !== 'get' && method.toLowerCase() !== 'head'
        ? body
        : undefined,
  });
}

/**
 * Returns a request handler for Azure Function's Node.js runtime that serves the
 * response using Remix.
 * @param {object} properties - The argument object.
 * @param {import('@remix-run/server-runtime').ServerBuild} properties.build - The output of the compiler for the server build.
 * @param {(context: import('@azure/functions').Context) => Promise<import('@remix-run/server-runtime').AppLoadContext>} [properties.getLoadContext] - A function that returns the value to use as `context` in route `loader` and `action` functions.
 * @param {'development' | 'production' | 'test'} properties.mode - An string that sets which mode should the server handler work.
 * @returns {import('@azure/functions').AzureFunction}  An azure function compatible http request handler
 */
export function createRemixAzureAdapter({ build, getLoadContext, mode }) {
  const handler = createRemixRequestHandler(build, mode);
  /**
   * Handles incoming request
   * @param {import('@azure/functions').Context} context The Azure function context.
   * @returns {Promise<import('@azure/functions').HttpResponse>} The http response.
   */
  return async context => {
    const loadContext = await getLoadContext?.(context);
    // @ts-ignore
    const request = createRemixRequest(context.req);
    const response = await handler(request, loadContext);
    return sendRemixResponse(response);
  };
}
