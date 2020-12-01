import encodeurl from 'encodeurl';
import {AxiosResponse} from "axios";
import {MaplestoryItem} from "./maplestoryItem";
import {region, url, version} from "./constants";
import {MemoryCache} from "../services/caching/memoryCache";
import {RequestService} from "../services/requestService";
import {container} from "tsyringe";

const memoryCache = container.resolve<MemoryCache>(MemoryCache);
const rc = new RequestService(memoryCache);

export enum ItemCategory {
  equip = 'equip', use = 'use', setup = 'setup', etc = 'etc', cash = 'cash'
}

export function getItem(id): Promise<MaplestoryItem> {
  return rc.cachedRequest<MaplestoryItem>({
    url: `${url}/${region}/${version}/item/${id}`,
    method: "GET"
  });
}

export function getIcon(item: MaplestoryItem): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      resolve(Buffer.from(item.metaInfo.icon, 'base64'));
    } catch {
      rc.cachedRequest({url: `${url}/${region}/${version}/item/${item.id}/icon`})
        .then((res: AxiosResponse) => {
          return resolve(Buffer.from(res.data));
        })
        .catch(reject);
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
