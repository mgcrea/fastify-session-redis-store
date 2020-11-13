/* eslint-disable */
import { RedisStore } from 'src/RedisStore';
import Redis from 'ioredis';

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_URI = process.env.REDIS_URI || `redis://${REDIS_HOST}:${REDIS_PORT}/1`;

describe('RedisStore', () => {
  const redisClient = new Redis(REDIS_URI);
  const store = new RedisStore({ client: redisClient, ttl: 60 });
  const context = new Map<string, any>([
    ['id', 'QLwqf4XJ1dmkiT41RB0fM'],
    ['data', { foo: 'bar' }],
    ['expiry', Date.now() + 6e3],
  ]);

  afterAll(() => {
    redisClient.disconnect();
  });

  it('should properly set a key', async () => {
    const result = await store.set(context.get('id'), context.get('data'), context.get('expiry'));
    expect(result).toBeUndefined();
  });
  it('should properly get a key', async () => {
    const result = await store.get(context.get('id'));
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result![0]).toEqual(context.get('data'));
    expect(result![1]).toEqual(context.get('expiry'));
  });
  it('should properly destory a key', async () => {
    const result = await store.destroy(context.get('id'));
    expect(result).toBeUndefined();
    const result2 = await store.get(context.get('id'));
    expect(result2).toBe(null);
  });
});
