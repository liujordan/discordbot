import AWS from 'aws-sdk';
import lazy from "../utils/utils";

export class DynamoDb extends AWS.DynamoDB {

  @lazy
  get tables(): Promise<String[]> {
    const tablesNames = [];
    return this.listTables().promise().then(async data => {
      tablesNames.concat(data['TableNames'])
      while (data['LastEvaluatedTableName']) {
        data = await this.listTables({
          ExclusiveStartTableName: data['LastEvaluatedTableName']
        }).promise()
        tablesNames.concat(data['TableNames'])
      }
      return tablesNames
    })
  }
}
