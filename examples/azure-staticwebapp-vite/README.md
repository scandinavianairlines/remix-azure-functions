# Azure Static Web Apps Vite Example

This example shows how to setup a [Remix.run][remix] vite application to work in [Azure Static Web Apps][azure-staticwebapp] service.
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
      "route": "/assets/*"
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

The above configuration will forward all the requests to the `/api/ssr` function, which is defined in the `server/index.js` file.

## How to deploy to Azure Static Web Apps

A [swa-cli.config.json](./swa-cli.config.json) file is included in this example to make it easier to understand how to configure the Azure Static Web Apps CLI to deploy this example. Make sure to include `@azure/functions` as a dependency in the server's [package.json](./server/package.json), otherwise the deployment will fail.
First, we need to build the application with `yarn build`, install production dependencies on the server folder with `yarn workspaces focus --production` and copy the server output from the build to the `server/` folder:

```bash
cd server
yarn workspaces focus --production
cp ../build/server/index.js ./build/server/index.js
```

This is required as the server output must be part of the artifact uplaoded as an Azure Function by the _swa cli_. The `swa-cli.config.json` file has setup the path for the `outputLocation` to be the `build/client` folder, which is the default output location for the Vite build.
Second, we should avoid duplicated `staticwebapp.config.json` files as the _swa cli_ should be using the one that is inside the `build/` folder and not from the `public/` folder.
Finally, you should be able to deploy your application to Azure Static Web Apps.

Here you can find a [working example][example] of this project deployed to Azure Static Web Apps.

## Running the example

To run the example, you need to install all the dependencies with your favorite package manager:

```bash
yarn install
```

Once the dependencies are installed, you can run the server with:

```bash
yarn dev
```

For development, you can grab the output from the vite virtual module. There are still some issues with serving all the required files from the SWA Emulator.

[azure-staticwebapp]: https://docs.microsoft.com/en-us/azure/static-web-apps/overview
[example]: https://witty-plant-02008271e-vite.westus2.4.azurestaticapps.net/
[remix]: https://remix.run
