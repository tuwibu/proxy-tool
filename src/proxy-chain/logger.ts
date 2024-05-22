import { blue, cyan, gray, green, red, yellow } from 'colorette'
import dayjs from 'dayjs'

const logger = ({
  level,
  message,
}: {
  level: 'log' | 'success' | 'info' | 'warn' | 'error' | 'debug'
  message: any
}) => {
  level === 'log' && (level = 'info')
  let levelFormat = ''
  switch (level) {
    case 'error':
      levelFormat = red(`[${level}]`)
      break
    case 'warn':
      levelFormat = yellow(`[${level}]`)
      break
    case 'debug':
      levelFormat = blue(`[${level}]`)
      break
    case 'success':
      levelFormat = green(`[${level}]`)
      break
    default:
      levelFormat = cyan(`[${level}]`)
      break
  }
  const dateFormat = gray(`[${dayjs().format('DD/MM/YYYY HH:mm:ss')}]`)
  if (level === 'success') level = 'log'
  console[level](dateFormat, levelFormat, ...message)
}
export default {
  log: (...args: any[]) => {
    logger({
      level: 'log',
      message: args,
    })
  },
  info: (...args: any[]) => {
    logger({
      level: 'info',
      message: args,
    })
  },
  success: (...args: any[]) => {
    logger({
      level: 'success',
      message: args,
    })
  },
  warn: (...args: any[]) => {
    logger({
      level: 'warn',
      message: args,
    })
  },
  error: (...args: any[]) => {
    logger({
      level: 'error',
      message: args,
    })
  },
  debug: (...args: any[]) => {
    logger({
      level: 'debug',
      message: args,
    })
  },
}
