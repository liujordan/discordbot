import {parse, ParsedMessage} from 'discord-command-parser';
import {Message} from 'discord.js';
import {environmentAsync} from '../config/environment';

export class Parser {
  prefix: string;
  ready: Promise<void>;

  constructor() {
    this.ready = new Promise(async (resolve, reject) => {
      const config = await environmentAsync;
      this.prefix = config.bot.prefix;
      resolve();
    });
  }

  parse(s: Message): ParsedMessage {
    return parse(s, this.prefix);
  }

  help(): string {
    return 'no help';
  }
}
