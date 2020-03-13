import RedisSMQ from "rsmq";
import {environment} from "../config/environment";
import winston from "winston";
import redis from 'redis';
import {ParsedMessage} from "discord-command-parser";

const logger = winston.loggers.get('redis');

export interface RedisCommand {
  command: string
  arguments: string[]
  data: {
    guild_id: string
    message_id: string
    channel_id: string
    user_id: string
    content: string
    channel_type: string
  }
}

export class RedisConnector {
  private static _instance: RedisConnector;
  rsmq: RedisSMQ;
  qname = "DISCORDJOBS";
  client: redis.RedisClient;
  ns = "rsmq";

  constructor() {
    if (RedisConnector._instance) return;
    logger.info("Connecting redis...");
    this.client = redis.createClient({host: environment.redis.host,});

    this.client.on('connect', () => {
      logger.info("Redis is connected");
    });
    this.client.on('reconnecting', () => {
      logger.info("Redis is reconnecting");
    });

    this.client.subscribe(`${this.ns}:rt:${this.qname}`);
    this.rsmq = new RedisSMQ({
      ns: this.ns,
      realtime: true,
    });

    this.rsmq.listQueuesAsync()
      .then(q => {
        if (!q.includes(this.qname)) {
          this.rsmq.createQueue({qname: "DISCORDJOBS"}, function (err, resp) {
            if (err) return logger.error(err);
            if (resp) return logger.info("Created redis queue");
          });
        }
      })
      .catch(logger.error);
    RedisConnector._instance = this;
  }

  static getInstance(): RedisConnector {
    return RedisConnector._instance || new RedisConnector();
  }

  sendCommand(pm: ParsedMessage): Promise<string> {
    let m = pm.message;
    let toSend: RedisCommand = {
      command: pm.command,
      arguments: pm.arguments,
      data: {
        guild_id: m.guild.id,
        message_id: m.id,
        channel_id: m.channel.id,
        user_id: m.author.id,
        content: m.content,
        channel_type: m.channel.type
      }
    };
    let p = this.rsmq.sendMessageAsync({qname: this.qname, message: JSON.stringify(toSend)});
    p.then(() => logger.debug("Sending " + JSON.stringify(toSend)));
    p.catch(logger.error);
    return p;
  }
}