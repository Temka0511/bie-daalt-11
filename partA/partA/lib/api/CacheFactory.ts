import { Cache } from './Cache';
import { LRUCache } from '../impl/LRUCache';
import { LFUCache } from '../impl/LFUCache';
import { TTLCache } from '../impl/TTLCache';
import { InvalidCapacityError } from './errors';

export type CacheStrategy = 'LRU' | 'LFU' | 'TTL';

export interface CacheOptions {
  capacity?: number;
  ttlMs?: number;
}

export class CacheFactory {
  static create<K, V>(strategy: CacheStrategy, options: CacheOptions = {}): Cache<K, V> {
    const capacity = options.capacity ?? 100;
    const ttlMs = options.ttlMs ?? 60_000;

    if (capacity < 1) {
      throw new InvalidCapacityError(capacity);
    }

    switch (strategy) {
      case 'LRU': return new LRUCache<K, V>(capacity);
      case 'LFU': return new LFUCache<K, V>(capacity);
      case 'TTL': return new TTLCache<K, V>(ttlMs);
    }
  }
}
