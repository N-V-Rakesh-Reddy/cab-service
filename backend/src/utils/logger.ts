import { Request } from 'express';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any; // Allow additional properties
}

class Logger {
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    const errorStr = error ? ` | Error: ${error.message || error}` : '';
    
    return `[${timestamp}] ${level} ${message} ${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: any) {
    const formattedMessage = this.formatMessage(level, message, context, error);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  error(message: string, context?: LogContext, error?: any) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Extract context from Express request
  getRequestContext(req: Request, userId?: string): LogContext {
    return {
      userId,
      requestId: this.generateRequestId(),
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
  }
}

export const logger = new Logger();
