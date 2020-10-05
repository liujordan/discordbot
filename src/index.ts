import {Message, MessageEmbed} from 'discord.js';
import {CommandHandler} from "./command/commandHandler";
import {getLogger, level as logLevel} from "./utils/logger";
import {Parser} from "./command/parser";
import {resolve} from "path";
import {config} from "dotenv";
import {Injector} from "./di/injector";
import {DiscordService} from "./services/discordService";
import {Service} from "./di/serviceDecorator";
import {RedisQueueService} from "./services/redisQueueService";
import {ParsedMessage} from "discord-command-parser";

const logger = getLogger();
logger.info("Logging level: " + logLevel);

if (process.env.NODE_ENV !== 'production') {
  config({path: resolve(__dirname, "../../.env")});
}

@Service()
class Main {
  constructor(
    public ds: DiscordService,
    public rqs: RedisQueueService,
    readonly commandHandler: CommandHandler
  ) {
    ds.login();

    ds.client.on('message', (message: Message) => {
      const parser = new Parser();
      const pm: ParsedMessage = parser.parse(message);
      let m = pm.message;

      if (pm.command == 'help') {
        let embed = new MessageEmbed()
          .setDescription(this.commandHandler.getHelp());
        m.message.channel.send(embed).catch(logger.error);
      } else {
        this.commandHandler.execute(pm);
      }
    });
  }
}

Injector.resolve(Main);
