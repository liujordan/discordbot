import {BaseCommand, ICommand} from "./commands/baseCommand";
import {getLogger} from "../utils/logger";
import {ParsedMessage} from "discord-command-parser";
import {container} from "tsyringe";

const logger = getLogger('commands');

export class CommandHandler {
    commands = {}

    constructor() {
        container.resolveAll<BaseCommand>("Command").forEach(cmd => {
            this.commands[cmd.name] = cmd
        })
    }

    get help(): string {
        let out = "";
        if (this.version) {
            out += `Version ${this.version}\n`;
        }
        for (let c in this.commands) {
            let cmd: ICommand = this.commands[c];
            out += `\`${c}\`: ${cmd.helpString}\n`;
            if (cmd.exampleString != '') out += `\t_${cmd.exampleString}_\n`;
        }
        return out;
    }

    get version(): string {
        return process.env.BOT_VERSION;
    }

    execute(msg: ParsedMessage<any>) {
        let command: ICommand = this.commands[msg.command];
        if (command) {
            command.execute(msg).catch(err => {
                throw new Error(err);
            });
        } else {
            logger.warn(`No command '${msg.command}'`);
        }
    }
}

