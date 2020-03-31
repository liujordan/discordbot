import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {RedisCommand} from "../services/redisService";
import {urbanDefine} from "../utils/rapidApi";

export class Define extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;


  execute(rc: RedisCommand) {
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
