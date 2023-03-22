# create-remix-azure-adapter

[![js-standard-style](https://img.shields.io/badge/standard-javascript-fdbe15.svg?logo=javascript&logoColor=fdbe15&logoWidth=20&style=flat-square)](https://github.com/feross/standard) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier&style=flat-square)](https://github.com/prettier/prettier)

An adapter for requests between azure functions and remix

## Usage

The package is available as an npm package and can be installed as follows:

```sh
yarn add @flysas-tech/create-remix-azure-adapter
```

It's being hosted in our private Github repository, please make sure you have a working yarn or npm setup before adding the package.

### Basic example

```js
import azure from '@flysas-tech/create-remix-azure-adapter';

createRemixAzureAdapter({
  build,
  getLoadContext,
});
```

---

Created by the [Airline Digitalization Team](mailto:airlinedigitßalization@flysas.com).

![SAS](https://user-images.githubusercontent.com/850110/180438296-f79396e1-cb77-4f82-93e0-1d5bf5bea6a1.svg 'SAS')

[esbuild]: https://esbuild.github.io/
