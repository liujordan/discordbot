import {Ndefine} from "./ndefine";
import {Help} from "./help";
import {Top} from "./top";
import {Command} from "./baseCommand";
import {Client} from "discord.js";
import RedisSMQ, {QueueMessage} from "rsmq";
import winston from "winston";
import {RedisCommand, RedisConnector} from "../utils/redisConnector";
import {Define} from "./define";

const logger = winston.loggers.get('commands');

export class CommandHandler {
  commands = {};
  bot: Client;

  constructor(bot: Client, rsmq: RedisSMQ) {
    this.bot = bot;
    this.addCommand('ndefine', new Ndefine());
    this.addCommand('top', new Top());
    this.addCommand('help', new Help());
    this.addCommand('define', new Define());

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

            this.execute(this.bot, data);
          });
        }
      });
    });
  }

  addCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  execute(bot: Client, msg: RedisCommand): any {
    let command = this.commands[msg.command];
    if (command) {
      let res = command.execute(bot, msg);
      if (!res) command.help();
    } else {
      logger.warn(`No command '${msg.command}'`);
    }
  }
}