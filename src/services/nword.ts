import AWS, {DynamoDB} from "aws-sdk";
import {Message} from "discord.js";
import lazy from "../utils/utils";

export class NWord {
  protected dynamo: DynamoDB = new AWS.DynamoDB();

  @lazy
  get tables(): Promise<String[]> {
    const tablesNames = [];
    return this.dynamo.listTables().promise().then(async data => {
      tablesNames.concat(data['TableNames'])
      while (data['LastEvaluatedTableName']) {
        data = await this.dynamo.listTables({
          ExclusiveStartTableName: data['LastEvaluatedTableName']
        }).promise()
        tablesNames.concat(data['TableNames'])
      }
      return tablesNames
    })
  }

  async messageHandler(message: Message): Promise<void> {
    let regex = /([ni]){1,32}((g{2,32}|q){1,32}|[gq]{2,32})[e3r]{1,32}/g
    if (!regex.test(message.content)) {
      return
    }

    let guild = message.guild;
    if (guild) {
      const tables = await this.tables;
      if (!tables.indexOf(guild.id)) {
        this.dynamo.createTable({
          AttributeDefinitions: [
            {
              AttributeName: 'user_id',
              AttributeType: 'S'
            },
            {
              AttributeName: 'nword_count',
              AttributeType: 'N'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'user_id',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'nword_count',
              KeyType: 'RANGE'
            }
          ],
          TableName: guild.id
        })
      }
    }

    let old_count = 0;
    let items = await this.dynamo.query({
      ExpressionAttributeValues: {
        ":v1": {
          S: message.author.id
        }
      },
      KeyConditionExpression: "user_id = :v1",
      ProjectionExpression: "nword_count",
      TableName: guild.id
    }).promise()

    if (items.Count == 1) {
      old_count = parseInt(items.Items[0]['nword_count'].N);
      await this.dynamo.deleteItem({
        Key: {
          "user_id": {
            S: message.author.id
          },
          "nword_count": {
            N: old_count.toString()
          }
        },
        TableName: guild.id
      }).promise()
    }

    this.dynamo.putItem({
      Item: {
        user_id: {
          S: message.author.id
        },
        nword_count: {
          N: (old_count + 1).toString()
        }
      },
      TableName: guild.id
    })
  }
}
