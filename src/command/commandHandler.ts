import {Define} from "./define";
import {Help} from "./help";
import {Top} from "./top";
import {Command} from "./baseCommand";
import {Parser} from "./parser";
import {Client} from "discord.js";
import RedisSMQ, {QueueMessage} from "rsmq";
import winston from "winston";
import {RedisCommand, RedisConnector} from "../utils/redisConnector";

const logger = winston.loggers.get('commands');

export class CommandHandler {
  commands = {};
  bot: Client;

  constructor(bot: Client, rsmq: RedisSMQ) {
    this.bot = bot;
    this.addCommand('define', new Define());
    this.addCommand('top', new Top());
    this.addCommand('help', new Help());

    let parser = new Parser();

    // on command message
    let redis = RedisConnector.getInstance();
    redis.client.on("message", (m) => {
      rsmq.getQueueAttributes({qname: redis.qname}, (err, resp) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log("==============================================");
        console.log("=================Queue Stats==================");
        console.log("==============================================");
        console.log("visibility timeout: ", resp.vt);
        console.log("delay for new messages: ", resp.delay);
        console.log("max size in bytes: ", resp.maxsize);
        console.log("total received messages: ", resp.totalrecv);
        console.log("total sent messages: ", resp.totalsent);
        console.log("created: ", resp.created);
        console.log("last modified: ", resp.modified);
        console.log("current n of messages: ", resp.msgs);
        console.log("hidden messages: ", resp.hiddenmsgs);
        for (let i = 0; i < resp.msgs; i++) {
          redis.rsmq.popMessage({qname: redis.qname}, (err, msg: QueueMessage) => {
            if (err) return logger.error(err);
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