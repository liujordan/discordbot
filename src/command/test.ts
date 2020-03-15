import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {RedisCommand} from "../utils/redisConnector";
import {MaplestoryApi} from "../utils/maplestoryApi";

const ms = MaplestoryApi.getInstance();

export class Test extends BaseCommand {
  name = 'test';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;


  execute(rc: RedisCommand) {

  }
}
