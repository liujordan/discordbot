import {MaplestoryItem} from "./maplestoryItem";

export interface Inventory {
  items: MaplestoryItem[]
}

export interface Page {
  items: MaplestoryItem[]
}

export class InventoryManager {
  constructor() {
  }

  getPage(page: number) {

  }
}