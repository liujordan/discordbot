import axios from 'axios';
import encodeurl from 'encodeurl';

const REGION = 'GMS';
const VERSION = '211.1.0';
const URL = `https://maplestory.io/api`;

export interface Item {
  id: number
}


export function getItemCategories() {
  return axios({
    url: URL + `/${REGION}/${VERSION}/item/category`
  });
}

export function render(items: Item[]) {
  let out = [];
  items.forEach(item => {
    out.push(`{"itemid": "${item.id}", "version": "${'211.1.0'}"}`);
  });
  return 'https://maplestory.io/api/character/' + encodeurl(out.join(',')) + '/stand1/download?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=undefined';
}