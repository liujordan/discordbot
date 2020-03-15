import axios from 'axios';
import encodeurl from 'encodeurl';
import {getLogger} from "./logger";
import {RedisConnector} from './redisConnector';

const REGION = 'GMS';
const VERSION = '211.1.0';
const URL = `https://maplestory.io/api`;
const logger = getLogger('maplestory');
const rc = RedisConnector.getInstance();

export enum ItemCategory {
  equip = 'equip', use = 'use', setup = 'setup', etc = 'etc', cash = 'cash'

}

export class MaplestoryApi {
  private static _instance: MaplestoryApi;
  items = {};
  categories;
  redisKeys = {
    category: {
      equip: "ms_category_equip",
      use: "ms_category_use",
      setup: "ms_category_setup",
      etc: "ms_category_etc",
      cash: "ms_category_cash"
    },
    categories: "ms_categories"
  };

  constructor() {
    this.fetchItemCategory(ItemCategory.equip);
    this.fetchItemCategory(ItemCategory.use);
    this.fetchItemCategory(ItemCategory.setup);
    this.fetchItemCategory(ItemCategory.etc);
    this.fetchItemCategory(ItemCategory.cash);
    MaplestoryApi._instance = this;
  }

  getItemCategories() {
    if (this.categories != null) {
      return new Promise((resolve, reject) => resolve(this.categories));
    }

    return new Promise((resolve, reject) => {
      rc.get(this.redisKeys.categories)
        .then(res => {
          if (res === null) {
            axios.get(URL + `/${REGION}/${VERSION}/item/category`)
              .then(res => {
                console.log(res.data);
                let data = res.data;
                rc.set(this.redisKeys.categories, data).catch(logger.error);
                this.categories = data;
                resolve(data);
              })
              .catch(reject);
          } else {
            resolve(JSON.parse(res));
          }
        })
        .catch(reject);
    });
  }

  private fetchItemCategory(category: ItemCategory) {
    // get all items either from cache or from maplestory.io
    logger.info(`Fetching ${category} data...`);
    let categoryKey = this.redisKeys.category[category];
    rc.get(categoryKey).then(res => {
      if (res == null) {
        axios.get(`https://maplestory.io/api/${REGION}/${VERSION}/item/category/${category}`).then(res => {
          rc.set(categoryKey, res.data);
          this.items[category] = res.data;
          logger.info(`Fetched ${category} data from maplestory.io`);
        });
      } else {
        logger.info(`Fetched ${category} data from redis cache`);
        this.items[category] = JSON.parse(res);
      }
    });
  }

  getItemsByCategory(overallcat: ItemCategory, cat: string, subcat: string) {
    return this.items[overallcat].filter(i => {
      return i.typeInfo.category == cat && i.typeInfo.subCategory == subcat;
    });
  }


  static getInstance(): MaplestoryApi {
    return MaplestoryApi._instance || new MaplestoryApi();
  }
}

export interface Avatar {
  items: Item[]
}

export interface Item {
  id: number
}

export function renderLink(items: Item[]): string {
  let out = [];
  items.forEach(item => {
    out.push(`{"itemid": "${item.id}", "version": "${'211.1.0'}"}`);
  });
  return 'https://maplestory.io/api/character/' + encodeurl(out.join(',')) + '/stand1/download?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=undefined';
}

export function getItemIconLinkById(itemid: string): string {
  return `${URL}/${REGION}/${VERSION}/item/${itemid}/icon`;
}