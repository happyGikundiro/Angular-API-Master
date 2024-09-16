import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  private cache = new Map<string, { data: any, expiry: number }>();

  get(key: string): any {
    const cachedData = this.cache.get(key);
    if (cachedData && cachedData.expiry > Date.now()) {
      return cachedData.data;
    }
    return null;
  }

  set(key: string, data: any, ttl: number = 300000) {
    this.cache.set(key, { data, expiry: Date.now() + ttl });
  }

  clear() {
    this.cache.clear();
  }
  
}
