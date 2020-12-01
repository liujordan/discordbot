import {parse, ParsedMessage} from 'discord-command-parser';
import {Message} from 'discord.js';
import {container, injectable} from "tsyringe";
import {getLogger} from "../utils/logger";
import {ConfigProvider} from "../provider/configuration";

const logger = getLogger("parser")

@injectable()
export class Parser {
  prefix: string;
  ready: Promise<void>;
  protected configProvider: ConfigProvider = container.resolve("ConfigProvider")

  constructor() {
    this.ready = new Promise(async (resolve, reject) => {
      const config = await this.configProvider.getConfig();
      this.prefix = config.bot.prefix;
      logger.info("Ready")
      resolve();
    });
  }

  parse(s: Message): ParsedMessage<any> {
    return parse(s, this.prefix);
  }

  help(): string {
    return 'no help';
  }
}
