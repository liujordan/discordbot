import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import request from 'request';
import {logger} from "../utils/logger";
import {RedisCommand} from "../utils/redisConnector";
import {Client} from "discord.js";

function getRapidApiHeader(apiName: string) {
  return {
    'x-rapidapi-host': environment.rapidApi[apiName].host,
    'x-rapidapi-key': environment.rapidApi[apiName].key
  };
}

export class Define extends BaseCommand {
  name = 'define';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;

  execute(bot: Client, rc: RedisCommand) {
    let options2 = {
      method: 'GET',
      url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
      headers: getRapidApiHeader("urbanDictionary"),
      qs: {term: rc.arguments.join(" ")},
    };
    logger.debug("defining " + rc.arguments.join(" "));
    request(options2, (error, response, body) => {
      if (error) throw new Error(error);
      body = JSON.parse(body);
      if (body.list.length === 0) return this.send(rc, "word not found");
      let def = body.list[0];
      let out = `**${def.word}**\n`;

      logger.debug("found " + def.definition);
      out += `${def.definition}\n`;
      out += `\n> ${def.example.replace(/\n/g, '\n> ')}\n`;
      out = out.replace(/[\[\]]/g, '');
      out.match(/[\s\S]{1,2000}/g).forEach(msg => {
        this.send(rc, msg);
      });
    });
  }
}
