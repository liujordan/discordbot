const Discord = require('discord.js');
const request = require('request');
const settings = require('./settings');
const ES_NODE = settings.es.host;
const bot = new Discord.Client();

// filters message to keep only the content we're interested in
function messageToJson(message) {
  return {
    content: message.content,
    createdAt: message.createdAt,
    author: {
      username: message.author.username
    },
    channel: {
      name: message.channel.name
    },
    guild: {
      name: message.guild.name
    }
  }
}

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', message => {
  // skip the message if it's from a bot
  if(message.author.bot || !message.guild) return;

  // send message to ES
  request.post(`${ES_NODE}/discord_write/_doc/`, {
    json: messageToJson(message),
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${settings.es.auth.username}:${settings.es.auth.password}`).toString('base64')
    },
    agentOptions: {
      rejectUnauthorized: false
    }
  }, (err, res, body) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })
});

bot.login(settings.discord.auth.token);