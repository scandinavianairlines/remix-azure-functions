import { createRequestHandler as createRemixRequestHandler } from '@remix-run/node';

/**
 * @typedef {(request: import('@azure/functions').HttpRequest, context: import('@azure/functions').InvocationContext) => Promise<import('@remix-run/node').AppLoadContext>} GetLoadContextFn
 */

/**
 * Checks if the incoming request is a GET or HEAD request.
 * @param {import('@azure/functions').HttpRequest} request Azure HTTP request.
 * @returns {boolean} `true` if the request is a GET or HEAD request. Otherwise, `false`.
 */
const isGetOrHead = request => request.method === 'GET' || request.method === 'HEAD';

/**
 * Parses the incoming request to a URL object.
 * @param {import('@azure/functions').HttpRequest} request Azure HTTP request.
 * @returns {URL} An instance of `URL`.
 */
function urlParser(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const originalUrl =
    request.headers.get('x-ms-original-url') || request.headers.get('x-original-url') || request.params.path || '/';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';

  return new URL(originalUrl, `${protocol}://${host}`);
}

/**
 * Creates a response object compatible with Azure Function.
 * @param {Response} response A Remix `Response` to the incoming request.
 * @returns {Promise<import('@azure/functions').HttpResponseInit>} A Azure function `response init` object.
 */
async function toAzureResponse(response) {
  const _response = response.clone();
  return {
    body: _response.body,
    headers: Object.fromEntries(response.headers.entries()),
    status: response.status,
  };
}

/**
 * Creates a new instance of Remix `Request` based on the incoming Azure HTTP request object.
 * @param {import('@azure/functions').HttpRequest} request Azure HTTP request object.
 * @param {object} [options] The options object.
 * @param {typeof urlParser} [options.urlParser] Function to parse the incoming request to a URL object.
 * @returns {Request} An instance of Remix `Request`.
 */
function createRemixRequest(request, options = {}) {
  const url = options.urlParser?.(request) || urlParser(request);
  // Note: No current way to abort these for Azure, but our router expects
  // requests to contain a signal so it can detect aborted requests
  const controller = new AbortController();

  /** @type {RequestInit} */
  const init = {
    method: request.method,
    headers: request.headers,
    signal: controller.signal,
    // eslint-disable-next-line unicorn/no-null -- Request init expects a `null` value.
    body: isGetOrHead(request) ? null : request.body,
    duplex: isGetOrHead(request) ? undefined : 'half',
  };

  return new Request(url.href, init);
}

/**
 * Returns a request handler for Azure Function that serves the response using Remix.
 * @param {object} options The options object.
 * @param {import('@remix-run/node').ServerBuild | (() => Promise<import('@remix-run/node').ServerBuild>)} options.build The Remix server build.
 * @param {GetLoadContextFn} [options.getLoadContext] A function that returns the Remix load context.
 * @param {(request: import('@azure/functions').HttpRequest) => URL} [options.urlParser] A function that parses the incoming request to a URL object.
 * @param {string} [options.mode] The mode of the Remix server build. Defaults to `process.env.NODE_ENV`.
 * @returns {import('@azure/functions').HttpHandler} A Azure function handler.
 */
export function createRequestHandler(options) {
  const handler = createRemixRequestHandler(options.build, options.mode || process.env.NODE_ENV);

  /**
   * The main function handler for Azure Functions.
   * Creates the Remix load context, transform the incoming request to a Remix `Request` object and
   * generates a Remix `Response` object based on the incoming request. Finally, it transforms the
   * Remix `Response` object to a Azure function `response` object.
   * @param {import('@azure/functions').HttpRequest} request Azure HTTP request.
   * @param {import('@azure/functions').InvocationContext} context Azure function invocation context.
   * @returns {Promise<import('@azure/functions').HttpResponseInit>} A Azure Function `http response init` object.
   */
  async function functionHandler(request, context) {
    const loadContext = await options.getLoadContext?.(request, context);
    const remixRequest = createRemixRequest(request, { urlParser: options.urlParser });
    const remixResponse = await handler(remixRequest, loadContext);

    return toAzureResponse(remixResponse);
  }

  return functionHandler;
}
