import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import request from 'request';
import {RedisCommand} from "../services/redisService";

const nWordRequest = require('@requests/nword_count.json');

const ES_NODE = environment.es.host;

export class Top extends BaseCommand {
  name = 'top';
  helpString = 'Gets the top 5 n-word users';
  exampleString = `${environment.bot.prefix}top [--limit <int>] [--words <comma separated list>]`;


  execute(rc: RedisCommand) {
    let swearCountRequest = JSON.parse(JSON.stringify(nWordRequest));

    // parse input parameters to form request
    let limitIdx = rc.arguments.indexOf('--limit');
    let wordsIdx = rc.arguments.indexOf('--words');

    if (limitIdx >= 0) {
      // parse limit, return error if not provided correctly, else set request limit
      let limit = parseInt(rc.arguments[limitIdx + 1]);
      if (isNaN(limit)) {
        return this.send(rc, `Incorrect usage of --limit parameter\nUsage: ${this.exampleString}`);
      }
      swearCountRequest['aggs']['counts']['terms']['size'] = limit;
    }

    let words;
    if (wordsIdx >= 0) {
      // parse words, return error if not provided correctly, else set words to query
      words = rc.arguments[wordsIdx + 1];
      if (words == null) {
        return this.send(rc, `Incorrect usage of --words parameter\nUsage: ${this.exampleString}`);
      }
      swearCountRequest['query']['bool']['filter'] = [
        { match_all: {} },
        { bool:
          {
            should: words.split(',').map(
              (word: string) => {
                return {
                  multi_match: {
                    type: 'best_fields',
                    query: word,
                    lenient: true
                  }
                }
              }
            ),
            minimum_should_match: 1
          }
        }
      ]
    }

    // make request against discord to search messages
    request.post(`${ES_NODE}/discord_read/_search/`, {
      json: swearCountRequest,
      headers: {'Authorization': 'Basic ' + Buffer.from(`${environment.es.auth.username}:${environment.es.auth.password}`).toString('base64')},
      agentOptions: {rejectUnauthorized: false}
    }, (err, res, body) => {
      if (err) return this.logger.error(err);
      let output = "";

      // formulate text output based on results and write
      body.aggregations.counts.buckets.forEach((bucket) => {
        output += `${bucket.key} said ${wordsIdx >= 0 ? words : 'the n-word'} ${bucket.doc_count} time${bucket.doc_count > 1 ? 's' : ''}\n`;
      });

      this.send(rc, output);
    });
  }
}
