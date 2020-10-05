import {Service} from "../../di/serviceDecorator";
import {BaseCacheService} from "./baseCacheService";
import {KeyError} from "../../exceptions";

const CAPACITY: number = 20;

@Service()
export class MemoryCache extends BaseCacheService {
  private client: Map<string, string>;
  private lru: any[];

  constructor() {
    super();
    this.client = new Map<string, string>();
    this.lru = [];
  }

  public get = async (key: string): Promise<string> => {
    if (!this.client.has(key)) {
      throw KeyError;
    }

    return this.client.get(key);
  };

  public set = async (key: string, val: any): Promise<void> => {
    const valToInsert = JSON.stringify(val);

    // on cache UPDATE
    if (this.client.has(key)) {
      const index = this.lru.findIndex((k) => k == key);
      this.lru.splice(index, 1);
      this.lru.push(key);
      this.client.set(key, valToInsert);
    }

    // normal insert
    if (this.lru.length < CAPACITY) {
      this.lru.push(key);
      this.client.set(key, valToInsert);
    } else {
      // delete least recently used
      const toDelete = this.lru.pop();
      this.client.delete(toDelete);

      // push new item
      this.lru.push(key);
      this.client.set(key, valToInsert);
    }
  };
}
