export const environment = require('../../config.json');
environment.mode = process.env.DISCORDBOT_MODE || "publisher";