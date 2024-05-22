import logger from './logger';
import * as ProxyChain from './proxy-chain'
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
    // prepareRequestFunction: () => {
    //   return {
    //     requestAuthentication: false,
    //     upstreamProxyUrl: forward,
    //   }
    // },
  })
  server.listen(() => {
    logger.success(`Proxy server is listening on port ${port}`)
  })
  server.on('requestFailed', async ({ request, error }) => {
    logger.error(`Request failed: ${request.url}`)
  })
  // Emitted when HTTP connection is closed
  server.on('connectionClosed', ({ connectionId, stats }) => {
    logger.info(`Connection ${connectionId} closed`)
    logger.debug('Connection stats:', stats)
  })
})()
