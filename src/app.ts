import logger from './proxy-chain/logger'
import * as ProxyChain from './proxy-chain'
import * as yargs from 'yargs'
import { formatSize } from './proxy-chain/utils/format_size'

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
  let totalSize = 0,
    totalSend = 0,
    totalRecv = 0
  const server = new ProxyChain.Server({
    port: port,
    verbose: true,
    prepareRequestFunction: () => {
      return {
        upstreamProxyUrl: forward,
        requestAuthentication: false,
      }
    },
  })
  server.listen(() => {
    logger.success(`Proxy server is listening on port ${port}`)
  })
  server.on('requestFailed', async ({ request, error }) => {
    logger.error(`Request failed: ${request.url} - ${error.message}`)
  })
  // Emitted when HTTP connection is closed
  server.on('connectionClosed', ({ connectionId, stats }) => {
    logger.info(`Connection ${connectionId} closed`)
    totalSend += stats.srcTxBytes + stats.trgTxBytes
    totalRecv += stats.trgRxBytes + stats.srcRxBytes
    totalSize += stats.srcTxBytes + stats.srcRxBytes + stats.trgRxBytes + stats.trgTxBytes
  })

  setInterval(() => {
    logger.info({
      totalSize: formatSize(totalSize),
      totalSend: formatSize(totalSend),
      totalRecv: formatSize(totalRecv),
    })
  }, 1000)
})()
