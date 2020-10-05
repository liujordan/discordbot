import {IItem, Item} from "../src/mongo/models/item.model";

export class ItemMaker {
  constructor() {
    this.makeItem({
      appearance_id: '1000000',
      max_upgrades: 10
    }).then(item => {
      console.log("ASDFASDFASDF");
      console.log(item);
    });


  }

  makeItem(config): Promise<IItem> {
    return new Item(config).save();
  }
}

new ItemMaker();
