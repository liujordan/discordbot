import {Ndefine} from "./ndefine";
import {Top} from "./top";
import {Command} from "./baseCommand";
import {Client, TextChannel} from "discord.js";
import RedisSMQ, {QueueMessage} from "rsmq";
import winston from "winston";
import {RedisCommand, RedisConnector} from "../utils/redisConnector";
import {Define} from "./define";
import {getChannel} from "../utils/utils";

const logger = winston.loggers.get('commands');

export class CommandHandler {
  commands = {};
  bot: Client;

  constructor(bot: Client, rsmq: RedisSMQ) {
    this.bot = bot;
    this.addCommand('ndefine', new Ndefine(bot));
    this.addCommand('top', new Top(bot));
    this.addCommand('define', new Define(bot));

    // on command message
    let redis = RedisConnector.getInstance();
    redis.client.on("message", (m) => {
      rsmq.getQueueAttributes({qname: redis.qname}, (err, resp) => {
        if (err) {
          console.error(err);
          return;
        }

        for (let i = 0; i < resp.msgs; i++) {
          redis.rsmq.popMessage({qname: redis.qname}, (err, msg: QueueMessage) => {
            if (err) return logger.error(err);
            if (!msg.message) return;
            logger.debug("Recieved: " + msg.message);
            let data: RedisCommand = JSON.parse(msg.message);
            if (data.command == 'help') {
              return getChannel(bot, data).then((channel: TextChannel) => {
                channel.send(this.getHelp()).catch(logger.error);
              });
            } else {
              this.execute(this.bot, data);
            }
          });
        }
      });
    });
  }

  addCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  getHelp(): string {
    let out = "";
    for (let c in this.commands) {
      let cmd: Command = this.commands[c];
      out += `\`${c}\`: ${cmd.helpString}\n`;
      if (cmd.exampleString != '') out += `\t_${cmd.exampleString}_\n`;
    }
    return out;
  }

  execute(bot: Client, msg: RedisCommand) {
    let command = this.commands[msg.command];
    if (command) {
      command.execute(bot, msg);
    } else {
      logger.warn(`No command '${msg.command}'`);
    }
  }
}