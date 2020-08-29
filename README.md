# RRPC Sermons Frontend

The frontend service powering [the Russell RPC Sermons website](http://sermons.russellrpc.org/). Built with [Svelte](https://svelte.dev), [Sapper](https://sapper.svelte.dev), [Material Design Components](https://github.com/material-components/material-components-web), and [wavesurfer.js](https://wavesurfer-js.org/).

# Features
- sermon search via elasticsearch
  - reacts instantly to reload from the backend
  - search results displayed in a virtual list for performance
- sermon display
  - with wavesurfer audio player
  - related sermons by series shown in sidebar
  - scripture passages display highlights verses based on sermon's focus (passages loading currently non-functional due to the provider shutting down)

# Usage

## Configuration

Create `src/const/config.js`

It must export the following:

```js
export const devApi = '' // The development env api server base URL
export const prodApi = '' // The production env api server base URL
```

## Deployment

To build the application, run:

```shell
NODE_ENV=production npm run build
```

The following items must be deployed:

```
__sapper__/build
package.json
package-lock.json
static
```

To execute the server, run:

```shell
npm install
npm start
```

# Development

## Running in development mode

```bash
npm install
npm run dev
```

For more information, see [the Sapper documentation](https://sapper.svelte.dev/).
