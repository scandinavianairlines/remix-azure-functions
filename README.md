# Remix Adapter for Azure Functions

[![js-standard-style](https://img.shields.io/badge/standard-javascript-fdbe15.svg?logo=javascript&logoColor=fdbe15&logoWidth=20&style=flat-square)](https://github.com/feross/standard) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier&style=flat-square)](https://github.com/prettier/prettier) [![npm](https://img.shields.io/npm/v/create-remix-azure-adapter?logo=npm&style=flat-square)](https://www.npmjs.com/package/@scandinavianairlines/remix-azure-functions)

- [Remix Adapter for Azure Functions](#remix-adapter-for-azure-functions)
  - [Usage](#usage)
    - [Azure Static Web Apps](#azure-static-web-apps)
    - [Azure Functions](#azure-functions)
    - [Custom usage](#custom-usage)
    - [Examples](#examples)
  - [Issues](#issues)
  - [Contributing](#contributing)
  - [License](#license)

An adapter that allows Azure Functions to work as a custom server for [Remix.run][remix]. This adapter package we have created is designed to be used with [Azure Static Web Apps][azure-staticwebapp] and [Azure Functions][azure-functions] using the new [Node.js][nodejs] [**v4 programming model**][model].

## Usage

The package is available as an npm package and can be installed as follows:

```bash
yarn add @scandinavianairlines/remix-azure-functions
```

Once installed, you can use the adapter in your Azure Functions as follows:

```javascript
import { app } from '@azure/functions';
import { createRequestHandler } from '@scandinavianairlines/remix-azure-functions';

import * as build from './build/index.js';

app.http('ssr', {
  methods: ['GET', 'POST', 'DELETE', 'HEAD', 'PATCH', 'PUT', 'OPTIONS', 'TRACE', 'CONNECT'],
  authLevel: 'function',
  handler: createRequestHandler({ build }),
});
```

It is important to note that the _Azure Functions_ runtime will index the handler based on the `package.json` `main` property, so make sure that you have set it to the function handler file.

### Azure Static Web Apps

When using the adapter with Azure Static Web Apps, you need to make sure that you have set a rewrite route to proxy all request to the Azure Functions. This should be defined in the `routes` property inside the `staticwebapp.config.json` file.

```json
{
  "platform": {
    "apiRuntime": "node:18"
  },
  "routes": [
    {
      "route": "/favicon.ico"
    },
    {
      "route": "/build/*"
    },
    {
      "route": "/*",
      "rewrite": "/api/ssr"
    }
  ],
  "navigationFallback": {
    "rewrite": "/api/ssr"
  },
  "trailingSlash": "never"
}
```

### Azure Functions

When using the adapter with Azure Functions, you need to make sure that you have set the `route` property in your registered HTTP trigger to `/{*path}`. This is used to know which route to render when using the adapter.

### Custom usage

The adapter supports an optional `urlParser` function that can be used to parse a `URL` instance from the incoming request. This can be useful if you are using a custom routing solution in your Azure Functions or if you would like to parse the URL from a specific header.

```javascript
import { createRequestHandler } from '@scandinavianairlines/remix-azure-functions';

import * as build from './build/index.js';

const handler = createRequestHandler({
  build,
  urlParser: request => new URL(request.headers.get('x-forwarded-url')),
});
```

### Examples

In the [examples](./examples) folder you can find a simple example of how to use the adapter with a simple Azure Functions or with Azure Static Web Apps.

## Issues

If you encounter any non-security-related bug or unexpected behavior, please [file an issue][bug]
using the bug report template.

[bug]: https://github.com/scandinavianairlines/remix-azure-functions/issues/new?labels=bug

## Contributing

We welcome contributions to this project. Please read our [contributing guidelines](.github/CONTRIBUTING.md).

## License

[MIT](./LICENSE).

---

Created by the [Airline Digitalization Team](mailto:airlinedigitalization@flysas.com).

![SAS](https://user-images.githubusercontent.com/850110/180438296-f79396e1-cb77-4f82-93e0-1d5bf5bea6a1.svg 'SAS')

[azure-functions]: https://learn.microsoft.com/en-us/azure/azure-functions/
[azure-staticwebapp]: https://docs.microsoft.com/en-us/azure/static-web-apps/overview
[nodejs]: https://nodejs.org
[model]: https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-functions-node-js-v4-programming-model-is-generally/ba-p/3929217
[remix]: https://remix.run
