import encodeurl from 'encodeurl';
import {getLogger} from "../utils/logger";
import {RedisConnector} from '../utils/redisConnector';
import {IconGridBuilder} from "./iconGridBuilder";

export const region = 'GMS';
export const version = '211.1.0';
export const url = `https://maplestory.io/api`;
export const defaultIconWidth = 40;
export const defaultIconHeight = 40;

export const defaultIconPageCols = 10;
export const defaultIconPageRows = 5;

const logger = getLogger('maplestory');
const rc = RedisConnector.getInstance();

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

export interface Accessory {
  item1: string;
  item2: number;
  item3: number;
}

export interface Armor {
  item1: string;
  item2: number;
  item3: number;
}

export interface Other {
  item1: string;
  item2: number;
  item3: number;
}

export interface OneHandedWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface SecondaryWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface TwoHandedWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface Character {
  item1: string;
  item2: number;
  item3: number;
}

export interface Monster {
  item1: string;
  item2: number;
  item3: number;
}

export interface Mount {
  item1: string;
  item2: number;
  item3: number;
}

export interface Equip {
  Accessory: Accessory[];
  Armor: Armor[];
  Other: Other[];
  "One-Handed Weapon": OneHandedWeapon[];
  "Secondary Weapon": SecondaryWeapon[];
  "Two-Handed Weapon": TwoHandedWeapon[];
  Character: Character[];
  Monster: Monster[];
  Mount: Mount[];
}

export interface Consumable {
  item1: string;
  item2: number;
  item3: number;
}

export interface ArmorScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface WeaponScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface SpecialScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface CharacterModification {
  item1: string;
  item2: number;
  item3: number;
}

export interface Tablet {
  item1: string;
  item2: number;
  item3: number;
}

export interface Projectile {
  item1: string;
  item2: number;
  item3: number;
}

export interface MonsterFamiliar {
  item1: string;
  item2: number;
  item3: number;
}

export interface Recipe {
  item1: string;
  item2: number;
  item3: number;
}

export interface Other2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Use {
  Consumable: Consumable[];
  "Armor Scroll": ArmorScroll[];
  "Weapon Scroll": WeaponScroll[];
  "Special Scroll": SpecialScroll[];
  "Character Modification": CharacterModification[];
  Tablet: Tablet[];
  Projectile: Projectile[];
  "Monster/Familiar": MonsterFamiliar[];
  Recipe: Recipe[];
  Other: Other2[];
}

export interface Other3 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Commerci {
  item1: string;
  item2: number;
  item3: number;
}

export interface EvolutionLab {
  item1: string;
  item2: number;
  item3: number;
}

export interface Nebulite {
  item1: string;
  item2: number;
  item3: number;
}

export interface Setup {
  Other: Other3[];
  Commerci: Commerci[];
  "Evolution Lab": EvolutionLab[];
  Nebulite: Nebulite[];
}

export interface Other4 {
  item1: string;
  item2: number;
  item3: number;
}

export interface CashShop {
  item1: string;
  item2: number;
  item3: number;
}

export interface Crafting {
  item1: string;
  item2: number;
  item3: number;
}

export interface Etc {
  Other: Other4[];
  "Cash Shop": CashShop[];
  Crafting: Crafting[];
}

export interface TimeSaver {
  item1: string;
  item2: number;
  item3: number;
}

export interface RandomReward {
  item1: string;
  item2: number;
  item3: number;
}

export interface EquipmentModification {
  item1: string;
  item2: number;
  item3: number;
}

export interface CharacterModification2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Weapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface Accessory2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Appearance {
  item1: string;
  item2: number;
  item3: number;
}

export interface Pet {
  item1: string;
  item2: number;
  item3: number;
}

export interface FreeMarket {
  item1: string;
  item2: number;
  item3: number;
}

export interface MessengerAndSocial {
  item1: string;
  item2: number;
  item3: number;
}

export interface Miscellaneous {
  item1: string;
  item2: number;
  item3: number;
}

export interface Cash {
  "Time Saver": TimeSaver[];
  "Random Reward": RandomReward[];
  "Equipment Modification": EquipmentModification[];
  "Character Modification": CharacterModification2[];
  Weapon: Weapon[];
  Accessory: Accessory2[];
  Appearance: Appearance[];
  Pet: Pet[];
  "Free Market": FreeMarket[];
  "Messenger and Social": MessengerAndSocial[];
  Miscellaneous: Miscellaneous[];
}

export interface Category {
  Equip: Equip;
  Use: Use;
  Setup: Setup;
  Etc: Etc;
  Cash: Cash;
}

export interface TypeInfo {
  overallCategory: string;
  category: string;
  subCategory: string;
  lowItemId: number;
  highItemId: number;
}

export interface CategoryItem {
  isCash: boolean;
  name: string;
  desc: string;
  id: number;
  typeInfo: TypeInfo;
}

export interface ItemsManager {
  equip?: CategoryItem[]
  use?: CategoryItem[]
  setup?: CategoryItem[]
  etc?: CategoryItem[]
  cash?: CategoryItem[]
}

export class MaplestoryApi {
  private static _instance: MaplestoryApi;

  items: ItemsManager;
  categories: Category;

  constructor() {
    this.items = {};
    logger.info(`Warming item categories`);
    this.fetchItemCategory(ItemCategory.equip);
    this.fetchItemCategory(ItemCategory.use);
    this.fetchItemCategory(ItemCategory.setup);
    this.fetchItemCategory(ItemCategory.etc);
    this.fetchItemCategory(ItemCategory.cash);
    MaplestoryApi._instance = this;
  }

  getItemCategories(): Promise<Category> {
    if (this.categories != null) {
      return new Promise(resolve => resolve(this.categories));
    }
    return rc.cachedRequest<Category>({
      url: `${url}/${region}/${version}/item/category`
    }).then(result => {
      this.categories = result;
      return new Promise(resolve => resolve(result));
    });
  }

  private fetchItemCategory(category: string) {
    rc.cachedRequest<CategoryItem[]>({
      url: `${url}/${region}/${version}/item/category/${category}`
    }).then(items => {
      this.items[category] = items;
    }).catch(logger.error);
  }

  getItemsByCategory(overallcat: string, cat: string, subcat: string): Item[] {
    return this.items[overallcat.toLowerCase()].filter(i => {
      return i.typeInfo.category == cat && i.typeInfo.subCategory == subcat;
    });
  }

  getItemIconPageCached(overall, cat, subcat, page): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      let key = `ms_icons_${overall}_${cat}_${subcat}_${page}`;
      rc.getIconPage(key).then(res => {
        console.log("here");
        if (res == null) {
          logger.info(`Getting icons for ${overall}_${cat}_${subcat}_${page} from maplestory.io`);
          this.getItemIconPage(overall, cat, subcat, page).then(buff => {
            rc.setIconPage(key, buff.toString('base64')).catch(reject);
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
    let urlPromises: Promise<Item>[] = items.map(i => this.getItem(i.id));

    return Promise.all(urlPromises.map(p => p.catch(e => null)))
      .then(items => {
        return new IconGridBuilder(items)
          .setSize(defaultIconPageCols, defaultIconPageRows)
          .setIconSize(defaultIconHeight, defaultIconWidth)
          .getBuffer();
      });
  }

  static getInstance(): MaplestoryApi {
    return MaplestoryApi._instance || new MaplestoryApi();
  }

  getItem(id): Promise<Item> {
    return rc.cachedRequest<Item>({
      url: `${url}/${region}/${version}/item/${id}`,
      method: "GET"
    }, true);
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
