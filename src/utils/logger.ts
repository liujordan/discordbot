import * as winston from 'winston';

const {combine, timestamp, label, printf} = winston.format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
export const level = 'debug';


function addLabeledLogger(s?: string) {
  winston.loggers.add(s || "default", {
    level: level,
    format: combine(
      label({label: s || "default"}),
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
  addLabeledLogger();
  addLabeledLogger('redis');
  addLabeledLogger('commands');
}

export const logger = winston.loggers.get('default');