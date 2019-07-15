# Config

Create `src/const/config.js`

It must export the following:

```js
export const devApi = '' // The development env api server base URL
export const prodApi = '' // The production env api server base URL
```

# Development mode

```bash
npm install
npm run dev
```

# Production mode and deployment

To start a production version of your app, run `npm run build && npm start`. This will disable live reloading, and activate the appropriate bundler plugins.
