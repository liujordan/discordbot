import {NotImplemented} from "../../exceptions";

export interface CacheService {
  set: (key: string, val: any) => Promise<void>
  get: (key: string) => Promise<string>
}

export class BaseCacheService implements CacheService {
  async get(_: string): Promise<string> {
    throw new NotImplemented();
  }

  async set(key: string, val: any): Promise<void> {
    throw new NotImplemented();
  }
}
