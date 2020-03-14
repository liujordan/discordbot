import * as winston from 'winston';

const {combine, timestamp, label, printf} = winston.format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
export const level = 'debug';

function addLabeledLogger(s: string) {
  winston.loggers.add(s, {
    level: level,
    format: combine(
      label({label: s}),
      timestamp(),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({filename: 'error.log', level: 'error'}),
      new winston.transports.File({filename: 'combined.log'})
    ]
  });
}

if (process.env.NODE_ENV !== 'production') {
  addLabeledLogger("default");
  addLabeledLogger('redis');
  addLabeledLogger('commands');
}

export function getLogger(s?) {
  return winston.loggers.get(s || 'default');
}
