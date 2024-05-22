import * as ProxyChain from './pkg/proxy-chain'
import * as yargs from 'yargs'

const argv = yargs.options({
  port: {
    alias: 'p',
    description: 'Port to listen on',
    demandOption: true,
  },
  forward: {
    alias: 'f',
    description: 'Forward proxy: (http|socks5)://user:pass@host:port',
    demandOption: true,
  },
}).argv

;(async () => {
  const { port, forward } = argv as { port: number; forward: string }
  const server = new ProxyChain.Server({
    port: port,
    verbose: true,
    prepareRequestFunction: () => {
      return {
        requestAuthentication: false,
        upstreamProxyUrl: forward,
      }
    },
  })
  server.listen(() => {
    console.log(`Proxy server is listening on port ${port}`)
  })
  server.on('requestFailed', async ({ request, error }) => {
    console.error(`Request failed: ${request.url}`)
    console.error(error)
  })
  // Emitted when HTTP connection is closed
  server.on('connectionClosed', ({ connectionId, stats }) => {
    console.log(`Connection ${connectionId} closed`)
    console.dir(stats)
  })
})()
