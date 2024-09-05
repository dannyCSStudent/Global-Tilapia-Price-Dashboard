// lib/cacheService.ts
class CacheService {
    static setItem(key: string, value: any, ttl: number): void {
      const item = {
        value: value,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  
    static getItem(key: string): any | null {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
  
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    }
  }
  
  export default CacheService;