# Azure Functions v4 Example

This example shows how to setup a [remix.run][remix] application to use an [Azure Functions][azure-functions] under the new [**Node.js v4 programming model**][model] as a custom server, instead of the default Express server.
Inside the `server` folder you will find all the code needed to run the server as an Azure Functions.

## Note

> It doesn't serve any static assets, so you will need to use any static file solution to serve all the files under the `public` folder.

## How it works

This example is using the new [**Node.js v4 programming model**][model] to create an Azure Functions HTTP handler, one of the main differences with the previous version is that now the handler is being indexed by the _runtime_ based on the **package.json main property**.
The _SSR function_ expect to receive any request with the route to render as a path parameter, so it can be used as a catch-all function. The configuration is set in the `handler.js` file with `route: '{*path}'`, an example of a request would be:

```bash
curl http://localhost:3030/api/ssr/route-one
```

The above call will render the `route-one` route, which is defined in the `app/routes/route-one.tsx` file.

## Running the example

To run the example, you need to install all the dependencies with your favorite package manager:

```bash
yarn install
```

Once the dependencies are installed, you can run the server with:

```bash
yarn dev
```

[azure-functions]: https://learn.microsoft.com/en-us/azure/azure-functions/
[model]: https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-functions-node-js-v4-programming-model-is-generally/ba-p/3929217
[remix]: https://remix.run
