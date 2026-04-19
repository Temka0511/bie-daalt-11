import { CacheFactory } from '../lib/api/CacheFactory';
import { InvalidKeyError, InvalidCapacityError } from '../lib/api/errors';

describe('LRUCache', () => {
  test('set хийсэн утгыг get-ээр авна', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 3 });
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  test('байхгүй түлхүүрт undefined буцаана', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 3 });
    expect(cache.get('missing')).toBeUndefined();
  });

  test('capacity дүүрэхэд хамгийн эртнийг хасна', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 2 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  test('get дараа тухайн утга хамгийн сүүлийн болно', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 2 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
  });

  test('delete ажиллана', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 3 });
    cache.set('a', 1);
    expect(cache.delete('a')).toBe(true);
    expect(cache.has('a')).toBe(false);
  });

  test('clear бүгдийг устгана', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 3 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe('LFUCache', () => {
  test('set/get үндсэн ажиллагаа', () => {
    const cache = CacheFactory.create<string, string>('LFU', { capacity: 3 });
    cache.set('x', 'hello');
    expect(cache.get('x')).toBe('hello');
  });

  test('хамгийн бага давтамжтайг хасна', () => {
    const cache = CacheFactory.create<string, number>('LFU', { capacity: 2 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
  });

  test('has үнэн буцаана', () => {
    const cache = CacheFactory.create<string, number>('LFU', { capacity: 3 });
    cache.set('k', 99);
    expect(cache.has('k')).toBe(true);
    expect(cache.has('missing')).toBe(false);
  });

  test('size зөв тоолно', () => {
    const cache = CacheFactory.create<string, number>('LFU', { capacity: 5 });
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.size).toBe(2);
  });
});

describe('TTLCache', () => {
  test('хугацаанд багтаж байх үед утгыг буцаана', () => {
    const cache = CacheFactory.create<string, string>('TTL', { ttlMs: 5000 });
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  test('хугацаа дууссан утга undefined буцаана', async () => {
    const cache = CacheFactory.create<string, string>('TTL', { ttlMs: 50 });
    cache.set('expired', 'data');
    await new Promise(r => setTimeout(r, 100));
    expect(cache.get('expired')).toBeUndefined();
  });

  test('has хугацаа дууссан бол false буцаана', async () => {
    const cache = CacheFactory.create<string, number>('TTL', { ttlMs: 50 });
    cache.set('k', 1);
    await new Promise(r => setTimeout(r, 100));
    expect(cache.has('k')).toBe(false);
  });

  test('size хугацаа дууссаныг тооцохгүй', async () => {
    const cache = CacheFactory.create<string, number>('TTL', { ttlMs: 50 });
    cache.set('a', 1);
    cache.set('b', 2);
    await new Promise(r => setTimeout(r, 100));
    expect(cache.size).toBe(0);
  });
});

describe('CacheFactory алдаа', () => {
  test('capacity 0 бол InvalidCapacityError шидэнэ', () => {
    expect(() => CacheFactory.create('LRU', { capacity: 0 }))
      .toThrow(InvalidCapacityError);
  });

  test('хоосон түлхүүр бол InvalidKeyError шидэнэ', () => {
    const cache = CacheFactory.create<string, number>('LRU', { capacity: 3 });
    expect(() => cache.set('', 1)).toThrow(InvalidKeyError);
  });

  test('LRU factory зөв үүсгэнэ', () => {
    const cache = CacheFactory.create('LRU', { capacity: 10 });
    expect(cache.size).toBe(0);
  });

  test('LFU factory зөв үүсгэнэ', () => {
    const cache = CacheFactory.create('LFU', { capacity: 10 });
    expect(cache).toBeDefined();
  });

  test('TTL factory зөв үүсгэнэ', () => {
    const cache = CacheFactory.create('TTL', { ttlMs: 1000 });
    expect(cache).toBeDefined();
  });
});
