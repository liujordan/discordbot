import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import request from 'request';
import {RedisCommand} from "../services/redisService";

const nwordRequest = require('../../nword_count_request');

const ES_NODE = environment.es.host;

export class Top extends BaseCommand {
  name = 'top';
  helpString = 'Gets the top 10 n-word users';

  execute(rc: RedisCommand) {
    request.post(`${ES_NODE}/discord_read/_search/`, {
      json: nwordRequest,
      headers: {'Authorization': 'Basic ' + Buffer.from(`${environment.es.auth.username}:${environment.es.auth.password}`).toString('base64')},
      agentOptions: {rejectUnauthorized: false}
    }, (err, res, body) => {
      if (err) return this.logger.error(err);
      let output = "";

      body.aggregations.counts.buckets.forEach((bucket) => {
        output += `${bucket.key} said the n-word ${bucket.doc_count} time${bucket.doc_count > 1 ? 's' : ''}\n`;
      });

      this.send(rc, output);

    });
  }
}
