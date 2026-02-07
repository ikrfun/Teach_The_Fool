type Level = 'debug' | 'info' | 'warn' | 'error'

function shouldLog(level: Level): boolean {
  const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 }
  const current = (process.env.LOG_LEVEL as Level) || 'info'
  return order[level] >= order[current]
}

function log(level: Level, message: string, meta?: unknown) {
  if (!shouldLog(level)) return
  const line = { level, message, meta }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(line))
}

export const logger = {
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
}
