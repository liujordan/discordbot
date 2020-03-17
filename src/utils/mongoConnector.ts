import {Db, MongoClient} from 'mongodb';
import {getLogger} from "./logger";
import {Avatar, Item} from "./maplestoryApi";
import {environment} from "../config/environment";

const url = `mongodb://${environment.mongo.host}:${environment.mongo.port}`;
const dbName = 'myproject';
const logger = getLogger('mongo');
const avatarCollection = "avatar";
const inventoryCollection = "inventory";

export interface avatarMember {
  _id: string;
  user_id: string;
  avatar: Avatar;
}

export class MongoConnector {
  private static _instance: MongoConnector;
  client: MongoClient;
  db: Db;

  constructor() {
    this.client = new MongoClient(url);
    this.client.connect((err) => {
      if (err) return logger.error(err);
      logger.info("Connected successfully to server");
      this.db = this.client.db(dbName);
    });
    MongoConnector._instance = this;
  }

  static getInstance(): MongoConnector {
    return MongoConnector._instance || new MongoConnector();
  }

  getAvatar(userid: string): Promise<Avatar> {
    logger.info("Getting avatar " + userid);
    return new Promise((resolve, reject) => {
      this.db.collection(avatarCollection).findOne({user_id: userid}, (err, result: avatarMember) => {
        if (err) return reject(err);
        if (result == null) return resolve(null);
        return resolve(result.avatar);
      });
    });
  }

  addAvatar(userid: string, avatar: Avatar): Promise<Avatar> {
    logger.info("Adding avatar for " + userid);
    return new Promise((resolve, reject) => {
      this.db.collection(avatarCollection).insertOne({user_id: userid, avatar: avatar}, (err, result) => {
        if (err) return reject(err);
        return resolve(avatar);
      });
    });
  }

  getInventory(userid: string): Promise<Item[]> {
    logger.info(`Getting ${userid} inventory`);
    return new Promise<Item[]>((resolve, reject) => {
      this.db.collection(inventoryCollection).findOne({user_id: userid}, ((error, result) => {
        if (error) return reject(error);
        if (result != null) return resolve(result.items);
        return resolve([]);
      }));
    });
  }

  addToInventory(userid: string, item: Item) {
    logger.info(`Adding ${item.description.name} to ${userid} inventory`);
    return new Promise((resolve, reject) => {
      this.db.collection(inventoryCollection).updateOne(
        {user_id: userid},
        {$push: {items: item}},
        {upsert: true},
        (error, result) => {
          if (error) return reject(error);
        });
    });
  }
}

