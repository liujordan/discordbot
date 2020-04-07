import {Client, Message, TextChannel} from 'discord.js';
import {environment} from './config/environment';
import request from 'request';
import {CommandHandler} from "./command/commandHandler";
import {getLogger, level as logLevel} from "./utils/logger";
import {Parser} from "./command/parser";
import {resolve} from "path";
import {config} from "dotenv";
import {Injector} from "./di/injector";
import {DiscordService} from "./services/discordService";
import {Service} from "./di/serviceDecorator";
import {RedisQueueService} from "./services/redisQueueService";

const ES_NODE = environment.es.host;
const ds: DiscordService = Injector.resolve<DiscordService>(DiscordService);

const logger = getLogger();
logger.info("Logging level: " + logLevel);

if (process.env.NODE_ENV !== 'production') {
  config({path: resolve(__dirname, "../../.env")});
}

@Service()
class Main {
  constructor(
    public ds: DiscordService,
    public rqs: RedisQueueService
  ) {
    let bot = ds.client
    switch (environment.mode) {
      case "publisher":
        logger.info("Starting publisher...");
        // forwarding all messages to ES
        if (process.env.DISCORDBOT_ENV == 'production') {
          bot.on('message', message => {
            if (
              message.author.bot ||
              !message.guild ||
              message.guild.id != '366719645954211840'
            ) {
              return;
            }
            logger.info("Forwarding to ES");

            // send message to ES
            request.post(`${ES_NODE}/discord_write/_doc/`,
              {
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
            }, function(err, res) {
              if (err) return console.log(err);
              console.log(res);
              });
          });
        }
        let parser = new Parser();

        bot.on('message', (message: Message) => {
          if (message.author.bot) return;
          if (message.content == "good bot") message.channel.send("Thanks <3").catch(logger.error);
          if (message.content == "bad bot") message.channel.send("Your mom a hoe").catch(logger.error);
          let pm = parser.parse(message);
          if (!pm.success) return;
          logger.info(pm.message.toString());
          this.rqs.sendCommand(pm).catch(logger.error);
        });
        break;
      case "subscriber":
        logger.info("Starting subscriber...");
        Injector.resolve(CommandHandler);
        // new CommandHandler(bot, redisConnector.rsmq, mongoConnector);
        break;
      default:
        throw new Error("Invalid DISCORDBOT_MODE. only 'subscriber' or 'publisher'");
    }
    ds.login();
  }
}
Injector.resolve(Main);
