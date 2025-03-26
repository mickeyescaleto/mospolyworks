import winston from 'winston';

const base = winston.createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD.MM.YYYY HH:mm:ss' }),
    winston.format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    winston.format.colorize(),
    winston.format.printf((info) => {
      const prefix = info.prefix || 'Global';
      return `[${info.timestamp}] [${prefix}] [${info.level}] ${info.message}`;
    }),
  ),
});

export function getLogger(prefix: string) {
  return base.child({ prefix });
}
