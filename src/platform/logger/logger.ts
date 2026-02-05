type LogLevel = "debug" | "info" | "warn" | "error";

export class AppLogger {
  private loggerName = "AppLogger";

  constructor(name?: string) {
    this.loggerName = name || this.loggerName;
  }

  private baseLog(level: LogLevel, message: string, meta?: unknown) {
    const entry = {
      ts: new Date().toISOString(),
      logger: this.loggerName,
      level: level,
      rid: (globalThis as any).__RID__,
      msg: message,
      ...(meta ? { meta } : {}),
    };

    console.log(JSON.stringify(entry));
  }

  debug(msg: string, meta?: unknown) {
    this.baseLog("debug", msg, meta);
  }

  info(msg: string, meta?: unknown) {
    this.baseLog("info", msg, meta);
  }

  warn(msg: string, meta?: unknown) {
    this.baseLog("warn", msg, meta);
  }

  error(msg: string, meta?: unknown) {
    this.baseLog("error", msg, meta);
  }
}
