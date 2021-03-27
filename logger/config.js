const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, errors } = format

const _format = combine(timestamp(), json(), errors({ stack: true }));



const logger = createLogger({
    level: process.env.LOG_LEVEL,
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: _format
        }),
        new transports.File({
            filename: './logs/all.log',
            format: _format
        })
    ]
})

module.exports = logger;
