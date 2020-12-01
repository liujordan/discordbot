import {Logger} from "winston";
import {getLogger} from "../../utils/logger";
import {ParsedMessage} from "discord-command-parser";
import {NotImplemented} from "../../exceptions";

export interface ICommand {
  name: string
  helpString: string
  exampleString?: string
  execute: (m: ParsedMessage<any>) => Promise<void>
}

export class BaseCommand implements ICommand {
  name: string = "DEFAULT";
  helpString: string = "DEFAULT HELP STRING";
  exampleString: string = "";
  logger: Logger = getLogger('commands');

  async execute(message: ParsedMessage<any>): Promise<void> {
    throw NotImplemented;
  }

  send(rc: ParsedMessage<any>, message): void {
    rc.message.channel.send(message).catch(this.logger.error);
  }
}
