import axios, {AxiosRequestConfig} from "axios";
import {getLogger} from "../utils/logger";
import {CacheService} from "./caching/baseCacheService";

const logger = getLogger('Request');

export class RequestService {
  constructor(private cache: CacheService) {
  }

  async cachedRequest<T>(req: AxiosRequestConfig): Promise<T> {
    let get = this.cache.get;
    let set = this.cache.set;
    return get(req.url)
      .then(reply => {
        // cache hit end here and return
        logger.debug(`Getting ${req.url} from cache`);

        return JSON.parse(reply);
      })
      .catch(async e => {
        // cache miss, make the request and save the response iff status code is 200
        logger.debug(`Cache miss: ${req.url}`);
        logger.debug(`Getting ${req.url} from remote`);

        const res = await axios.request<T>(req);
        if (res.status === 200 && res.data != null) {
          await set(req.url, JSON.stringify(res.data));
        }
        return res.data;
      });
  }
}
