import {environmentAsync} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {urbanDefine} from "../utils/rapidApi";
import {ParsedMessage} from "discord-command-parser";
import {DiscordService} from "../services/discordService";
import {RedisService} from "../services/caching/redisService";
import {MaplestoryApi} from "../services/maplestoryService";

export class Define extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word or phrase using the urban dictionary';

  constructor(
    public ds: DiscordService,
    public rs: RedisService,
    public ms: MaplestoryApi
  ) {
    super(ds, rs, ms);
    environmentAsync.then(config => {
      this.exampleString = `${config.bot.prefix}define wombo combo`;
    });
  }


  async execute(rc: ParsedMessage<any>): Promise<void> {
    let word = rc.arguments.join(" ");
    this.logger.debug("defining " + word);
    urbanDefine(rc.arguments.join(" "))
      .then(resp => {
        this.logger.debug("found def for " + word);
        let body = resp.data;
        if (body.list.length === 0) return this.send(rc, "word not found");
        let def = body.list[0];
        let out = `**${def.word}**\n`;

        out += `${def.definition}\n`;
        out += `\n> ${def.example.replace(/\n/g, '\n> ')}\n`;
        out = out.replace(/[\[\]]/g, '');
        out.match(/[\s\S]{1,2000}/g).forEach(msg => {
          this.send(rc, msg);
        });
      })
      .catch(err => {
        this.logger.error(JSON.stringify(err.response.data));
      });
  }
}
