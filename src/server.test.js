import { HttpRequest } from '@azure/functions';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/node';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createRequestHandler } from './server.js';

vi.mock('@remix-run/node', () => ({
  createRequestHandler: vi.fn(),
}));

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('return a Azure function handler', () => {
    const handler = createRequestHandler({ build: {} });

    expect(handler).toBeInstanceOf(Function);
  });

  test('return a Azure function response init object', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { 'x-forwarded-host': 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });
    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });
    const response = await handler(mockHttpRequest, {});

    expect(createRemixRequestHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith(expect.any(Request), undefined);
    expect(response).toEqual(
      expect.objectContaining({
        body: null,
        headers: expect.any(Object),
        status: expect.any(Number),
      })
    );
  });

  test('return a Azure function response init object with body', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response('body'));
    const mockHttpRequest = new HttpRequest({
      method: 'HEAD',
      headers: { 'x-forwarded-host': 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });
    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });
    const response = await handler(mockHttpRequest, {});

    expect(createRemixRequestHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith(expect.any(Request), undefined);
    expect(response).toEqual(
      expect.objectContaining({
        body: expect.any(ReadableStream),
        headers: {
          'content-type': 'text/plain;charset=UTF-8',
        },
        status: expect.any(Number),
      })
    );
  });

  test('transform a binary type to string body response', async () => {
    const mockHandler = vi
      .fn()
      .mockResolvedValue(new Response(new ReadableStream(), { headers: { 'Content-Type': 'image/png' } }));
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { 'x-forwarded-host': 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });
    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });
    const response = await handler(mockHttpRequest, {});

    expect(createRemixRequestHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith(expect.any(Request), undefined);
    expect(response).toEqual(
      expect.objectContaining({
        body: expect.any(ReadableStream),
        headers: {
          'content-type': 'image/png',
        },
        status: expect.any(Number),
      })
    );
  });

  test('calls the given getLoadContext function', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { 'x-forwarded-host': 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });
    const mockGetLoadContext = vi.fn().mockResolvedValue({});
    const mockAzureContext = { log: vi.fn() };
    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
      getLoadContext: mockGetLoadContext,
    });

    await handler(mockHttpRequest, mockAzureContext);

    expect(mockGetLoadContext).toHaveBeenCalledWith(expect.any(Request), mockAzureContext);
  });

  test('calls the given urlParser function', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { 'x-forwarded-host': 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });
    const mockUrlParser = vi.fn().mockReturnValue(new URL('https://test.com'));
    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
      urlParser: mockUrlParser,
    });

    await handler(mockHttpRequest, {});

    expect(mockUrlParser).toHaveBeenCalledWith(mockHttpRequest);
  });

  test('parses the host from the `host` header', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test-host.com' },
      params: undefined,
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test-host.com/',
      }),
      undefined
    );
  });

  test('parses the original url from the `x-ms-original-url` header', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test.com', 'x-ms-original-url': '/route-1' },
      params: undefined,
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.com/route-1',
      }),
      undefined
    );
  });

  test('parses the original url from the `x-original-url` header', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test.com', 'x-original-url': '/route-1' },
      params: undefined,
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.com/route-1',
      }),
      undefined
    );
  });

  test('parses the original url from the path parameter', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test-path.com' },
      params: { path: '/route-1' },
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test-path.com/route-1',
      }),
      undefined
    );
  });

  test('parses the request protocal from the `x-forwarded-proto` header', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test-forwarded.com', 'x-forwarded-proto': 'http' },
      params: undefined,
      url: 'https://test-forwarded.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://test-forwarded.com/',
      }),
      undefined
    );
  });

  test('body should be `null` when incoming request is a GET or HEAD', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response());
    const mockHttpRequest = new HttpRequest({
      method: 'GET',
      headers: { host: 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    await handler(mockHttpRequest, {});

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        body: null,
      }),
      undefined
    );
  });

  test('body should not be null when incoming request is not a GET or HEAD', async () => {
    const mockHandler = vi.fn().mockResolvedValue(new Response('incoming-body'));
    const mockHttpRequest = new HttpRequest({
      body: { string: 'incoming-body' },
      method: 'POST',
      headers: { host: 'test.com' },
      params: undefined,
      url: 'https://test.com',
    });

    createRemixRequestHandler.mockReturnValue(mockHandler);
    const handler = createRequestHandler({
      build: {},
    });

    const response = await handler(mockHttpRequest, {});
    expect(response.body).toBeInstanceOf(ReadableStream);

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(Object),
      }),
      undefined
    );
  });
});
