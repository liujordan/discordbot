import {RedisCommand} from "../utils/redisConnector";
import {Client} from "discord.js";

export interface Command {
  name
  execute: (Client, RedisCommand) => any
  help: () => string;
}

export class BaseCommand implements Command {
  name: string = "DEFAULT";
  helpString: string = "DEFAULT HELP STRING";

  execute(bot: Client, message: RedisCommand) {
    return;
  }

  help() {
    return `${this.name}: ${this.helpString}`;
  }
}