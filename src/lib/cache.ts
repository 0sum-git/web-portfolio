import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'src/data/cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

interface CacheData<T> {
  timestamp: number;
  data: T;
}

function getCachePath(key: string): string {
  return path.join(CACHE_DIR, `${key}.json`);
}

function isCacheValid(cachePath: string): boolean {
  if (!fs.existsSync(cachePath)) return false;
  const cache: CacheData<unknown> = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

export function saveToCache<T>(key: string, data: T): void {
  const cachePath = getCachePath(key);
  const cacheData: CacheData<T> = { timestamp: Date.now(), data };
  fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
}

export function getFromCache<T>(key: string): T | null {
  const cachePath = getCachePath(key);
  if (!isCacheValid(cachePath)) return null;
  const cache: CacheData<T> = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  return cache.data;
} 