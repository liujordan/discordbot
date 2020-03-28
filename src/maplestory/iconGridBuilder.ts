import Jimp from "jimp";
import {getIcon} from "./maplestoryApi";
import {MaplestoryItem} from "./maplestoryItem";
import {defaultIconHeight, defaultIconPageCols, defaultIconPageRows, defaultIconWidth} from "./constants";

export class IconGridBuilder {
  rows: number = defaultIconPageRows;
  cols: number = defaultIconPageCols;
  iconHeight: number = defaultIconHeight;
  iconWidth: number = defaultIconWidth;
  items: MaplestoryItem[];

  constructor(items: MaplestoryItem[]) {
    this.items = items;
  }

  setSize(w: number, h: number): IconGridBuilder {
    this.rows = h;
    this.cols = w;
    return this;
  }

  setIconSize(w: number, h: number): IconGridBuilder {
    this.iconHeight = h;
    this.iconWidth = w;
    return this;
  }

  getBuffer(): Promise<Buffer> {
    let canvas = new Jimp(this.iconWidth * this.cols, this.iconHeight * this.rows);
    return Promise.all<Jimp>(this.items.map(i => {
      if (i == null) return new Promise(resolve => resolve(new Jimp(defaultIconWidth, defaultIconHeight)));
      return getIcon(i).then(buff => {
        return Jimp.read(buff);
      });
    })).then(jimps => {
      let x = 0;
      let y = 0;
      jimps.map(i => {
        return i.contain(this.iconWidth, this.iconHeight);
      }).forEach(i => {
        canvas.blit(i, x * this.iconWidth, y * this.iconHeight);
        x += 1;
        y = y + Math.floor(x / this.cols);
        x = x % this.cols;
      });
      return new Promise((resolve, reject) => {
        canvas.getBuffer('image/png', ((err, value) => {
          if (err) return reject(err);
          return resolve(value);
        }));
      });
    });
  }
}