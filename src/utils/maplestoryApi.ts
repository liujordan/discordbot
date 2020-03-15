import axios from 'axios';
import encodeurl from 'encodeurl';
import {getLogger} from "./logger";
import {RedisConnector} from './redisConnector';
import mergeImg from 'merge-img';

const REGION = 'GMS';
const VERSION = '211.1.0';
const URL = `https://maplestory.io/api`;
const logger = getLogger('maplestory');
const rc = RedisConnector.getInstance();

export enum ItemCategory {
  equip = 'equip', use = 'use', setup = 'setup', etc = 'etc', cash = 'cash'

}

export class MaplestoryApi {

  cols = 10;
  rows = 30;
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

  getItemIconPageRedisKey(overall, cat, subcat, page): string {
    return `ms_icons_${overall}_${cat}_${subcat}_${page}`;
  }

  getItemIconPageCached(overall, cat, subcat, page): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      let key = this.getItemIconPageRedisKey(overall, cat, subcat, page);
      rc.get(key).then(res => {
        if (res == null) {
          logger.info(`Getting icons for ${overall}_${cat}_${subcat}_${page} from maplestory.io`);
          this.getItemIconPage(overall, cat, subcat, page).then(buff => {
            rc.set(key, buff.toString('base64')).catch(reject);
            return resolve(buff);
          })
            .catch(reject);
        } else {
          logger.info(`Getting icons for ${overall}_${cat}_${subcat}_${page} from redis cache`);
          resolve(Buffer.from(res, 'base64'));
        }
      });
    });
  }

  getItemIconPage(overallcat, cat, subcat, page: number): Promise<Buffer> {
    let buffers = [];
    let urlPromises = [];
    let rowPromises = [];

    let start = page * this.cols * this.rows;

    // make promise for each item icon
    logger.debug("Making promise for each item icon");
    let items = this.getItemsByCategory(overallcat, cat, subcat).slice(start, start + this.rows * this.cols);
    items.forEach(i => {
      let p = axios.get(getItemIconLinkById(i.id), {responseType: 'arraybuffer'});
      urlPromises.push(p);
    });
    return new Promise((resolve, reject) => {
      // save each item icon into a buffer
      Promise.all(urlPromises.map(p => p.catch(e => {
        logger.error(e);
        return null;
      })))
        .then((results) => {
          logger.debug("Got " + results.filter(r => r != null).length);
          results.forEach(res => {
            if (res == null) return;
            let buff = Buffer.from(res.data, 'binary');
            buffers.push(buff);
          });

          // make a row of icons, save the promise for a buffer
          for (let i = 0; i < this.rows; i++) {
            let buffs = buffers.slice(i * this.rows, i * this.rows + this.cols);
            if (buffs.length < 1) break;
            let p = new Promise((resolve, reject) => {
              mergeImg(buffs).then(img => {
                img.getBuffer('image/png', (err, res) => {
                  if (err) return reject(err);
                  resolve(res);
                });
              });
            }).catch(logger.error);
            rowPromises.push(p);
          }
          // merge all the rows into one and then send it
          Promise.all(rowPromises).then(results => {
            mergeImg(results, {direction: true}).then(img => {
              img.getBuffer('image/png', (err, res) => {
                if (err) reject(err);
                resolve(res);
              });
            });
          })
            .catch(reject);
        })
        .catch(reject);
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