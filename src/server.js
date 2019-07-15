import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

let server = polka() // You can also use Express
  .use(compression({ threshold: 0 }))
  .use(sirv('static', { dev }))

if (dev) {
  const proxy = require('http-proxy-middleware')
  server = server.use(proxy('http://192.168.1.3:3000/api', { pathRewrite: { '^/api': '' } }))
}

server.use(sapper.middleware()).listen(PORT, err => {
  if (err) console.log('error', err)
})
