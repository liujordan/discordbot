import {defaultIconPageCols, defaultIconPageRows} from "./constants";
import {IconGridBuilder} from "./iconGridBuilder";
import {getIcon, getItem} from "./maplestoryApi";
import {IItem} from "../mongo/models/item.model";

export class InventoryManager {
  items: IItem[];

  constructor(items: IItem[]) {
    this.items = items;
  }

  getPage(page: number) {
    return this.items.slice(defaultIconPageCols * defaultIconPageRows * page, defaultIconPageCols * defaultIconPageRows * (page + 1));
  }

  getItem(page: number, x: number, y: number) {
    return this.items[defaultIconPageRows * defaultIconPageCols * page + x + defaultIconPageCols * y];
  }

  renderPage(page: number): Promise<Buffer> {
    const items = this.getPage(page);
    return Promise.all(items.map(item => getItem(item.appearance_id)))
      .then(items => {
        return new IconGridBuilder(items).getBuffer();
      });
  }

  renderItem(page: number, x: number, y: number): Promise<Buffer> {
    const item = this.getItem(page, x, y);
    return getItem(item.appearance_id).then(i => getIcon(i));
  }
}
