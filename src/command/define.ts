import {environment} from '../config/environment';
import {BaseCommand} from 'command/baseCommand';
import request from 'request';
import {logger} from "../utils/logger";
import {getChannel} from "utils/utils";
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
    let options = {
      method: 'GET',
      url: `https://wordsapiv1.p.rapidapi.com/words/${rc.arguments[0]}/definitions`,
      headers: getRapidApiHeader("wordsApi")
    };
    request(options, function (error, response, body) {
      if (error) return logger.error(error);
      body = JSON.parse(body);

      getChannel(bot, rc).then((channel: TextChannel) => {
        if (body.definitions == undefined) return channel.send(body.message);

        let out = `**${body.word}**\n`;
        body.definitions.forEach(def => {
          out += `_${def.partOfSpeech}_\t${def.definition}\n`;
        });
        channel.send(out).catch(logger.error);
      });
    });
  }
}
