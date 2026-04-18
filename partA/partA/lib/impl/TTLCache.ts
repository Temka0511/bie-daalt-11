import { Cache } from '../api/Cache';
import { InvalidKeyError } from '../api/errors';

interface Entry<V> {
  value: V;
  expiresAt: number;
}

export class TTLCache<K, V> implements Cache<K, V> {
  private readonly store: Map<K, Entry<V>> = new Map();
  private readonly ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    if (key === '' || key === null || key === undefined) {
      throw new InvalidKeyError();
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: K): boolean { return this.get(key) !== undefined; }
  delete(key: K): boolean { return this.store.delete(key); }
  clear(): void { this.store.clear(); }
  get size(): number {
    let count = 0;
    const now = Date.now();
    for (const entry of this.store.values()) {
      if (now <= entry.expiresAt) count++;
    }
    return count;
  }
}
