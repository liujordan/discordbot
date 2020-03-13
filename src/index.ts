import {Client, Message, TextChannel} from 'discord.js';
import {environment} from './config/environment';
import request from 'request';
import {CommandHandler} from "./command/commandHandler";
import {level as logLevel, logger} from "./utils/logger";
import {Parser} from "./command/parser";
import {RedisConnector} from "./utils/redisConnector";

const ES_NODE = environment.es.host;
const bot: Client = new Client();
const redisConnector = RedisConnector.getInstance();

logger.info("Logging level: " + logLevel);

function publisher(bot) {
  let parser = new Parser();

  bot.on('message', (message: Message) => {
    if (message.author.bot) return;
    if (message.content == "good bot") message.channel.send("Thanks <3").catch(logger.error);
    if (message.content == "bad bot") message.channel.send("Your mom a hoe").catch(logger.error);
    let pm = parser.parse(message);
    if (!pm.success) return;
    logger.debug(pm.message.toString());
    redisConnector.sendCommand(pm).catch(logger.error);
  });
}

switch (environment.mode) {
  case "publisher":
    logger.info("Starting publisher...");
    // forwarding all messages to ES
    bot.on('message', message => {
      // skip the message if it's from a bot
      if (message.author.bot || !message.guild) return;

      // send message to ES
      request.post(`${ES_NODE}/discord_write/_doc/`, {
        json: {
          content: message.content,
          createdAt: message.createdAt,
          author: {
            username: message.author.username
          },
          channel: {
            name: (message.channel as TextChannel).name
          },
          guild: {
            name: message.guild.name
          }
        },
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${environment.es.auth.username}:${environment.es.auth.password}`).toString('base64')
        },
        agentOptions: {
          rejectUnauthorized: false
        }
      });
    });
    publisher(bot);
    break;
  case "subscriber":
    logger.info("Starting subscriber...");
    new CommandHandler(bot, redisConnector.rsmq);
    break;
  default:
    throw new Error("Invalid DISCORDBOT_MODE. only 'subscriber' or 'publisher'");
}

bot.on('ready', () => {
  bot.user.setActivity("%help").catch(logger.error);
  logger.info("Discord Client ready");
});


bot.login(environment.discord.auth.token).catch(logger.error);

