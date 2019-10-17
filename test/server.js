const root = process.cwd()
const pkg = require('../package.json')
const Koa = require('koa')
const KoaStatic = require('koa-static')
const path = require('path')

const createRunHandler = require('node-run-listener')

function start(config = {}) {
  const app = new Koa()

  const PORT = config.port || 8430

  const runHandler = createRunHandler({
    name: pkg.name,
    vhost: 'local.sa.sogou.com',
    env: 'production',
    port: PORT
  })

  app.use(KoaStatic(path.resolve(root, 'static')))

  app.listen(PORT, function(err) {
    if (err) throw err

    runHandler()
  })
}

start({
  port: 8430
})
