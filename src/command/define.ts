import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import request from 'request';
import {logger} from "../utils/logger";
import {getChannel} from "../utils/utils";
import {RedisCommand} from "../utils/redisConnector";
import {Client, TextChannel} from "discord.js";

function getRapidApiHeader(apiName: string) {
  return {
    'x-rapidapi-host': environment.rapidApi[apiName].host,
    'x-rapidapi-key': environment.rapidApi[apiName].key
  };
}

export class Define extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word';

  execute(bot: Client, rc: RedisCommand) {
    let options1 = {
      method: 'GET',
      url: `https://wordsapiv1.p.rapidapi.com/words/${rc.arguments[0]}/definitions`,
      headers: getRapidApiHeader("wordsApi")
    };
    let options2 = {
      method: 'GET',
      url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
      headers: getRapidApiHeader("urbanDictionary"),
      qs: {term: rc.arguments[0]},
    };
    logger.debug("defining " + rc.arguments[0]);
    getChannel(bot, rc).then((channel: TextChannel) => {
      let out = `**${rc.arguments[0]}**\n`;
      request(options1, function (error, response, body) {
        if (error) return logger.error(error);
        body = JSON.parse(body);
        // first check the normal dictionary
        if (body.definitions != undefined && body.definitions.length !== 0) {
          body.definitions.forEach(def => {
            logger.debug("found " + def.definition);
            out += `_${def.partOfSpeech}_\t${def.definition}\n`;
          });
          return channel.send(out).catch(logger.error);
        } else {
          // then fall back to urban dictionary
          request(options2, (error, response, body) => {
            if (error) throw new Error(error);
            body = JSON.parse(body);
            if (body.list.length === 0) return channel.send("word not found");

            let def = body.list[0];
            logger.debug("found " + def.definition);
            out += `${def.definition}\n`;
            out += `\n> ${def.example.replace(/\n/g, '\n> ')}\n`;
            return channel.send(out.replace(/[\[\]]/g, '')).catch(logger.error);
          });
        }
      });
    });
  }
}
