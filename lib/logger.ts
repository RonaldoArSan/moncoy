/**
 * Sistema de logging para produção
 * Em produção, os logs são enviados para o console apenas se DEBUG estiver habilitado
 * Em desenvolvimento, todos os logs são exibidos
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true'

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Em produção, só loga erros ou se debug estiver habilitado
    if (!isDevelopment && !isDebugEnabled) {
      return level === 'error' || level === 'warn'
    }
    return true
  }

  log(...args: any[]) {
    if (this.shouldLog('log')) {
      console.log('[LOG]', ...args)
    }
  }

  info(...args: any[]) {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args: any[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args)
      // Em produção, você pode enviar para um serviço de monitoramento
      // como Sentry, LogRocket, etc.
      if (!isDevelopment) {
        // TODO: Integrar com serviço de monitoramento
        // sendToMonitoringService({ level: 'error', message: args })
      }
    }
  }

  debug(...args: any[]) {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args)
    }
  }

  // Método para logar apenas em desenvolvimento
  dev(...args: any[]) {
    if (isDevelopment) {
      console.log('[DEV]', ...args)
    }
  }
}

export const logger = new Logger()

// Helper para substituir console.log direto
export default logger
