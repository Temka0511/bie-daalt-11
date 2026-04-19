import { Cache } from '../api/Cache';
import { InvalidKeyError } from '../api/errors';

export class LRUCache<K, V> implements Cache<K, V> {
  private readonly store: Map<K, V>;
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.store = new Map();
  }

  get(key: K): V | undefined {
    if (!this.store.has(key)) return undefined;
    const value = this.store.get(key)!;
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (key === '' || key === null || key === undefined) throw new InvalidKeyError();
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.capacity) {
      const oldest = this.store.keys().next().value as K;
      this.store.delete(oldest);
    }
    this.store.set(key, value);
  }

  has(key: K): boolean { return this.store.has(key); }
  delete(key: K): boolean { return this.store.delete(key); }
  clear(): void { this.store.clear(); }
  get size(): number { return this.store.size; }
}
