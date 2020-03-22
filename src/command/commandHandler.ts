import {Ndefine} from "./ndefine";
import {Top} from "./top";
import {Command} from "./baseCommand";
import {Client, TextChannel} from "discord.js";
import RedisSMQ, {QueueMessage} from "rsmq";
import {RedisCommand, RedisConnector} from "../utils/redisConnector";
import {Define} from "./define";
import {getChannel} from "../utils/utils";
import {getLogger} from "../utils/logger";
import {Me} from "./me";
import {MongoConnector} from "../utils/mongoConnector";
import {Shop} from "./shop";
import {Test} from "./test";
import {Inv} from "./inv";

const logger = getLogger('commands');
const redis = RedisConnector.getInstance();

export class CommandHandler {
  commands = {};
  bot: Client;

  constructor(bot: Client, rsmq: RedisSMQ, mc: MongoConnector) {
    this.bot = bot;
    this.addCommand('ndefine', new Ndefine(bot, mc));
    this.addCommand('top', new Top(bot, mc));
    this.addCommand('define', new Define(bot, mc));
    this.addCommand('me', new Me(bot, mc));
    this.addCommand('shop', new Shop(bot, mc));
    this.addCommand('inv', new Inv(bot, mc));
    if (process.env.DISCORDBOT_ENV !== 'production') {
      this.addCommand('test', new Test(bot, mc));
    }


    // take on all available jobs on create
    rsmq.getQueueAttributes({qname: redis.qname}, (err, resp) => {
      this.dequeue(resp, redis, bot);
    });

    // listen to new jobs
    redis.subscription.on("message", () => {
      rsmq.getQueueAttributes({qname: redis.qname}, (err, resp) => {
        if (err) return logger.error(err);
        this.dequeue(resp, redis, bot);
      });
    });
  }

  private dequeue(resp: RedisSMQ.QueueAttributes, redis: RedisConnector, bot: Client) {
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
          this.execute(data);
        }
      });
    }
  }

  addCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  getHelp(): string {
    let out = "";
    out += `Version ${this.getVersion()}\n`;
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

  execute(msg: RedisCommand) {
    let command: Command = this.commands[msg.command];
    if (command) {
      command.execute(msg);
    } else {
      logger.warn(`No command '${msg.command}'`);
    }
  }
}