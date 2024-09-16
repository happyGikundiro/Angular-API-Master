import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cacheService = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(cacheService).toBeTruthy();
  });

  it('should cache and retrieve data correctly', () => {
    const cacheKey = 'testKey';
    const cacheData = { value: 'testData' };
    const timeToLive = 5000; 

    cacheService.set(cacheKey, cacheData, timeToLive);
    expect(cacheService.get(cacheKey)).toEqual(cacheData);

    jest.useFakeTimers();
    jest.advanceTimersByTime(timeToLive + 1);
    expect(cacheService.get(cacheKey)).toBeNull();
    jest.useRealTimers();
  });

  it('should clear the cache', () => {
    const firstCacheKey = 'firstKey';
    const firstCacheData = { value: 'data1' };
    const secondCacheKey = 'secondKey';
    const secondCacheData = { value: 'data2' };

    cacheService.set(firstCacheKey, firstCacheData);
    cacheService.set(secondCacheKey, secondCacheData);
    expect(cacheService.get(firstCacheKey)).toEqual(firstCacheData);
    expect(cacheService.get(secondCacheKey)).toEqual(secondCacheData);

    cacheService.clear();
    expect(cacheService.get(firstCacheKey)).toBeNull();
    expect(cacheService.get(secondCacheKey)).toBeNull();
  });

  it('should handle cache expiration correctly', () => {
    const expiringCacheKey = 'expiringKey';
    const expiringCacheData = { value: 'expiringData' };
    const shortTimeToLive = 100; 

    cacheService.set(expiringCacheKey, expiringCacheData, shortTimeToLive);
    expect(cacheService.get(expiringCacheKey)).toEqual(expiringCacheData);

    jest.useFakeTimers();
    jest.advanceTimersByTime(shortTimeToLive + 1);
    expect(cacheService.get(expiringCacheKey)).toBeNull();
    jest.useRealTimers();
  });
});
