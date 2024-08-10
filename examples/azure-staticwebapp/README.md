# Azure Static Web Apps Example

This example shows how to setup a [Remix.run][remix] application to work in [Azure Static Web Apps][azure-staticwebapp] service.
Inside the `server` folder you will find all the code needed to run the server as an Azure Functions.

## How it works

This example is using the new [**Node.js v4 programming model**][model] to create an Azure Functions HTTP handler. All the code is inside the `server/` folder, including the functions configuration.
A **package.json** file with the server dependencies and the `main` is required to make Static Web Apps recognize the server folder as a function.

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

The above configuration will forward all the requests to the `/api/ssr` function, which is defined in the `server/handler.js` file.

## How to deploy to Azure Static Web Apps

A [swa-cli.config.json](./swa-cli.config.json) file is included in this example to make it easier to understand how to configure the Azure Static Web Apps CLI to deploy this example. Make sure to include `@azure/functions` as a dependency in the server's [package.json](./server/package.json), otherwise the deployment will fail.
Finally, the support for the new _Node.js v4 programming model_ is still in progress, so you may need to use **US West 2** as the region in your Azure Static Web Apps. There is an [open issue](https://github.com/Azure/static-web-apps/issues/1139) to track this problem.

Here you can find a [working example][example] of this project deployed to Azure Static Web Apps.

## Running the example

To run the example, you need to install all the dependencies with your favorite package manager (including the ones inside the `server` folder):

```bash
yarn install
```

Once the dependencies are installed, you can run the server with:

```bash
yarn dev
```

[azure-staticwebapp]: https://docs.microsoft.com/en-us/azure/static-web-apps/overview
[example]: https://witty-plant-02008271e.4.azurestaticapps.net/
[remix]: https://remix.run
