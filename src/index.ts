import "reflect-metadata";

import {Message, MessageEmbed} from 'discord.js';
import {CommandHandler} from "./command/commandHandler";
import {getLogger, level as logLevel} from "./utils/logger";
import {Parser} from "./command/parser";
import {resolve} from "path";
import {config} from "dotenv";
import {DiscordService} from "./services/discordService";
import {ParsedMessage} from "discord-command-parser";
import {container, injectable} from "tsyringe";
import * as di from "./dependency";
import {ExpressService} from "./services/expressService";

const logger = getLogger();
logger.info("Logging level: " + logLevel);

if (process.env.NODE_ENV !== 'production') {
  config({path: resolve(__dirname, "../../.env")});
}


@injectable()
class Main {
  protected ds: DiscordService = container.resolve<DiscordService>(DiscordService)
  protected app = container.resolve<ExpressService>(ExpressService)
  protected commandHandler = container.resolve<CommandHandler>(CommandHandler)
  protected parser = container.resolve<Parser>(Parser)

  constructor() {
    this.ds.client.on('message', (message: Message) => {
      if (message.author.bot || message.content[0] !== this.parser.prefix) {
        return;
      }

      const pm: ParsedMessage<any> = this.parser.parse(message);
      let m = pm.message;

      if (pm.command == 'help' || !pm.success) {
        let embed = new MessageEmbed()
            .setDescription(this.commandHandler.help);
        return m.channel.send(embed).catch(logger.error);
      }

      try {
        return this.commandHandler.execute(pm);
      } catch (e) {
        let embed = new MessageEmbed()
            .setDescription(e.message);
        m.channel.send(embed);
      }
    });
  }

  async setup() {
    await this.parser.ready
  }
}

di.DependencyInjection.register(container)
container.resolve(Main)
