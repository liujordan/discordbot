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
import {Readiable} from "./utils/async";

const logger = getLogger();
logger.info("Logging level: " + logLevel);

if (process.env.NODE_ENV !== 'production') {
  config({path: resolve(__dirname, "../../.env")});
}

@Service()
class Main extends Readiable {
  constructor(
    readonly ds: DiscordService,
    readonly rqs: RedisQueueService,
    readonly commandHandler: CommandHandler
  ) {
    super();
  }

  async setup() {
    const parser = new Parser();
    await parser.ready;

    this.ds.client.on('message', (message: Message) => {

      if (message.author.bot || message.content[0] !== parser.prefix) {
        return;
      }

      const pm: ParsedMessage<any> = parser.parse(message);
      let m = pm.message;

      if (pm.command == 'help' || !pm.success) {
        let embed = new MessageEmbed()
          .setDescription(this.commandHandler.getHelp());
        m.channel.send(embed).catch(logger.error);
      } else {
        try {
          this.commandHandler.execute(pm);
        } catch (e) {
          let embed = new MessageEmbed()
            .setDescription(e.message);
          m.channel.send(embed);
        }
      }
    });

    this.ds.login();
  }
}

Injector.resolve(Main);
