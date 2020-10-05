import {Service} from "../di/serviceDecorator";
import {Category, CategoryItem, ItemsManager} from "../maplestory/interfaces";
import {RedisService} from "./caching/redisService";
import {
  defaultIconHeight,
  defaultIconPageCols,
  defaultIconPageRows,
  defaultIconWidth,
  region,
  url,
  version
} from "../maplestory/constants";
import {MaplestoryItem} from "../maplestory/maplestoryItem";
import {IconGridBuilder} from "../maplestory/iconGridBuilder";
import {getItem, ItemCategory} from "../maplestory/maplestoryApi";
import {getLogger} from "../utils/logger";

const logger = getLogger('maplestory');

@Service()
export class MaplestoryApi {
  items: ItemsManager;
  categories: Category;

  constructor(public rs: RedisService) {
    this.items = {};
    logger.info(`Warming item categories`);
    if (process.env.DISCORDBOT_MODE == 'subscriber') {
      this.fetchItemCategory(ItemCategory.equip);
      this.fetchItemCategory(ItemCategory.use);
      this.fetchItemCategory(ItemCategory.setup);
      this.fetchItemCategory(ItemCategory.etc);
      this.fetchItemCategory(ItemCategory.cash);
    }
  }

  getItemCategories(): Promise<Category> {
    if (this.categories != null) {
      return new Promise(resolve => resolve(this.categories));
    }
    return this.rs.cachedRequest<Category>({
      url: `${url}/${region}/${version}/item/category`
    }).then(result => {
      this.categories = result;
      return new Promise(resolve => resolve(result));
    });
  }


  getItemsByCategory(overallcat: string, cat: string, subcat: string): MaplestoryItem[] {
    return this.items[overallcat.toLowerCase()].filter(i => {
      return i.typeInfo.category == cat && i.typeInfo.subCategory == subcat;
    });
  }

  getItemIconPageCached(overall, cat, subcat, page): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      let key = `ms_icons_${overall}_${cat}_${subcat}_${page}`;
      this.rs.getIconPage(key).then(res => {
        console.log("here");
        if (res == null) {
          logger.info(`Getting icons for ${overall}_${cat}_${subcat}_${page} from maplestory.io`);
          this.getItemIconPage(overall, cat, subcat, page).then(buff => {
            this.rs.setIconPage(key, buff.toString('base64')).catch(reject);
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
    let start = page * defaultIconPageCols * defaultIconPageRows;
    logger.debug(`Generating page image for ${overallcat} ${cat} ${subcat} page ${page}`);

    // make promise for each item icon
    let items = this.getItemsByCategory(overallcat, cat, subcat).slice(start, start + defaultIconPageCols * defaultIconPageRows);
    let urlPromises: Promise<MaplestoryItem>[] = items.map(i => getItem(i.id));

    return Promise.all(urlPromises.map(p => p.catch(e => null)))
      .then(items => {
        return new IconGridBuilder(items)
          .setSize(defaultIconPageCols, defaultIconPageRows)
          .setIconSize(defaultIconHeight, defaultIconWidth)
          .getBuffer();
      });
  }

  private fetchItemCategory(category: string) {
    this.rs.cachedRequest<CategoryItem[]>({
      url: `${url}/${region}/${version}/item/category/${category}`
    }).then(items => {
      this.items[category] = items;
    }).catch(err => {
      logger.error(err);
      throw err;
    });
  }
}
