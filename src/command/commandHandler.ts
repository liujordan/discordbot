import {Ndefine} from "./ndefine";
import {Command} from "./baseCommand";
import {getLogger} from "../utils/logger";
import {Service} from "../di/serviceDecorator";
import {Injector} from "../di/injector";
import {Define} from "./define";
import {Test} from "./test";
import {Inv} from "./inv";
import {Shop} from "./shop";
import {Me} from "./me";
import {ParsedMessage} from "discord-command-parser";

const logger = getLogger('commands');

@Service()
export class CommandHandler {
  commands = {};

  featureFlags = [
    {
      name: 'ndefine',
      class: Ndefine,
      active: true,
    },
    {
      name: 'define',
      class: Define,
      active: true,
    },
    {
      name: 'me',
      class: Me,
      active: false,
    },
    {
      name: 'shop',
      class: Shop,
      active: true,
    },
    {
      name: 'inv',
      class: Inv,
      active: false,
    },
    {
      name: 'test',
      class: Test,
      active: process.env.DISCORDBOT_ENV !== 'production',
    },
  ];

  constructor() {
    this.featureFlags.forEach(f => {
      if (f.active) {
        this.addCommand(f.name, Injector.resolve<Command>(f.class));
      }
    });
  }

  addCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  getHelp(): string {
    let out = "";
    if (this.getVersion()) {
      out += `Version ${this.getVersion()}\n`;
    }
    for (let c in this.commands) {
      let cmd: Command = this.commands[c];
      out += `\`${c}\`: ${cmd.helpString}\n`;
      if (cmd.exampleString != '') out += `\t_${cmd.exampleString}_\n`;
    }
    return out;
  }

  getVersion(): string {
    return process.env.BOT_VERSION;
  }

  execute(msg: ParsedMessage) {
    let command: Command = this.commands[msg.command];
    if (command) {
      command.execute(msg).catch(err => {
        throw new Error(err);
      });
    } else {
      logger.warn(`No command '${msg.command}'`);
    }
  }
}
