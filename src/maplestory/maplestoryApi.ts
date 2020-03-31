import encodeurl from 'encodeurl';
import {RedisService} from '../services/redisService';
import {AxiosResponse} from "axios";
import {MaplestoryItem} from "./maplestoryItem";
import {region, url, version} from "./constants";
import {Injector} from "../di/injector";

const rc = Injector.resolve<RedisService>(RedisService);
export enum ItemCategory {
  equip = 'equip', use = 'use', setup = 'setup', etc = 'etc', cash = 'cash'
}

export function getItem(id): Promise<MaplestoryItem> {
  return rc.cachedRequest<MaplestoryItem>({
    url: `${url}/${region}/${version}/item/${id}`,
    method: "GET"
  }, true);
}

export function getIcon(item: MaplestoryItem): Promise<Buffer> {
  return new Promise<Buffer>(resolve => {
    try {
      resolve(Buffer.from(item.metaInfo.icon, 'base64'));
    } catch {
      rc.cachedRequest({url: `${url}/${region}/${version}/item/${item.id}/icon`}, true)
        .then((res: AxiosResponse) => {
          return resolve(Buffer.from(res.data));
        });
    }
  });
}

export function renderLink(items: MaplestoryItem[]): string {
  let out = [];
  items.forEach(item => {
    out.push(`{"itemid": "${item.id}", "version": "${'211.1.0'}"}`);
  });
  return 'https://maplestory.io/api/character/' + encodeurl(out.join(',')) + '/stand1/download?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=undefined';
}
