import axios from 'axios';
import encodeurl from 'encodeurl';
import {getLogger} from "./logger";
import {RedisConnector} from './redisConnector';
import Jimp from 'jimp';

const region = 'GMS';
const version = '211.1.0';
const url = `https://maplestory.io/api`;
const logger = getLogger('maplestory');
const rc = RedisConnector.getInstance();
const iconWidth = 40;
const iconHeight = 40;

export const cols = 10;
export const rows = 5;

export enum ItemCategory {
  equip = 'equip', use = 'use', setup = 'setup', etc = 'etc', cash = 'cash'
}

export interface Avatar {
  items: Item[]
}

export interface Description {
  id: number;
  name: string;
  description: string;
}

export interface Value {
  x: number;
  y: number;
  isEmpty: boolean;
}

export interface IconOrigin {
  hasValue: boolean;
  value: Value;
}

export interface IconRawOrigin {
  hasValue: boolean;
  value: Value;
}

export interface MetaInfo {
  only: boolean;
  cash: boolean;
  mob: number;
  iconRaw: string;
  icon: string;
  iconOrigin: IconOrigin;
  iconRawOrigin: IconRawOrigin;
  slotMax: number;
  price: number;
  notSale: boolean;
  tradeBlock: boolean;
  vslots: any[];
  islots: any[];
  setCompleteCount: number;
}

export interface TypeInfo {
  overallCategory: string;
  category: string;
  subCategory: string;
  lowItemId: number;
  highItemId: number;
}

export interface Item {
  id: number;
  description?: Description;
  metaInfo?: MetaInfo;
  typeInfo?: TypeInfo;
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
            axios.get(url + `/${region}/${version}/item/category`)
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

  private fetchItemCategory(category: string) {
    // get all items either from cache or from maplestory.io
    logger.info(`Fetching ${category} data...`);
    let categoryKey = this.redisKeys.category[category];
    rc.get(categoryKey).then(res => {
      if (res == null) {
        axios.get(`https://maplestory.io/api/${region}/${version}/item/category/${category}`).then(res => {
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

  getItemsByCategory(overallcat: string, cat: string, subcat: string): Item[] {
    return this.items[overallcat.toLowerCase()].filter(i => {
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
    let start = page * cols * rows;
    logger.debug(`Generating page image for ${overallcat} ${cat} ${subcat} page ${page}`);

    // make promise for each item icon
    let items = this.getItemsByCategory(overallcat, cat, subcat).slice(start, start + cols * rows);
    let urlPromises: Promise<Item>[] = items.map(i => this.getItem(i.id));

    return Promise.all(urlPromises.map(p => p.catch(e => null)))
      .then(results => {
        return Promise.all<Jimp>(results.map(i => {
          if (i != null) return Jimp.read(getIcon(i));
          return new Jimp(iconHeight, iconWidth);
        }));
      })
      .then(jimps => {
        let x = 0;
        let y = 0;
        let canvas = new Jimp(cols * iconWidth, Math.ceil(items.length / cols) * iconHeight);
        jimps.map((j: Jimp) => j.contain(iconWidth, iconHeight)).forEach(j => {
          canvas.blit(j, x * iconWidth, y * iconHeight);
          x += 1;
          y += Math.floor(x / cols);
          x = x % cols;
        });
        return new Promise<Buffer>((resolve, reject) => {
          canvas.getBuffer('image/png', ((err, value) => {
            if (err) {
              logger.error("Failed to build image with " + `${err}`);
              return reject(err);
            }
            return resolve(value);
          }));
        });
      });
  }

  static getInstance(): MaplestoryApi {
    return MaplestoryApi._instance || new MaplestoryApi();
  }

  getItem(id): Promise<Item> {
    return rc.cachedRequest<Item>({
      url: `${url}/${region}/${version}/item/${id}`,
      method: "GET"
    });
  }
}

export function getIcon(item: Item): Buffer {
  return Buffer.from(item.metaInfo.icon, 'base64');
}

export function renderLink(items: Item[]): string {
  let out = [];
  items.forEach(item => {
    out.push(`{"itemid": "${item.id}", "version": "${'211.1.0'}"}`);
  });
  return 'https://maplestory.io/api/character/' + encodeurl(out.join(',')) + '/stand1/download?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=undefined';
}
