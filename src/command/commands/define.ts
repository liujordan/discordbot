import {BaseCommand} from './baseCommand';
import {RapidApi} from "../../utils";
import {ParsedMessage} from "discord-command-parser";
import {inject, injectable} from "tsyringe";
import {ConfigProvider} from "../../provider/configuration";

@injectable()
export class Define extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word or phrase using the urban dictionary';

  constructor(
    @inject("ConfigProvider") public config: ConfigProvider,
    protected rapidApi: RapidApi
  ) {
    super();
    config.getConfig().then(config => {
      this.exampleString = `${config.bot.prefix}define wombo combo`;
    });
  }


  async execute(rc: ParsedMessage<any>): Promise<void> {
    let word = rc.arguments.join(" ");
    this.logger.debug("defining " + word);
    this.rapidApi.urbanDefine(rc.arguments.join(" "))
      .then(resp => {
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
