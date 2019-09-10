const Discord = require('discord.js');
const request = require('request');
const settings = require('./settings');
const ES_NODE = settings.es.host;
const bot = new Discord.Client();
const yargs = require('yargs');


const parser = yargs
    .command('top', 'Shows the 5 people who say the n-word the most')
    .exitProcess(false)
    .help(false);
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
  bot.user.setActivity("%help");
  console.log('I am ready!');
});

const nwordRequest = require('./nword_count_request');
// on command message
bot.on('message', message => {
  if (!message.content.startsWith(settings.bot.prefix)) return;

  const withoutPrefix = message.content.slice(settings.bot.prefix.length);
  const split = withoutPrefix.split(/ +/);
  command = parser.parse(split);

  if (command._[0] == 'top') {
    request.post(`${ES_NODE}/discord_read/_search/`, {
      json: nwordRequest,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${settings.es.auth.username}:${settings.es.auth.password}`).toString('base64')
      },
      agentOptions: {
        rejectUnauthorized: false
      }
    },(err, res, body) => {
      if (err) {
        console.log(err)
        return;
      }
      // console.log(`statusCode: ${res.statusCode}`)
      let output = ""
      body.aggregations.counts.buckets.forEach((bucket) => {
        output += `${bucket.key} said the n-word ${bucket.doc_count} time${bucket.doc_count > 1 ? 's' : ''}\n`
      })
      message.channel.send(output)
    })
  }
  if (command._[0] == 'help') {
    message.channel.send('`top` is the only command rn')
  }
});

// forwarding all messages to ES
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
      console.error(err)
      return;
    }
    // console.log(`statusCode: ${res.statusCode}`)
    // console.log(body)
  })
});

bot.login(settings.discord.auth.token);