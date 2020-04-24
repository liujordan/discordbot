import {Message} from 'discord.js';
import {environment} from './config/environment';
import {CommandHandler} from "./command/commandHandler";
import {getLogger, level as logLevel} from "./utils/logger";
import {Parser} from "./command/parser";
import {resolve} from "path";
import {config} from "dotenv";
import {Injector} from "./di/injector";
import {DiscordService} from "./services/discordService";
import {Service} from "./di/serviceDecorator";
import {RedisQueueService} from "./services/redisQueueService";

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
    let bot = ds.client;
    switch (environment.mode) {
      case "publisher":
        logger.info("Starting publisher...");

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
        break;
      default:
        throw new Error("Invalid DISCORDBOT_MODE. only 'subscriber' or 'publisher'");
    }
    ds.login();
  }
}

Injector.resolve(Main);
