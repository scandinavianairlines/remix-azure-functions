# Azure Static Web Apps Example

This example shows how to setup a [Remix.run][remix] application to work in [Azure Static Web Apps][azure-staticwebapp] service.
Inside the `server` folder you will find all the code needed to run the server as an Azure Functions.

## How it works

This example is using the new [**Node.js v4 programming model**][model] to create an Azure Functions HTTP handler, one of the main differences with the previous version is that now the handler is being indexed by the _runtime_ based on the **package.json main property**.
The _SSR function_ receives all the requests that are forwarded by the Azure Static Web Apps hosting service, reads the `x-ms-original-url` header to know the route that was requested and renders the page.
The _proxy_ configuration is set in the `staticwebapp.config.json` file with the following configuration:

```json
{
  "platform": {
    "apiRuntime": "node:18"
  },
  "routes": [
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

The above configuration will forward all the requests to the `/api/ssr` function, which is defined in the `server/src/handler.js` file.

## Running the example

To run the example, you need to install all the dependencies with your favorite package manager:

```bash
yarn install
```

Once the dependencies are installed, you can run the server with:

```bash
yarn dev
```

[azure-staticwebapp]: https://docs.microsoft.com/en-us/azure/static-web-apps/overview
[remix]: https://remix.run
