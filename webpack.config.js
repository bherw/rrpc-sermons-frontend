const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const pkg = require('./package.json')
const preprocess = require('svelte-preprocess')

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const extensions = ['.mjs', '.js', '.json', '.svelte', '.html', '.scss']
const mainFields = ['svelte', 'module', 'browser', 'main']
const modules = ['node_modules', 'src']

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { extensions, mainFields, modules },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
              preprocess: preprocess(),
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader', // translates CSS into CommonJS
            { loader: 'sass-loader', options: { includePaths: ['./node_modules'] } }, // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(graphql|gql)$/,
          use: 'graphql-mini-transforms/webpack',
          exclude: /node_modules/,
        },
      ],
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
    ].filter(Boolean),
    devtool: dev && 'inline-source-map',
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: 'node',
    resolve: { extensions, mainFields, modules },
    externals: Object.keys(pkg.dependencies).concat('encoding'),
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
              dev,
              preprocess: preprocess(),
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            'css-loader', // translates CSS into CommonJS
            { loader: 'sass-loader', options: { includePaths: ['./node_modules'] } }, // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(graphql|gql)$/,
          use: 'graphql-mini-transforms/webpack',
          exclude: /node_modules/,
        },
      ],
    },
    mode: process.env.NODE_ENV,
    performance: {
      hints: false, // it doesn't matter if server.js is large
    },
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV,
  },
}
