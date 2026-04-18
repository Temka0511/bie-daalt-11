import { Cache } from '../api/Cache';
import { InvalidKeyError } from '../api/errors';

export class LFUCache<K, V> implements Cache<K, V> {
  private readonly values: Map<K, V> = new Map();
  private readonly freq: Map<K, number> = new Map();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.values.has(key)) return undefined;
    this.freq.set(key, (this.freq.get(key) ?? 0) + 1);
    return this.values.get(key);
  }

  set(key: K, value: V): void {
    if (key === '' || key === null || key === undefined) {
      throw new InvalidKeyError();
    }
    if (this.values.has(key)) {
      this.values.set(key, value);
      this.freq.set(key, (this.freq.get(key) ?? 0) + 1);
      return;
    }
    if (this.values.size >= this.capacity) {
      let minFreq = Infinity;
      let minKey: K | undefined;
      for (const [k, f] of this.freq) {
        if (f < minFreq) { minFreq = f; minKey = k; }
      }
      if (minKey !== undefined) {
        this.values.delete(minKey);
        this.freq.delete(minKey);
      }
    }
    this.values.set(key, value);
    this.freq.set(key, 1);
  }

  has(key: K): boolean { return this.values.has(key); }
  delete(key: K): boolean {
    this.freq.delete(key);
    return this.values.delete(key);
  }
  clear(): void { this.values.clear(); this.freq.clear(); }
  get size(): number { return this.values.size; }
}
