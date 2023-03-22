import { jest } from '@jest/globals';

const DEFAULT_REQUEST_HANDLER_RETURN = {
  headers: {
    get: () => {},
    entries: () => Object.entries({ test: 'OK' }),
    test: 'OK',
  },
  status: 200,
  body: 'sample body',
  text: () => 'sample body',
};

const requestHandler = jest.fn().mockReturnValue(DEFAULT_REQUEST_HANDLER_RETURN);

jest.unstable_mockModule('@remix-run/node', () => ({
  installGlobals: () => {},
  createRequestHandler: jest.fn().mockReturnValue(requestHandler),
  AbortController: jest.fn(),
  Headers: jest.fn(),
  Request: jest.fn((a, b) => b),
  readableStreamToString: jest.fn(),
}));
const { createRemixAzureAdapter } = await import('./create-remix-azure-adapter.js');

describe('createRemixAzureAdapter', () => {
  beforeEach(() => {});
  test('should send the correct response', async () => {
    const getLoadContextReturn = { sample: 1 };
    const createdRemixAzureAdapter = createRemixAzureAdapter({
      getLoadContext: () => getLoadContextReturn,
    });
    const response = await createdRemixAzureAdapter({
      req: {
        headers: {},
        body: {},
        method: 'GET',
      },
    });
    expect(requestHandler).toHaveBeenCalledWith(
      { body: undefined, headers: {}, method: 'GET', signal: undefined },
      getLoadContextReturn
    );
    expect(response).toEqual({
      body: DEFAULT_REQUEST_HANDLER_RETURN.body,
      headers: {
        test: 'OK',
      },
      status: DEFAULT_REQUEST_HANDLER_RETURN.status,
    });
  });
});
