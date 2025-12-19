export class BaseGoogleService {
  private _cache: { [key: string]: { data: any; expires: number } } = {};
  private _defaultCacheTTL = 60 * 1000 * 5;

  protected _getCacheValue(key: string) {
    const cacheEntry = this._cache[key];
    if (cacheEntry && cacheEntry.expires > Date.now()) {
      return cacheEntry.data;
    }
    return null;
  }

  protected _setCacheValue(
    key: string,
    data: any,
    ttl: number = this._defaultCacheTTL
  ) {
    this._cache[key] = {
      data,
      expires: Date.now() + ttl,
    };
  }
}
