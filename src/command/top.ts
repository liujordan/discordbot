import {logger} from "../utils/logger";
import {environment} from '../config/environment';
import {BaseCommand} from 'command/baseCommand';
import request from 'request';
import {RedisCommand} from "../utils/redisConnector";
import {Client, TextChannel} from "discord.js";

const nwordRequest = require('../../nword_count_request');

const ES_NODE = environment.es.host;

export class Top extends BaseCommand {
  name = 'top';

  execute(bot: Client, rc: RedisCommand) {
    request.post(`${ES_NODE}/discord_read/_search/`, {
      json: nwordRequest,
      headers: {'Authorization': 'Basic ' + Buffer.from(`${environment.es.auth.username}:${environment.es.auth.password}`).toString('base64')},
      agentOptions: {rejectUnauthorized: false}
    }, (err, res, body) => {
      if (err) return logger.error(err);
      let output = "";

      body.aggregations.counts.buckets.forEach((bucket) => {
        output += `${bucket.key} said the n-word ${bucket.doc_count} time${bucket.doc_count > 1 ? 's' : ''}\n`;
      });
      
      bot.channels.fetch(rc.data.channel_id)
        .then((channel: TextChannel) => {
          channel.send(output).catch(logger.error);
        });
    });
  }
}
