import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {normalDefine} from "../utils/rapidApi";
import {ParsedMessage} from "discord-command-parser";

export class Ndefine extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word using the normal dictionary';
  exampleString = `${environment.bot.prefix}ndefine dictionary`;

  async execute(rc: ParsedMessage): Promise<void> {
    this.logger.debug("defining " + rc.arguments[0]);
    let word = rc.arguments[0];
    normalDefine(word)
      .then(resp => {
        let body = resp.data;
        let out = `**${body.word}**\n`;
        // first check the normal dictionary
        if (body.definitions != undefined && body.definitions.length !== 0) {
          body.definitions.forEach(def => {
            this.logger.debug("found " + def.definition);
            out += `_${def.partOfSpeech}_\t${def.definition}\n`;
          });
          return this.send(rc, out);
        } else {
          return this.send(rc, "word not found");
        }
      })
      .catch(err => this.logger.error(err.response.data));
  }
}
