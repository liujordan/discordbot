import {AxiosResponse} from "axios";
import {region, url, version} from "./maplestoryApi";
import {RedisConnector} from "../utils/redisConnector";

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

export interface MaplestoryItem {
  id: number;
  description?: Description;
  metaInfo?: MetaInfo;
  typeInfo?: TypeInfo;
}

const rc = RedisConnector.getInstance();

export abstract class BaseItem {
  constructor(item: MaplestoryItem) {
    Object.assign(this, item);
  }
}

export class DisplayableItem extends BaseItem {
  getIcon(item: MaplestoryItem): Promise<Buffer> {
    try {
      return new Promise<Buffer>(resolve => resolve(Buffer.from(item.metaInfo.icon, 'base64')));
    } catch {
      try {
        return rc.cachedRequest({url: `${url}/${region}/${version}/item/${item.id}/icon`}, true)
          .then((res: AxiosResponse) => {
            return new Promise(resolve => resolve(Buffer.from(res.data)));
          });
      } catch {
        return null;
      }
    }
  }
}

export class Equipable extends DisplayableItem {

}
