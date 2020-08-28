# RRPC Sermons Frontend

The frontend service powering [the Russell RPC Sermons website](http://sermons.russellrpc.org/). Built with [Svelte](https://svelte.dev), [Sapper](https://sapper.svelte.dev), [Material Design Components](https://github.com/material-components/material-components-web), and [wavesurfer.js](https://wavesurfer-js.org/).

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