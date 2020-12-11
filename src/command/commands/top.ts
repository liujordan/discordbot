import {BaseCommand} from './baseCommand';
import {RapidApi} from "../../utils";
import {ParsedMessage} from "discord-command-parser";
import {inject, injectable} from "tsyringe";
import {ConfigProvider} from "../../provider/configuration";
import AWS from 'aws-sdk';
import {Message} from "discord.js";

@injectable()
export class Top extends BaseCommand {
  name = 'top';
  helpString = 'who is saying the n-word the most';

  async execute(rc: ParsedMessage<Message>): Promise<void> {
    let result = await new AWS.DynamoDB.DocumentClient().query({
      AttributesToGet: [
        "user_id",
        "nword_count"
      ],
      TableName: rc.message.guild.id,
      Limit: 1,
      ScanIndexForward: false,
    }).promise()
    let items = result.Items[0]['nword_count'].N
    console.log(items)
    // rc.message.guild.members.cache.fetch()
  }
}
