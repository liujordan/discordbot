import redis from 'redis';
import {getLogger} from "../../utils/logger";
import {AxiosRequestConfig} from "axios";
import {TextChannel} from "discord.js";
import {IUser} from "../../mongo/models/user.model";
import {Service} from "../../di/serviceDecorator";
import {BaseCacheService, CacheService} from "./baseCacheService";
import {RequestService} from "../requestService";
import {MemoryCache} from "./memoryCache";
import {Injector} from "../../di/injector";

export interface RedisCommand {
  command: string
  arguments: string[]
  data: {
    guild_id: string
    message_id: string
    channel_id: string
    user_id: string
    content: string
    channel_type: string
  },
  channel?: TextChannel,
  user?: IUser
}

const logger = getLogger('redis');

@Service()
export class RedisService extends BaseCacheService {
  private static _instance: RedisService;
  client: CacheService;
  // pagesCache;
  // generalLru;

  requestService: RequestService;


  constructor(readonly memoryCache: MemoryCache) {
    super();
    // this.client = redis.createClient({host: environment.redis.host,});
    // this.client.on('connect', () => {
    //   logger.info("Ready");
    // });
    this.client = memoryCache;
    // this.pagesCache = lru(this.client, {max: 100, namespace: 'pages'});
    // this.generalLru = lru(this.client, {max: 2000, namespace: 'general'});
    this.requestService = new RequestService(memoryCache);

    RedisService._instance = this;
  }

  // close() {
  //   this.client.quit();
  // }

  static getInstance(): RedisService {
    return Injector.resolve<RedisService>(RedisService);
  }

  // this should only be used for request that serves static data
  cachedRequest<T>(req: AxiosRequestConfig, lru: boolean = false): Promise<T> {
    return this.requestService.cachedRequest<T>(req);
  }

  setIconPage(key: string, val: any): Promise<any> {
    return this.client.set(key, val);
  }

  getIconPage(key: string): Promise<string> {
    return this.client.get(key);
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async set(key: string, val: any): Promise<any> {
    return this.client.set(key, val);
  }
}
