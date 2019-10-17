const root = process.cwd()
const pkg = require('../package.json')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaCorsJS = require('../lib/index.js')

const createRunHandler = require('node-run-listener')
const router = new KoaRouter()

function isLegalOrigin(origin) {
  var regexps = [/^http(s)?:\/\/([\s\S]+.)?sogo(u)?.com/gi]
  return regexps.some(function(re) {
    return re.test(origin)
  })
}

function start(config = {}) {
  const app = new Koa()

  const PORT = config.port || 8430

  const runHandler = createRunHandler({
    name: pkg.name,
    vhost: 'local.sa.sogou.com',
    env: 'production',
    port: PORT
  })

  app.use(
    KoaCorsJS({
      origin: function(ctx) {
        let requestOrigin = ctx.get('Origin')
        if (requestOrigin) {
          if (
            isLegalOrigin(requestOrigin) &&
            ['/api/test'].includes(ctx.path)
          ) {
            return requestOrigin
          }
        }

        return false
      }
    })
  )

  router.get('/api/test', async function apiTest(ctx, next) {
    let Origin = ctx.get('Origin')

    if (!isLegalOrigin(Origin)) {
      ctx.status = 403
      ctx.body = 'Hello, world'
    } else {
      console.log('Request Origin Server')

      ctx.body = {
        code: 0,
        data: {
          name: 'xiao'
        },
        msg: 'success'
      }
    }
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.listen(PORT, function(err) {
    if (err) throw err

    runHandler()
  })
}

start({
  port: 8432
})
